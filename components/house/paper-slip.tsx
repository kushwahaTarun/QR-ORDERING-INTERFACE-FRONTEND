"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { easeOut } from "@/lib/motion";

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
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0 }}
      whileHover={reduce ? undefined : { y: -2 }}
      transition={{ duration: 0.32, ease: easeOut }}
      className={cn("paper-slip p-5", className)}
    >
      {children}
    </motion.article>
  );
}
