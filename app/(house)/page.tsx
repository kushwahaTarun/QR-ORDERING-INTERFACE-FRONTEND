"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  CookingPot,
  CurrencyInr,
  ForkKnife,
  House,
  QrCode,
  Receipt,
  UsersThree,
} from "@phosphor-icons/react";
import { EmptyState } from "@/components/house/empty-state";
import { IconWell } from "@/components/house/icon-well";
import { KpiCard } from "@/components/house/kpi-card";
import { LoadState } from "@/components/house/load-state";
import { PageHeader } from "@/components/house/page-header";
import { StatusBadge } from "@/components/house/status-badge";
import { useAuth } from "@/components/house/auth-provider";
import { useLiveOrders } from "@/components/house/live-provider";
import { greetingNow } from "@/lib/copy";
import { formatTime, inr } from "@/lib/format";
import { isOpenStatus, upsertOrder } from "@/lib/live";
import type { HouseOrder } from "@/lib/types";
import { useHouse } from "@/lib/use-house";

type RestaurantDash = {
  scope: "restaurant";
  restaurant: {
    name: string;
    location: string | null;
    hours: string | null;
  };
  kpis: {
    ordersToday: number;
    revenueToday: number | null;
    openOrders: number;
    tables: number;
    offerOptInsToday: number;
  };
  liveOrders: HouseOrder[];
  topItemsToday: { name: string; quantity: number }[];
};

type PlatformDash = {
  scope: "platform";
  kpis: {
    restaurants: number;
    ordersToday: number;
    revenueToday: number;
    openOrders: number;
  };
  restaurants: {
    id: string;
    name: string;
    location: string | null;
    orders: number;
    menuItems: number;
    revenueToday: number;
  }[];
};

export default function TodayPage() {
  const { selectedRestaurantId, isSuper, selectRestaurant } = useAuth();
  const { data, error, loading, setData } = useHouse<
    RestaurantDash | PlatformDash
  >("/admin/dashboard");

  useLiveOrders((event) => {
    setData((current) => {
      if (!current) return current;
      if (current.scope === "platform") {
        if (event.type !== "order.created") return current;
        return {
          ...current,
          kpis: {
            ...current.kpis,
            ordersToday: current.kpis.ordersToday + 1,
            revenueToday: current.kpis.revenueToday + event.order.total,
            openOrders: current.kpis.openOrders + 1,
          },
        };
      }

      if (event.type === "order.created") {
        if (current.liveOrders.some((row) => row.id === event.order.id)) {
          return current;
        }
        const top = current.topItemsToday.map((row) => ({ ...row }));
        for (const line of event.order.items) {
          const found = top.find((row) => row.name === line.name);
          if (found) found.quantity += line.quantity;
          else top.push({ name: line.name, quantity: line.quantity });
        }
        top.sort((a, b) => b.quantity - a.quantity);
        return {
          ...current,
          liveOrders: isOpenStatus(event.order.status)
            ? [event.order, ...current.liveOrders]
            : current.liveOrders,
          kpis: {
            ...current.kpis,
            ordersToday: current.kpis.ordersToday + 1,
            openOrders:
              current.kpis.openOrders +
              (isOpenStatus(event.order.status) ? 1 : 0),
            revenueToday:
              current.kpis.revenueToday === null
                ? null
                : current.kpis.revenueToday + event.order.total,
            offerOptInsToday:
              current.kpis.offerOptInsToday + (event.order.wantsOffers ? 1 : 0),
          },
          topItemsToday: top.slice(0, 5),
        };
      }

      const wasOpen = current.liveOrders.some((row) => row.id === event.order.id);
      const nowOpen = isOpenStatus(event.order.status);
      let liveOrders = current.liveOrders.filter(
        (row) => row.id !== event.order.id,
      );
      if (nowOpen) liveOrders = upsertOrder(liveOrders, event.order);
      let openOrders = current.kpis.openOrders;
      if (wasOpen && !nowOpen) openOrders = Math.max(0, openOrders - 1);
      if (!wasOpen && nowOpen) openOrders += 1;
      return {
        ...current,
        liveOrders,
        kpis: { ...current.kpis, openOrders },
      };
    });
  });

  const houseName =
    data && "restaurant" in data ? data.restaurant.name : "";

  return (
    <div>
      <PageHeader
        icon={House}
        title={houseName ? `${greetingNow()} — ${houseName}` : greetingNow()}
        description="Today’s orders, kitchen, and what is selling."
      />
      <LoadState loading={loading && !data} error={error}>
        {data?.scope === "platform" ? (
          <PlatformView
            data={data}
            onOpen={(id) => void selectRestaurant(id)}
          />
        ) : data?.scope === "restaurant" ? (
          <RestaurantView data={data} />
        ) : isSuper && !selectedRestaurantId ? (
          <EmptyState
            title="Pick a restaurant"
            body="Use the list at the top of the page."
          />
        ) : null}
      </LoadState>
    </div>
  );
}

