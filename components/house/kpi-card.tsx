"use client";

import type { Icon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { IconWell } from "@/components/house/icon-well";

export function KpiCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: Icon;
  index?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={false}
      whileHover={reduce ? undefined : { y: -2 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="surface flex items-start gap-4 rounded-md px-4 py-4 transition-colors duration-300 hover:border-primary/40"
    >
      <IconWell icon={icon} />
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 font-heading text-3xl leading-none tracking-tight">
          {value}
        </p>
        {hint ? (
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    </motion.div>
  );
}
