"use client";

import { QRCodeSVG } from "qrcode.react";
import { LoadState } from "@/components/house/load-state";
import { Button } from "@/components/ui/button";
import type { TableQr } from "@/lib/types";
import { useHouse } from "@/lib/use-house";

type TablesPayload = {
  restaurant: { name: string };
  tables: TableQr[];
};

export default function PrintTablesPage() {
  const { data, error, loading } = useHouse<TablesPayload>("/admin/tables");

  return (
    <div className="space-y-6 print:space-y-0">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-primary">
            Table cards
          </p>
          <h1 className="font-heading text-3xl">Print for the tables</h1>
        </div>
        <Button onClick={() => window.print()}>Print</Button>
      </div>
      <LoadState loading={loading} error={error}>
        <ul className="grid gap-6 sm:grid-cols-2 print:grid-cols-2">
          {(data?.tables ?? []).map((table) => (
            <li
              key={table.tableNumber}
              className="paper-slip break-inside-avoid p-8"
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#8e3a3a]">
                {data?.restaurant.name}
              </p>
              <p className="mt-2 font-heading text-4xl">Table {table.tableNumber}</p>
              <p className="mt-2 text-sm text-[#5c4c3c]">
                Scan with your phone to see the menu and order from this table.
              </p>
              <div className="mt-6 flex justify-center">
                <QRCodeSVG value={table.url} size={200} />
              </div>
            </li>
          ))}
        </ul>
      </LoadState>
    </div>
  );
}
