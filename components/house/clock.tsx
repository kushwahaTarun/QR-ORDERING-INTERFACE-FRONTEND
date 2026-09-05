"use client";

import { useEffect, useState } from "react";

function nowLabel() {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(new Date())
    .toLowerCase();
}

export function Clock() {
  const [label, setLabel] = useState("");

  useEffect(() => {
    const tick = () => setLabel(nowLabel());
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p className="min-w-[9rem] text-[11px] uppercase tracking-[0.2em] text-primary">
      {label || "\u00a0"}
    </p>
  );
}
