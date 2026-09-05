import { Phone, WhatsappLogo } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { formatVisit, inr } from "@/lib/format";
import {
  formatIndianMobile,
  guestInitials,
  telHref,
  whatsappHref,
} from "@/lib/phone";
import type { Guest } from "@/lib/types";

export function GuestCard({
  guest,
  thankYou,
}: {
  guest: Guest;
  thankYou?: string;
}) {
  const displayName = guest.name.trim() || "Guest";
  const mobile = formatIndianMobile(guest.mobile);
  const call = telHref(guest.mobile);
  const chat = whatsappHref(guest.mobile, thankYou);
  const regular = guest.orders >= 2;

  return (
    <article className="lift surface flex flex-col gap-4 rounded-md p-4 hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <span
          className="icon-well h-12 w-12 font-heading text-lg"
          aria-hidden="true"
        >
          {guestInitials(guest.name, guest.mobile)}
        </span>
        <div className="min-w-0">
          <h2 className="font-heading text-2xl leading-tight">{displayName}</h2>
          <p className="mt-0.5 text-sm tabular-nums text-muted-foreground">
            {mobile || "No mobile left"}
          </p>
          {regular || guest.wantsOffers ? (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {regular ? (
                <li className="border border-primary/35 bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-primary">
                  Regular
                </li>
              ) : null}
              {guest.wantsOffers ? (
                <li className="border border-border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Wants offers
                </li>
              ) : null}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:items-end">
        <dl className="grid grid-cols-3 gap-3 sm:flex sm:gap-6">
          <div>
            <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Visits
            </dt>
            <dd className="mt-1 font-heading text-xl leading-none">
              {guest.orders}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Spent
            </dt>
            <dd className="mt-1 font-heading text-xl leading-none">
              {inr(guest.spent)}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Last visit
            </dt>
            <dd className="mt-1 truncate text-sm text-muted-foreground">
              {formatVisit(guest.lastVisit)}
            </dd>
          </div>
        </dl>

        {chat || call ? (
          <div className="flex gap-2">
            {chat ? (
              <Button
                href={chat}
                external
                variant="secondary"
                size="sm"
                className="flex-1 sm:flex-none sm:min-w-32"
                aria-label={`WhatsApp ${displayName}`}
              >
                <WhatsappLogo size={16} weight="duotone" aria-hidden="true" />
                WhatsApp
              </Button>
            ) : null}
            {call ? (
              <Button
                href={call}
                variant="secondary"
                size="sm"
                className="flex-1 sm:flex-none sm:min-w-32"
                aria-label={`Call ${displayName}`}
              >
                <Phone size={16} weight="duotone" aria-hidden="true" />
                Call
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
