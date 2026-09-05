"use client";

import {
  ChartLineUp,
  CurrencyInr,
  Notebook,
  Receipt,
} from "@phosphor-icons/react";
import { IconWell } from "@/components/house/icon-well";
import { KpiCard } from "@/components/house/kpi-card";
import { LoadState } from "@/components/house/load-state";
import { PageHeader } from "@/components/house/page-header";
import { WeekNoteList } from "@/components/house/week-note";
import { Button } from "@/components/ui/button";
import { formatVisit, inr } from "@/lib/format";
import type { Insight } from "@/lib/types";
import { useHouse } from "@/lib/use-house";

type ReportPayload = {
  generatedAt: string;
  restaurant: { name: string };
  note: string;
  insights: Insight[];
  totals: { orders: number; revenue: number; averageTicket: number };
};

export default function ReportsPage() {
  const { data, error, loading } = useHouse<ReportPayload>(
    "/admin/reports/daily",
  );

  const name = data?.restaurant.name ?? "The restaurant";
  const totals = data?.totals;
  const lead =
    !totals || totals.orders === 0
      ? `${name} has no orders in the last 7 days. Ask a guest — or the team — to scan a table card once, then these notes will fill in.`
      : `${name} took ${totals.orders} orders in the last 7 days. ${inr(totals.revenue)} sales, ${inr(totals.averageTicket)} a bill.`;

  return (
    <div className="space-y-8">
      <PageHeader
        icon={Notebook}
        title="This week"
        description="A short read of the last 7 days — what to keep, what to watch, what to do tonight."
        actions={
          <Button href="/analytics" variant="link">
            <ChartLineUp size={18} weight="duotone" />
            See the numbers
          </Button>
        }
      />
      <LoadState loading={loading} error={error}>
        {data && totals ? (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <KpiCard
                icon={Receipt}
                label="Orders"
                value={String(totals.orders)}
                amount={totals.orders}
              />
              <KpiCard
                icon={CurrencyInr}
                label="Sales"
                value={inr(totals.revenue)}
                amount={totals.revenue}
                format={inr}
              />
              <KpiCard
                icon={ChartLineUp}
                label="Average bill"
                value={inr(totals.averageTicket)}
                amount={totals.averageTicket}
                format={inr}
              />
            </div>

            <section className="surface rounded-md p-5">
              <div className="group flex items-start gap-3">
                <IconWell icon={Notebook} size="sm" />
                <div className="min-w-0">
                  <h2 className="font-heading text-2xl leading-tight">
                    The last 7 days
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {lead}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Updated {formatVisit(data.generatedAt)}
                  </p>
                </div>
              </div>
            </section>

            <WeekNoteList notes={data.insights} />

            <p className="text-xs text-muted-foreground">{data.note}</p>
          </div>
        ) : null}
      </LoadState>
    </div>
  );
}
