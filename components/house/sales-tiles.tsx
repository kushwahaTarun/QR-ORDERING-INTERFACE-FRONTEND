import { inr } from "@/lib/format";
import { cn } from "@/lib/utils";

function orderWord(count: number) {
  return count === 1 ? "order" : "orders";
}

export function SoldDishCard({
  name,
  quantity,
  revenue,
  lead,
  maxQuantity,
}: {
  name: string;
  quantity: number;
  revenue: number;
  lead: boolean;
  maxQuantity: number;
}) {
  const width = `${Math.max(8, Math.round((quantity / Math.max(1, maxQuantity)) * 100))}%`;

  return (
    <article
      aria-label={`${name}, ${quantity} sold, ${inr(revenue)}${lead ? ", sold most" : ""}`}
      className={cn(
        "lift surface flex gap-4 rounded-md p-4 hover:border-primary/40",
        lead && "border-primary/45",
      )}
    >
      <div className="w-[4.5rem] shrink-0 text-center">
        <p className="folio-num text-3xl leading-none text-primary">{quantity}</p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          sold
        </p>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-xl leading-tight">{name}</h3>
          {lead ? (
            <span className="shrink-0 border border-primary/35 bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-primary">
              Sold most
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{inr(revenue)}</p>
        <div className="mt-3 h-1.5 bg-secondary">
          <div
            className={cn("h-1.5 transition-[width] duration-300", lead ? "bg-primary" : "bg-primary/45")}
            style={{ width }}
            aria-hidden="true"
          />
        </div>
      </div>
    </article>
  );
}

export function TableTile({
  tableNumber,
  orders,
  revenue,
  lead,
  maxOrders,
}: {
  tableNumber: string;
  orders: number;
  revenue: number;
  lead: boolean;
  maxOrders: number;
}) {
  const heat = Math.max(0.12, orders / Math.max(1, maxOrders));

  return (
    <article
      aria-label={`Table ${tableNumber}, ${orders} ${orderWord(orders)}, ${inr(revenue)}${lead ? ", busiest" : ""}`}
      className={cn(
        "lift group relative overflow-hidden rounded-md border border-border text-center hover:border-primary/50",
        lead && "border-primary/50",
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 bg-primary/25 transition-[height,background-color] duration-300 group-hover:bg-primary/40"
        style={{ height: `${Math.round(heat * 100)}%` }}
        aria-hidden="true"
      />
      <div className="relative px-3 py-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Table
        </p>
        <p className="folio-num mt-1 text-5xl leading-none text-primary">
          {tableNumber}
        </p>
        <p className="mt-3 text-sm">
          {orders} {orderWord(orders)}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{inr(revenue)}</p>
        {lead ? (
          <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-primary">
            Busiest
          </p>
        ) : null}
      </div>
    </article>
  );
}
