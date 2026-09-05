"use client";

/* eslint-disable react-hooks/set-state-in-effect -- mark first paint so the landing page does not fade in */
import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { easeOut } from "@/lib/motion";

export function PageEnter({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [landed] = useState(pathname);

  useEffect(() => {
    setReady(true);
  }, []);

  if (reduce) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={
        ready && pathname !== landed ? { opacity: 0, y: 8 } : false
      }
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: easeOut }}
      className="print:translate-y-0 print:opacity-100"
    >
      {children}
    </motion.div>
  );
}
