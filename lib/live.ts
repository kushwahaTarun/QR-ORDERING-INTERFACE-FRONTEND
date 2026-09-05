import type { HouseOrder } from "@/lib/types";

export type LiveOrderEvent = {
  type: "order.created" | "order.updated";
  restaurantId: string;
  restaurantName: string;
  order: HouseOrder;
};

export function dishesLine(order: HouseOrder) {
  return order.items
    .map((line) => `${line.quantity} × ${line.name}`)
    .join(", ");
}

const OPEN = new Set(["received", "preparing", "ready"]);

export function isOpenStatus(status: string) {
  return OPEN.has(status);
}

export function upsertOrder(list: HouseOrder[], order: HouseOrder) {
  const without = list.filter((entry) => entry.id !== order.id);
  return [order, ...without];
}

export function orderMatchesFilter(
  order: HouseOrder,
  filter: string,
) {
  if (filter === "all") return true;
  if (filter === "open") return isOpenStatus(order.status);
  return order.status === filter;
}

export function playOrderChime() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.07, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.4);
  } catch {
    /* sound is optional */
  }
}

export function notifyBrowser(title: string, body: string) {
  if (typeof Notification === "undefined") return;
  if (Notification.permission === "granted") {
    new Notification(title, { body, tag: title });
  }
}

export function askNotificationPermission() {
  if (typeof Notification === "undefined") return;
  if (Notification.permission === "default") {
    void Notification.requestPermission();
  }
}
