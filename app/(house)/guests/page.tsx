"use client";

import { useMemo, useState } from "react";
import {
  AddressBook,
  CurrencyInr,
  Megaphone,
  UsersThree,
} from "@phosphor-icons/react";
import { EmptyState } from "@/components/house/empty-state";
import { FilterChip } from "@/components/house/filter-chip";
import { GuestCard } from "@/components/house/guest-card";
import { KpiCard } from "@/components/house/kpi-card";
import { LoadState } from "@/components/house/load-state";
import { PageHeader } from "@/components/house/page-header";
import { SearchField } from "@/components/ui/search-field";
import { inr } from "@/lib/format";
import type { Guest } from "@/lib/types";
import { useHouse } from "@/lib/use-house";

type GuestsPayload = {
  restaurant?: { name: string };
  guests: Guest[];
};

const NONE: Guest[] = [];

export default function GuestsPage() {
  const { data, error, loading } = useHouse<GuestsPayload>("/admin/guests");
  const [query, setQuery] = useState("");
  const [offersOnly, setOffersOnly] = useState(false);

  const guests = data?.guests ?? NONE;
  const term = query.trim().toLowerCase();

  const visible = useMemo(() => {
    return guests.filter((guest) => {
      if (offersOnly && !guest.wantsOffers) return false;
      if (!term) return true;
      const haystack = `${guest.name} ${guest.mobile}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [guests, offersOnly, term]);

  const offerCount = guests.filter((guest) => guest.wantsOffers).length;
  const spent = guests.reduce((sum, guest) => sum + guest.spent, 0);
  const houseName = data?.restaurant?.name?.trim();
  const thankYou = houseName
    ? `Thank you for visiting ${houseName}.`
    : "Thank you for dining with us.";

  return (
    <div className="space-y-8">
      <PageHeader
        icon={AddressBook}
        title="Guest book"
        description="Names and mobiles left for offers. Use for a thank-you — never share the list."
      />
      <LoadState loading={loading} error={error}>
        {guests.length === 0 ? (
          <EmptyState
            title="No names yet"
            body="When a guest adds a name or mobile while ordering, they will show here."
          />
        ) : (
          <div className="space-y-8">
            <div className="grid gap-3 sm:grid-cols-3">
              <KpiCard
                icon={UsersThree}
                label="In the book"
                value={String(guests.length)}
              />
              <KpiCard
                icon={Megaphone}
                label="Wants offers"
                value={String(offerCount)}
              />
              <KpiCard
                icon={CurrencyInr}
                label="Spent with us"
                value={inr(spent)}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <SearchField
                id="find-guest"
                label="Find a name or mobile"
                placeholder="Riya or 8874"
                value={query}
                onChange={setQuery}
              />
              <FilterChip
                active={offersOnly}
                onClick={() => setOffersOnly((current) => !current)}
              >
                Wants offers
              </FilterChip>
            </div>

            {term ? (
              <p className="text-sm text-muted-foreground">
                {visible.length} {visible.length === 1 ? "match" : "matches"} for
                “{query.trim()}”
              </p>
            ) : null}

            {visible.length === 0 ? (
              <EmptyState
                title="No one matches"
                body={
                  term
                    ? "Try another name, or the last few digits of the mobile."
                    : "No one has asked for offers yet. Turn the chip off to see everyone."
                }
              />
            ) : (
              <ul className="grid gap-3">
                {visible.map((guest) => (
                  <li
                    key={
                      guest.mobile ||
                      `name:${guest.name}:${guest.lastVisit}:${guest.orders}`
                    }
                  >
                    <GuestCard guest={guest} thankYou={thankYou} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </LoadState>
    </div>
  );
}
