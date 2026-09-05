"use client";

import { useEffect, useState } from "react";

function nowLabel() {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

export function Clock() {
  const [label, setLabel] = useState(nowLabel);

  useEffect(() => {
    const id = window.setInterval(() => setLabel(nowLabel()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p className="text-[11px] uppercase tracking-[0.2em] text-primary">{label}</p>
  );
}
