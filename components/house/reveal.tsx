"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { easeOut } from "@/lib/motion";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}
