"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGroup, motion } from "motion/react";
import {
  AddressBook,
  Buildings,
  ChartLineUp,
  CookingPot,
  ForkKnife,
  GearSix,
  House,
  List,
  Notebook,
  QrCode,
  SignOut,
  type Icon,
} from "@phosphor-icons/react";
import { Clock } from "@/components/house/clock";
import { useLive } from "@/components/house/live-provider";
import { useAuth } from "@/components/house/auth-provider";
import { roleLabel } from "@/lib/copy";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: Icon;
  finance?: boolean;
  settings?: boolean;
  superOnly?: boolean;
};

const NAV: { group: string; items: NavItem[] }[] = [
  {
    group: "Service",
    items: [
      { href: "/", label: "Today", icon: House },
      { href: "/orders", label: "Kitchen", icon: CookingPot },
    ],
  },
  {
    group: "Restaurant",
    items: [
      { href: "/menu", label: "Menu", icon: ForkKnife },
      { href: "/tables", label: "Table cards", icon: QrCode },
      { href: "/guests", label: "Guest book", icon: AddressBook },
    ],
  },
  {
    group: "Owner",
    items: [
      { href: "/analytics", label: "Sales", icon: ChartLineUp, finance: true },
      { href: "/reports", label: "This week", icon: Notebook, finance: true },
      { href: "/settings", label: "Restaurant", icon: GearSix, settings: true },
    ],
  },
  {
    group: "",
    items: [
      {
        href: "/restaurants",
        label: "All restaurants",
        icon: Buildings,
        superOnly: true,
      },
    ],
  },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const {
    staff,
    restaurants,
    selectedRestaurantId,
    logout,
    selectRestaurant,
    canFinance,
    canSettings,
    isSuper,
    loading,
  } = useAuth();
  const { connected } = useLive();

  const groups = NAV.map((group) => ({
    ...group,
    items: group.items.filter((item) => {
      if (item.superOnly && !isSuper) return false;
      if (item.finance && !canFinance) return false;
      if (item.settings && !canSettings) return false;
      return true;
    }),
  })).filter((group) => group.items.length > 0);

  const restaurantName = loading
    ? "Opening…"
    : restaurants.find((row) => row.id === selectedRestaurantId)?.name ??
      (isSuper ? "All restaurants" : "Dining House");

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16.5rem_1fr]">
      <aside className="border-b border-border bg-[#0c0a08] print:hidden lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-5 lg:block">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-primary">
              Dining House
            </p>
            <p className="mt-1 font-heading text-2xl leading-none">
              {restaurantName}
            </p>
          </div>
          <details className="lg:hidden">
            <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center border border-border">
              <List size={20} />
              <span className="sr-only">Open menu</span>
            </summary>
            <nav className="absolute left-0 right-0 z-20 mt-2 border-b border-border bg-[#0c0a08] px-3 py-4">
              <NavGroups groups={groups} pathname={pathname} />
            </nav>
          </details>
        </div>
        <nav className="hidden min-h-0 flex-1 overflow-y-auto px-3 pb-4 lg:block">
          <NavGroups groups={groups} pathname={pathname} />
        </nav>
        <div className="hidden border-t border-border px-5 py-4 lg:block">
          <p className="truncate text-sm font-medium">{staff?.name}</p>
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-primary">
            {roleLabel(staff?.role)}
          </p>
          <button
            type="button"
            className="mt-3 inline-flex cursor-pointer items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground hover:text-primary"
            onClick={() => void logout()}
          >
            <SignOut size={16} weight="duotone" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur print:hidden sm:px-6">
          <div className="flex items-center gap-3">
            <span
              className={
                connected
                  ? "inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-emerald-300"
                  : "inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
              }
            >
              <span
                className={
                  connected
                    ? "live-dot"
                    : "h-1.5 w-1.5 rounded-full bg-muted-foreground"
                }
              />
              {connected ? "Live" : "Connecting"}
            </span>
            <Clock />
          </div>
          {isSuper ? (
            <select
              aria-label="Looking at"
              className="min-h-10 max-w-[16rem] border-0 border-b border-input bg-transparent text-sm"
              value={selectedRestaurantId ?? ""}
              onChange={(event) => {
                void selectRestaurant(event.target.value || null);
              }}
            >
              <option value="">All restaurants</option>
              {restaurants.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="truncate text-sm text-muted-foreground">
              {restaurantName}
            </p>
          )}
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground hover:text-primary lg:hidden"
            onClick={() => void logout()}
          >
            <SignOut size={16} weight="duotone" />
            <span className="sr-only">Sign out</span>
          </button>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavGroups({
  groups,
  pathname,
}: {
  groups: { group: string; items: NavItem[] }[];
  pathname: string;
}) {
  return (
    <LayoutGroup>
    <div className="grid gap-5">
      {groups.map((group) => (
        <div key={group.group || "more"}>
          {group.group ? (
            <p className="mb-1.5 px-3 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {group.group}
            </p>
          ) : null}
          <ul className="grid gap-0.5">
            {group.items.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative flex min-h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-300",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {active ? (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-md bg-secondary"
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      />
                    ) : null}
                    <Icon
                      weight={active ? "duotone" : "regular"}
                      size={20}
                      className={cn("relative z-10", active ? "text-primary" : "")}
                    />
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
    </LayoutGroup>
  );
}
