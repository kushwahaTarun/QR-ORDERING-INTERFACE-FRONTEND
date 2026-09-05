import { Button } from "@/components/ui/button";

export function OrderSlipToast({
  tableNumber,
  dishes,
  house,
}: {
  tableNumber: string;
  dishes: string;
  house?: string;
}) {
  return (
    <div className="paper-slip w-[22rem] max-w-[calc(100vw-2rem)] p-4">
      <p className="text-[10px] uppercase tracking-[0.22em] text-[#8e3a3a]">
        {house || "New order"}
      </p>
      <p className="folio-num mt-1 text-4xl leading-none">Table {tableNumber}</p>
      <p className="mt-2 text-sm leading-snug text-[#5c4c3c]">
        {dishes || "A guest just ordered."}
      </p>
      <Button href="/orders" variant="inkGhost" size="sm" className="mt-3 px-0">
        Open kitchen
      </Button>
    </div>
  );
}
