import { Badge } from "@/components/ui/badge";
import { STATUS_LABEL } from "@/lib/copy";
import type { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const styles: Record<OrderStatus, string> = {
  received: "border-[#c9a36a]/45 bg-[#c9a36a]/12 text-[#e6c48a]",
  preparing: "border-amber-400/40 bg-amber-400/10 text-amber-100",
  ready: "border-emerald-400/40 bg-emerald-400/10 text-emerald-100",
  served: "border-border bg-secondary text-muted-foreground",
  cancelled: "border-destructive/40 bg-destructive/10 text-destructive",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge className={cn("tracking-wide", styles[status])}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}