function RestaurantView({ data }: { data: RestaurantDash }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          icon={Receipt}
          label="Orders today"
          value={String(data.kpis.ordersToday)}
          index={0}
        />
        <KpiCard
          icon={CurrencyInr}
          label="Sales today"
          value={inr(data.kpis.revenueToday)}
          hint={
            data.kpis.revenueToday === null ? "Shown to the owner" : undefined
          }
          index={1}
        />
        <KpiCard
          icon={CookingPot}
          label="In the kitchen"
          value={String(data.kpis.openOrders)}
          index={2}
        />
        <KpiCard
          icon={QrCode}
          label="Tables"
          value={String(data.kpis.tables)}
          index={3}
        />
        <KpiCard
          icon={UsersThree}
          label="Guests for offers"
          value={String(data.kpis.offerOptInsToday)}
          index={4}
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
        <section className="surface rounded-md p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconWell icon={CookingPot} size="sm" />
              <h2 className="font-heading text-2xl">Kitchen now</h2>
            </div>
            <Link
              href="/orders"
              className="text-[11px] uppercase tracking-[0.16em] text-primary"
            >
              Open kitchen
            </Link>
          </div>
          {data.liveOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              The kitchen is clear. New orders will show here.
            </p>
          ) : (
            <ul className="grid gap-3">
              <AnimatePresence initial={false}>
              {data.liveOrders.map((order) => (
                <motion.li
                  key={order.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-heading text-2xl leading-none">
                      Table {order.tableNumber}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {order.items
                        .map((line) => `${line.quantity} × ${line.name}`)
                        .join(", ")}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatTime(order.createdAt)}
                      {order.customerName ? ` · ${order.customerName}` : ""}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </motion.li>
              ))}
              </AnimatePresence>
            </ul>
          )}
        </section>
        <section className="surface rounded-md p-5">
          <div className="mb-4 flex items-center gap-3">
            <IconWell icon={ForkKnife} size="sm" />
            <h2 className="font-heading text-2xl">Selling today</h2>
          </div>
          {data.topItemsToday.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing sold yet.</p>
          ) : (
            <ol className="grid gap-3">
              {data.topItemsToday.map((item, index) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span>
                    <span className="mr-2 text-xs text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.name}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {item.quantity}
                  </span>
                </li>
              ))}
            </ol>
          )}
          <p className="mt-5 text-xs text-muted-foreground">
            {[data.restaurant.location, data.restaurant.hours]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </section>
      </div>
    </div>
  );
}

function PlatformView({
  data,
  onOpen,
}: {
  data: PlatformDash;
  onOpen: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={House}
          label="Restaurants"
          value={String(data.kpis.restaurants)}
          index={0}
        />
        <KpiCard
          icon={Receipt}
          label="Orders today"
          value={String(data.kpis.ordersToday)}
          index={1}
        />
        <KpiCard
          icon={CurrencyInr}
          label="Sales today"
          value={inr(data.kpis.revenueToday)}
          index={2}
        />
        <KpiCard
          icon={CookingPot}
          label="In the kitchen"
          value={String(data.kpis.openOrders)}
          index={3}
        />
      </div>
      <section className="surface rounded-md p-5">
        <h2 className="font-heading text-2xl">Your restaurants</h2>
        <ul className="mt-4 grid gap-2">
          {data.restaurants.map((row) => (
            <li key={row.id} className="border-t border-border pt-3">
              <button
                type="button"
                className="cursor-pointer text-left"
                onClick={() => onOpen(row.id)}
              >
                <p className="font-medium hover:text-primary">{row.name}</p>
                <p className="text-xs text-muted-foreground">
                  {row.location ?? "—"} · {row.menuItems} dishes ·{" "}
                  {inr(row.revenueToday)} today
                </p>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
