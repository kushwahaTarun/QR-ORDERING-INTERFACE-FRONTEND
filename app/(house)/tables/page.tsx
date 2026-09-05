"use client";

import { FormEvent, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { Printer, QrCode } from "@phosphor-icons/react";
import { EmptyState } from "@/components/house/empty-state";
import { LoadState } from "@/components/house/load-state";
import { PageHeader } from "@/components/house/page-header";
import { PaperSlip } from "@/components/house/paper-slip";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { houseSend } from "@/lib/api";
import type { TableQr } from "@/lib/types";
import { useHouse } from "@/lib/use-house";

type TablesPayload = {
  restaurant: { name: string; slug: string };
  tables: TableQr[];
};

export default function TablesPage() {
  const { data, error, loading, reload } = useHouse<TablesPayload>(
    "/admin/tables",
  );
  const [tableNumber, setTableNumber] = useState("");

  async function addTable(event: FormEvent) {
    event.preventDefault();
    try {
      await houseSend("/admin/tables", "POST", { tableNumber });
      setTableNumber("");
      toast.success(`Table ${tableNumber} is ready to print`);
      await reload();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not add.");
    }
  }

  async function removeTable(table: string) {
    if (
      !window.confirm(
        `Remove table ${table}? The printed card on that table will stop working.`,
      )
    ) {
      return;
    }
    try {
      await houseSend(`/admin/tables/${table}`, "DELETE");
      toast.success(`Table ${table} removed`);
      await reload();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not remove.");
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        icon={QrCode}
        title="Table cards"
        description="Print a card for each table. Guests scan it and order from that table only."
        actions={
          <Button href="/tables/print" variant="link">
            <Printer size={18} weight="duotone" />
            Print all cards
          </Button>
        }
      />
      <LoadState loading={loading} error={error}>
        {!data ? null : (
          <div className="space-y-8">
            <form
              onSubmit={addTable}
              className="flex max-w-md flex-col gap-4 sm:flex-row sm:items-end"
            >
              <Field label="New table number" htmlFor="table-number">
                <Input
                  id="table-number"
                  inputMode="numeric"
                  placeholder="14"
                  value={tableNumber}
                  onChange={(event) => setTableNumber(event.target.value)}
                  required
                />
              </Field>
              <Button type="submit">Add table</Button>
            </form>
            {data.tables.length === 0 ? (
              <EmptyState
                title="No tables yet"
                body="Add table 4, 6, 8… then print the cards."
              />
            ) : (
              <ul className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {data.tables.map((table, index) => (
                  <li key={table.tableNumber}>
                    <PaperSlip index={index} className="text-center">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-[#8e3a3a]">
                        {data.restaurant.name}
                      </p>
                      <h2 className="mt-2 font-heading text-4xl">
                        Table {table.tableNumber}
                      </h2>
                      <div className="mx-auto mt-6 w-fit bg-white p-3">
                        <QRCodeSVG value={table.url} size={168} />
                      </div>
                      <p className="mt-5 text-sm text-[#5c4c3c]">
                        Scan to order from this table
                      </p>
                      <Button
                        variant="accentGhost"
                        size="sm"
                        className="mt-4 px-0"
                        onClick={() => void removeTable(table.tableNumber)}
                      >
                        Remove
                      </Button>
                    </PaperSlip>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </LoadState>
    </div>
  );
}
