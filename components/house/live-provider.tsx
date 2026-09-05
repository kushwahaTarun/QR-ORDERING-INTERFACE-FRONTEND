"use client";

/* eslint-disable react-hooks/set-state-in-effect -- EventSource connection is an external subscription */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { OrderSlipToast } from "@/components/house/order-slip-toast";
import { useAuth } from "@/components/house/auth-provider";
import {
  askNotificationPermission,
  dishesLine,
  notifyBrowser,
  playOrderChime,
  type LiveOrderEvent,
} from "@/lib/live";

type Listener = (event: LiveOrderEvent) => void;

type LiveContextValue = {
  connected: boolean;
  subscribe: (listener: Listener) => () => void;
};

const LiveContext = createContext<LiveContextValue | null>(null);

export function LiveProvider({ children }: { children: ReactNode }) {
  const { staff, selectedRestaurantId } = useAuth();
  const [connected, setConnected] = useState(false);
  const listeners = useRef(new Set<Listener>());

  const subscribe = useCallback((listener: Listener) => {
    listeners.current.add(listener);
    return () => {
      listeners.current.delete(listener);
    };
  }, []);

  useEffect(() => {
    if (!staff) {
      setConnected(false);
      return;
    }

    askNotificationPermission();
    const source = new EventSource("/api/live");

    source.onopen = () => setConnected(true);
    source.onerror = () => setConnected(false);
    source.onmessage = (message) => {
      try {
        const payload = JSON.parse(message.data) as
          | LiveOrderEvent
          | { type: "ping" };
        if (!payload || payload.type === "ping") return;
        if (payload.type !== "order.created" && payload.type !== "order.updated") {
          return;
        }
        listeners.current.forEach((listener) => listener(payload));
        if (payload.type === "order.created") {
          const dishes = dishesLine(payload.order);
          toast.custom(
            () => (
              <OrderSlipToast
                tableNumber={payload.order.tableNumber}
                dishes={dishes}
                house={payload.restaurantName}
              />
            ),
            { duration: 8000, unstyled: true },
          );
          playOrderChime();
          notifyBrowser(
            `${payload.restaurantName} · Table ${payload.order.tableNumber}`,
            dishes || "New order",
          );
        }
      } catch {
        /* ignore keep-alive junk */
      }
    };

    return () => {
      source.close();
      setConnected(false);
    };
  }, [staff, selectedRestaurantId]);

  return (
    <LiveContext.Provider value={{ connected, subscribe }}>
      {children}
    </LiveContext.Provider>
  );
}

export function useLive() {
  const context = useContext(LiveContext);
  if (!context) {
    throw new Error("useLive must be used inside LiveProvider");
  }
  return context;
}

export function useLiveOrders(onEvent: Listener) {
  const { subscribe } = useLive();
  const saved = useRef(onEvent);

  useEffect(() => {
    saved.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    return subscribe((event) => saved.current(event));
  }, [subscribe]);
}
