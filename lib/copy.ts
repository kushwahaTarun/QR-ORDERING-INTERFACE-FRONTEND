import type { OrderStatus, StaffRole } from "@/lib/types";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  received: "New",
  preparing: "Cooking",
  ready: "Ready",
  served: "Served",
  cancelled: "Cancelled",
};

export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  received: "preparing",
  preparing: "ready",
  ready: "served",
};

export const NEXT_ACTION: Partial<Record<OrderStatus, string>> = {
  received: "Start cooking",
  preparing: "Ready to serve",
  ready: "Served to table",
};

export function roleLabel(role?: StaffRole | string | null) {
  if (role === "OWNER") return "Owner";
  if (role === "MANAGER") return "Kitchen";
  if (role === "SUPER_ADMIN") return "All restaurants";
  return "Team";
}

export function greetingNow() {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      hour12: false,
    }).format(new Date()),
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function friendlyError(message: string | null) {
  if (!message) return null;
  const lower = message.toLowerCase();
  if (lower.includes("x-restaurant") || lower.includes("choose a restaurant")) {
    return "Pick a restaurant at the top of the page.";
  }
  if (lower.includes("do not have access") || lower.includes("owner account")) {
    return "This page is for the owner.";
  }
  if (lower.includes("sign in")) {
    return "Please sign in to continue.";
  }
  if (lower.includes("session expired")) {
    return "Please sign in again.";
  }
  return message;
}

export function dietLabel(diet: string) {
  if (diet === "non-veg") return "Non-veg";
  if (diet === "egg") return "Egg";
  return "Veg";
}
