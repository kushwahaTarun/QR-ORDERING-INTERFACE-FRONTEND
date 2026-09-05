"use client";

import { useState, type ReactNode } from "react";
import { LayoutGroup } from "motion/react";
import {
  ChartLineUp,
  Clock,
  CurrencyInr,
  ForkKnife,
  QrCode,
  Receipt,
  XCircle,
  type Icon,
} from "@phosphor-icons/react";
import { ColumnChart } from "@/components/house/bar-chart";
import { SoldDishCard, TableTile } from "@/components/house/sales-tiles";
import { EmptyState } from "@/components/house/empty-state";
import { FilterChip } from "@/components/house/filter-chip";
import { IconWell } from "@/components/house/icon-well";
import { KpiCard } from "@/components/house/kpi-card";
import { LoadState } from "@/components/house/load-state";
import { PageHeader } from "@/components/house/page-header";
import {
  formatDate,
  formatHourClock,
  formatWeekday,
  inr,
  isKolkataToday,
} from "@/lib/format";
import { useHouse } from "@/lib/use-house";

type AnalyticsPayload = {
  days: number;
  totals: {
    orders: number;
    cancelled: number;
    revenue: number;
    averageTicket: number;
  };
  daily: { date: string; orders: number; revenue: number }[];
  byHour: { hour: number; orders: number }[];
  topItems: { name: string; quantity: number; revenue: number }[];
  tables: { tableNumber: string; orders: number; revenue: number }[];
};

const WINDOWS = [7, 30] as const;

const DAY_PARTS = [
  {
    id: "morning",
    label: "Morning",
    spoken: "morning",
    start: 6,
    end: 11,
    clock: "6–11 am",
    clockSpoken: "6 am to 11 am",
  },
  {
    id: "lunch",
    label: "Lunch",
    spoken: "lunch",
    start: 11,
    end: 16,
    clock: "11 am–4 pm",
    clockSpoken: "11 am to 4 pm",
  },
  {
    id: "evening",
    label: "Evening",
    spoken: "evening",
    start: 16,
    end: 20,
    clock: "4–8 pm",
    clockSpoken: "4 pm to 8 pm",
  },
  {
    id: "night",
    label: "Night",
    spoken: "night",
    start: 20,
    end: 24,
    clock: "8 pm–12 am",
    clockSpoken: "8 pm to 12 am",
  },
  {
    id: "late",
    label: "Late",
    spoken: "late night",
    start: 0,
    end: 6,
    clock: "12–6 am",
    clockSpoken: "12 am to 6 am",
  },
] as const;

function rangeWords(days: number) {
  return days === 7 ? "the last 7 days" : "the last 30 days";
}

function orderWord(count: number) {
  return count === 1 ? "order" : "orders";
}

