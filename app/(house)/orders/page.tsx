"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup } from "motion/react";
import { toast } from "sonner";
import { CookingPot, Fire, CheckCircle, Bell } from "@phosphor-icons/react";
import { EmptyState } from "@/components/house/empty-state";
import { IconWell } from "@/components/house/icon-well";
import { LoadState } from "@/components/house/load-state";
import { FilterChip } from "@/components/house/filter-chip";
import { PageHeader } from "@/components/house/page-header";
import { PaperSlip } from "@/components/house/paper-slip";
import { Button } from "@/components/ui/button";
import {
  NEXT_ACTION,
  NEXT_STATUS,
  STATUS_LABEL,
} from "@/lib/copy";
import { houseSend } from "@/lib/api";
import { formatTime, inrExact } from "@/lib/format";
import { orderMatchesFilter, upsertOrder } from "@/lib/live";
import type { HouseOrder, OrderStatus } from "@/lib/types";
import { useHouse } from "@/lib/use-house";
import { useLiveOrders } from "@/components/house/live-provider";

const FILTERS: { id: "open" | "all" | OrderStatus; label: string }[] = [
  { id: "open", label: "Now" },
  { id: "received", label: "New" },
  { id: "preparing", label: "Cooking" },
  { id: "ready", label: "Ready" },
  { id: "served", label: "Served" },
  { id: "all", label: "All" },
];

export default function KitchenPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("open");
  const { data, error, loading, setData } = useHouse<{ orders: HouseOrder[] }>(
    `/admin/orders?status=${filter}`,
  );

  useLiveOrders((event) => {
    setData((current) => {
      const list = current?.orders ?? [];
      if (!orderMatchesFilter(event.order, filter)) {
        return { orders: list.filter((row) => row.id !== event.order.id) };
      }
      return { orders: upsertOrder(list, event.order) };
    });
  });

  const orders = data?.orders;
  const grouped = useMemo(() => {
    const buckets: Record<string, HouseOrder[]> = {
      received: [],
      preparing: [],
      ready: [],
      served: [],
      cancelled: [],
    };
    for (const order of orders ?? []) {
      buckets[order.status]?.push(order);
    }
    return buckets;
  }, [orders]);

  async function setStatus(order: HouseOrder, status: OrderStatus) {
    try {
      const updated = await houseSend<HouseOrder>(
        `/admin/orders/${order.id}`,
        "PATCH",
        { status },
      );
      toast.success(
        `Table ${order.tableNumber} — ${STATUS_LABEL[status].toLowerCase()}`,
      );
      setData((current) => {
        const list = current?.orders ?? [];
        if (!orderMatchesFilter(updated, filter)) {
          return { orders: list.filter((row) => row.id !== updated.id) };
        }
        return { orders: upsertOrder(list, updated) };
      });
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not update.");
    }
  }

  const columns: OrderStatus[] =
    filter === "open" || filter === "all"
      ? ["received", "preparing", "ready"]
      : [filter as OrderStatus];

  const columnMeta = {
    received: { label: "New", icon: Bell },
    preparing: { label: "Cooking", icon: Fire },
    ready: { label: "Ready", icon: CheckCircle },
  } as const;

  return (
    <div className="space-y-8">
      <PageHeader
        icon={CookingPot}
        title="Kitchen"
        description="New, cooking, then ready to send to the table."
      />
      <LayoutGroup>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Kitchen view">
          {FILTERS.map((entry) => (
            <FilterChip
              key={entry.id}
              layoutId="kitchen-status"
              active={filter === entry.id}
              onClick={() => setFilter(entry.id)}
            >
              {entry.label}
            </FilterChip>
          ))}
        </div>
      </LayoutGroup>
      <LoadState loading={loading && !data} error={error}>
        {(orders ?? []).length === 0 ? (
          <EmptyState
            title="Nothing on the pass"
            body="When a guest orders from a table card, a slip will appear here."
          />
        ) : filter === "served" || filter === "all" ? (
          <ServedList orders={filter === "served" ? grouped.served : (orders ?? [])} />
        ) : (
          <div className="grid gap-10 lg:grid-cols-3">
            {columns.map((status) => (
              <section key={status}>
                <div className="mb-4 flex items-center gap-3">
                  <IconWell
                    icon={
                      status in columnMeta
                        ? columnMeta[status as keyof typeof columnMeta].icon
                        : CookingPot
                    }
                    size="sm"
                  />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary">
                      {STATUS_LABEL[status]}
                    </p>
                    <h2 className="font-heading text-2xl leading-none">
                      {grouped[status]?.length ?? 0}
                    </h2>
                  </div>
                </div>
                <ul className="mt-6 grid gap-4">
                  <AnimatePresence initial={false}>
                  {(grouped[status] ?? []).map((order, index) => (
                    <li key={order.id}>
                      <KitchenSlip
                        order={order}
                        index={index}
                        onStatus={setStatus}
                      />
                    </li>
                  ))}
                  </AnimatePresence>
                </ul>
              </section>
            ))}
          </div>
        )}
      </LoadState>
    </div>
  );
}

function KitchenSlip({
  order,
  index,
  onStatus,
}: {
  order: HouseOrder;
  index: number;
  onStatus: (order: HouseOrder, status: OrderStatus) => void;
}) {
  const next = NEXT_STATUS[order.status];
  return (
    <PaperSlip index={index}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#8e3a3a]">
            Table
          </p>
          <p className="folio-num text-6xl leading-none">{order.tableNumber}</p>
        </div>
        <p className="text-[10px] uppercase tracking-[0.16em] text-[#7a6a5a]">
          {STATUS_LABEL[order.status]}
        </p>
      </div>
      <ul className="mt-5 space-y-1.5 text-[15px] leading-snug">
        {order.items.map((line, lineIndex) => (
          <li key={line.lineId ?? `${line.itemId}-${lineIndex}`}>
            {line.quantity} × {line.name}
            {line.specialInstructions ? ` — ${line.specialInstructions}` : ""}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[11px] uppercase tracking-[0.12em] text-[#7a6a5a]">
        {formatTime(order.createdAt)} · {inrExact(order.total)}
        {order.customerName ? ` · ${order.customerName}` : ""}
      </p>
      <div className="mt-5 flex flex-wrap gap-3 border-t border-[#1c140e]/15 pt-4">
        {next ? (
          <Button
            variant="inkGhost"
            size="sm"
            className="px-0"
            onClick={() => onStatus(order, next)}
          >
            {NEXT_ACTION[order.status]}
          </Button>
        ) : null}
        {order.status !== "served" && order.status !== "cancelled" ? (
          <Button
            variant="accentGhost"
            size="sm"
            className="px-0"
            onClick={() => onStatus(order, "cancelled")}
          >
            Cancel
          </Button>
        ) : null}
      </div>
    </PaperSlip>
  );
}

function ServedList({ orders }: { orders: HouseOrder[] }) {
  return (
    <ul className="grid gap-4">
      {orders.map((order) => (
        <li
          key={order.id}
          className="flex flex-wrap items-baseline justify-between gap-3 border-b border-primary/15 py-4"
        >
          <p className="font-heading text-3xl">{order.tableNumber}</p>
          <p className="flex-1 text-muted-foreground">
            {order.items.map((line) => `${line.quantity} × ${line.name}`).join(", ")}
          </p>
          <p className="text-sm">{inrExact(order.total)}</p>
        </li>
      ))}
    </ul>
  );
}
