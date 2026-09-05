"use client";

import {
  Eye,
  EyeSlash,
  PencilSimple,
  Star,
  Trash,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { dietLabel } from "@/lib/copy";
import { inrExact } from "@/lib/format";
import type { MenuItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const dietDot: Record<string, string> = {
  veg: "bg-emerald-400",
  "non-veg": "bg-[#c45c48]",
  egg: "bg-amber-400",
};

export function MenuDishRow({
  item,
  onEdit,
  onToggle,
  onRemove,
}: {
  item: MenuItem;
  onEdit: () => void;
  onToggle: () => void;
  onRemove: () => void;
}) {
  return (
    <article
      className={cn(
        "grid gap-4 py-5 sm:grid-cols-[6.5rem_1fr_auto] sm:items-center",
        !item.available && "opacity-55",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.image}
        alt=""
        className="h-28 w-full object-cover sm:h-[6.5rem] sm:w-[6.5rem]"
      />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-heading text-2xl leading-tight">{item.name}</h3>
          {item.popular ? (
            <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-primary">
              <Star size={14} weight="fill" />
              Popular
            </span>
          ) : null}
          {item.chefPick ? (
            <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Chef’s pick
            </span>
          ) : null}
          {!item.available ? (
            <span className="text-[11px] uppercase tracking-[0.14em] text-destructive">
              Hidden
            </span>
          ) : null}
        </div>
        <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <span
            className={cn(
              "inline-block h-2 w-2 rounded-full",
              dietDot[item.diet] ?? "bg-muted-foreground",
            )}
            aria-hidden
          />
          {dietLabel(item.diet)}
        </p>
        {item.description ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        ) : null}
        <p className="mt-2 font-heading text-xl">{inrExact(item.price)}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={onToggle}>
          {item.available ? (
            <EyeSlash size={16} weight="duotone" />
          ) : (
            <Eye size={16} weight="duotone" />
          )}
          {item.available ? "Hide" : "Show"}
        </Button>
        <Button size="sm" variant="secondary" onClick={onEdit}>
          <PencilSimple size={16} weight="duotone" />
          Edit
        </Button>
        <Button size="sm" variant="ghost" onClick={onRemove}>
          <Trash size={16} weight="duotone" />
          Remove
        </Button>
      </div>
    </article>
  );
}
