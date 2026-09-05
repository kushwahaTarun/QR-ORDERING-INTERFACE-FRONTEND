"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect } from "react";
import { easeOut } from "@/lib/motion";

export function TickValue({
  value,
  format = String,
  className,
}: {
  value: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const motionValue = useMotionValue(value);
  const label = useTransform(motionValue, (latest) =>
    format(Math.round(latest)),
  );

  useEffect(() => {
    if (reduce) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, {
      duration: 0.4,
      ease: easeOut,
    });
    return () => controls.stop();
  }, [value, reduce, motionValue]);

  return <motion.span className={className}>{label}</motion.span>;
}