function listAnd(parts: string[]) {
  if (parts.length <= 1) return parts[0] ?? "";
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

function dayName(date: string) {
  return isKolkataToday(date) ? "today" : formatDate(date);
}

function busiestDays(dates: string[]) {
  const names = dates.map(dayName);
  if (names.length === 1 && names[0] === "today") return "Busiest today";
  return `Busiest on ${listAnd(names)}`;
}

function ChartCard({
  icon,
  title,
  hint,
  children,
}: {
  icon: Icon;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="group surface overflow-visible rounded-md p-5">
      <div className="mb-5 flex items-start gap-3">
        <IconWell icon={icon} size="sm" />
        <div className="min-w-0">
          <h2 className="font-heading text-2xl leading-tight">{title}</h2>
          {hint ? (
            <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}

export default function SalesPage() {
  const [days, setDays] = useState<(typeof WINDOWS)[number]>(7);
  const { data, error, loading } = useHouse<AnalyticsPayload>(
    `/admin/analytics?days=${days}`,
  );

  const daily = data?.daily ?? [];
  const hours = data?.byHour ?? [];
  const dishes = data?.topItems ?? [];
  const tables = data?.tables ?? [];
  const windowDays = data?.days ?? days;

  const span = rangeWords(windowDays);

  const dailyMax = Math.max(0, ...daily.map((row) => row.orders));
  const dailyPeaks = daily.filter((row) => row.orders === dailyMax);
  const dailyHint =
    dailyMax <= 0
      ? `Each bar is one day from ${span}. Quiet so far.`
      : `Each bar is one day from ${span}. ${busiestDays(dailyPeaks.map((row) => row.date))} — ${dailyMax} ${orderWord(dailyMax)}${dailyPeaks.length === 1 && dailyPeaks[0] ? `, ${inr(dailyPeaks[0].revenue)}` : ""}.${windowDays === 30 ? " Point at a bar to see that day." : ""}`;

  const parts = DAY_PARTS.map((part) => ({
    ...part,
    orders: hours
      .filter((row) => row.hour >= part.start && row.hour < part.end)
      .reduce((sum, row) => sum + row.orders, 0),
  }));
  const partMax = Math.max(0, ...parts.map((part) => part.orders));
  const peakParts = parts.filter((part) => part.orders === partMax && partMax > 0);
  const peakHour = hours.reduce(
    (best, row) => (row.orders > best.orders ? row : best),
    hours[0] ?? { hour: 0, orders: 0 },
  );
  const whenHint =
    partMax <= 0
      ? `This is ${span} added together — not one day.`
      : `This is ${span} added together — not one day. Busiest at ${listAnd(peakParts.map((part) => part.spoken))}${peakHour.orders > 0 && peakParts.length === 1 ? ` — most around ${formatHourClock(peakHour.hour)}` : ""}.`;

  const dishMax = Math.max(1, ...dishes.map((row) => row.quantity));
  const tableMax = Math.max(1, ...tables.map((row) => row.orders));
  const dishHint = dishes[0]
    ? `How many times each dish was ordered in ${span}. ${dishes[0].name} sold most — ${dishes[0].quantity}.`
    : "Nothing sold yet.";
  const tableHint = tables[0]
    ? `Each tile is a table. The fuller it is, the more orders it took in ${span}. Table ${tables[0].tableNumber} sat the most.`
    : "No tables yet.";

  const dailyColumns = daily.map((row, index) => {
    const today = isKolkataToday(row.date);
    const weekday = today ? "Today" : formatWeekday(row.date);
    const when = `${weekday}, ${formatDate(row.date)}`;
    const label =
      windowDays === 7 ? weekday : formatDate(row.date);
    return {
      key: row.date,
      value: row.orders,
      label,
      detail: `${when}, ${row.orders} ${orderWord(row.orders)}, ${inr(row.revenue)}`,
      tipTitle: when,
      tipBody: `${row.orders} ${orderWord(row.orders)} · ${inr(row.revenue)}`,
      muteLabel:
        windowDays === 30 &&
        !today &&
        index !== 0 &&
        index !== daily.length - 1 &&
        index % 7 !== 0,
    };
  });

  const whenColumns = parts.map((part) => ({
    key: part.id,
    value: part.orders,
    label: part.label,
    sublabel: part.clock,
    detail: `${part.label}, ${part.clock}, ${part.orders} ${orderWord(part.orders)} in ${span}`,
    tipTitle: part.label,
    tipBody: `${part.clockSpoken} · ${part.orders} ${orderWord(part.orders)} in ${span}`,
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        icon={ChartLineUp}
        title="Sales"
        description="What sold, which days were busy, and what time guests ordered."
      />
      <LayoutGroup>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Days to show">
          {WINDOWS.map((range) => (
            <FilterChip
              key={range}
              layoutId="sales-days"
              active={days === range}
              onClick={() => setDays(range)}
            >
              Last {range} days
            </FilterChip>
          ))}
        </div>
      </LayoutGroup>
      <LoadState loading={loading && !data} error={error}>
        {data ? (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                icon={Receipt}
                label="Orders"
                value={String(data.totals.orders)}
              />
              <KpiCard
                icon={CurrencyInr}
                label="Sales"
                value={inr(data.totals.revenue)}
              />
              <KpiCard
                icon={ChartLineUp}
                label="Average bill"
                value={inr(data.totals.averageTicket)}
              />
              <KpiCard
                icon={XCircle}
                label="Cancelled"
                value={String(data.totals.cancelled)}
              />
            </div>

            {data.totals.orders === 0 ? (
              <EmptyState
                title="No sales yet"
                body="When guests order, the days, times, and dishes will show here."
              />
            ) : (
              <>
                <ChartCard icon={Receipt} title="Each day" hint={dailyHint}>
                  <ColumnChart
                    items={dailyColumns}
                    caption={`Orders for each day in ${span}`}
                  />
                </ChartCard>
                <ChartCard icon={Clock} title="When they order" hint={whenHint}>
                  <ColumnChart
                    items={whenColumns}
                    caption={`Time of day for all orders in ${span}`}
                  />
                </ChartCard>
                <ChartCard icon={ForkKnife} title="What sold" hint={dishHint}>
                  {dishes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nothing sold yet.</p>
                  ) : (
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {dishes.map((row, index) => (
                        <li key={row.name}>
                          <SoldDishCard
                            name={row.name}
                            quantity={row.quantity}
                            revenue={row.revenue}
                            lead={index === 0}
                            maxQuantity={dishMax}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </ChartCard>
                <ChartCard icon={QrCode} title="Which tables" hint={tableHint}>
                  {tables.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No tables yet.</p>
                  ) : (
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                      {tables.map((row, index) => (
                        <li key={row.tableNumber}>
                          <TableTile
                            tableNumber={row.tableNumber}
                            orders={row.orders}
                            revenue={row.revenue}
                            lead={index === 0}
                            maxOrders={tableMax}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </ChartCard>
              </>
            )}
          </div>
        ) : null}
      </LoadState>
    </div>
  );
}
