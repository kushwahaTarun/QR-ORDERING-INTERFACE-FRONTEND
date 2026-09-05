"use client";

/* eslint-disable react-hooks/set-state-in-effect -- hydrate staff from the session cookie */
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  loginRequest,
  logoutRequest,
  meRequest,
  selectRestaurantRequest,
} from "@/lib/api";
import type { RestaurantRef, Staff, StaffRole } from "@/lib/types";

type AuthContextValue = {
  staff: Staff | null;
  restaurants: RestaurantRef[];
  selectedRestaurantId: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  selectRestaurant: (id: string | null) => Promise<void>;
  canFinance: boolean;
  canSettings: boolean;
  isSuper: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function flags(role?: StaffRole) {
  return {
    canFinance: role === "OWNER" || role === "SUPER_ADMIN",
    canSettings: role === "OWNER" || role === "SUPER_ADMIN",
    isSuper: role === "SUPER_ADMIN",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [restaurants, setRestaurants] = useState<RestaurantRef[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await meRequest();
      setStaff(data.staff);
      setRestaurants(data.restaurants);
      setSelectedRestaurantId(
        data.selectedRestaurantId ??
          data.staff.restaurantId ??
          data.restaurants[0]?.id ??
          null,
      );
    } catch {
      setStaff(null);
      setRestaurants([]);
      setSelectedRestaurantId(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const value = useMemo<AuthContextValue>(() => {
    const roleFlags = flags(staff?.role);
    return {
      staff,
      restaurants,
      selectedRestaurantId,
      loading,
      login: async (email, password) => {
        const data = await loginRequest(email, password);
        setStaff(data.staff);
        setRestaurants(data.restaurants);
        setSelectedRestaurantId(
          data.staff.restaurantId ?? data.restaurants[0]?.id ?? null,
        );
        router.replace("/");
        router.refresh();
      },
      logout: async () => {
        await logoutRequest();
        setStaff(null);
        setRestaurants([]);
        setSelectedRestaurantId(null);
        router.replace("/login");
        router.refresh();
      },
      selectRestaurant: async (id) => {
        await selectRestaurantRequest(id);
        setSelectedRestaurantId(id);
        router.refresh();
      },
      ...roleFlags,
    };
  }, [loading, restaurants, router, selectedRestaurantId, staff]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
