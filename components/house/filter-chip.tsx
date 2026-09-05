"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { appleSpring } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function FilterChip({
  active,
  onClick,
  children,
  layoutId,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  layoutId?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "press relative min-h-11 overflow-hidden rounded-sm border px-3.5 text-[11px] font-medium uppercase tracking-[0.16em]",
        active && !layoutId && "border-transparent bg-primary text-primary-foreground",
        active && layoutId && "border-transparent text-primary-foreground",
        !active && "border-border text-muted-foreground hover:text-foreground",
      )}
    >
      {active && layoutId ? (
        <motion.span
          layoutId={layoutId}
          className="absolute inset-0 bg-primary"
          transition={appleSpring}
        />
      ) : null}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
