"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { appleSpring, hoverLift } from "@/lib/motion";

export function PaperSlip({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      layout
      initial={reduce ? false : { opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
      whileHover={reduce ? undefined : hoverLift}
      transition={appleSpring}
      className={cn("paper-slip p-5", className)}
    >
      {children}
    </motion.article>
  );
}
