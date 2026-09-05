import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "min-h-10 cursor-pointer px-3.5 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-300",
        active
          ? "bg-primary text-primary-foreground"
          : "border border-border text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
