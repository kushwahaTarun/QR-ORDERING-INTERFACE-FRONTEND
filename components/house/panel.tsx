import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("surface rounded-xl p-5 sm:p-6", className)}>
      {children}
    </section>
  );
}

export function PanelTitle({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-3">
      <h2 className="font-heading text-2xl tracking-tight">{title}</h2>
      {action}
    </div>
  );
}
