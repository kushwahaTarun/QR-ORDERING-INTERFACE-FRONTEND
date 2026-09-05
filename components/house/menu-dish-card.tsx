"use client";

import { Eye, EyeSlash, PencilSimple, Star } from "@phosphor-icons/react";
import { dietLabel } from "@/lib/copy";
import { inrExact } from "@/lib/format";
import type { MenuItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const dietDot: Record<string, string> = {
  veg: "bg-emerald-400",
  "non-veg": "bg-[#c45c48]",
  egg: "bg-amber-400",
};

export function MenuDishCard({
  item,
  onEdit,
  onToggle,
}: {
  item: MenuItem;
  onEdit: () => void;
  onToggle: () => void;
}) {
  return (
    <article
      className={cn(
        "surface flex h-full flex-col overflow-hidden rounded-md",
        !item.available && "opacity-60",
      )}
    >
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt=""
          className="aspect-[4/3] w-full object-cover"
        />
        <span
          className={cn(
            "absolute left-2 top-2 h-2.5 w-2.5 rounded-full ring-2 ring-black/40",
            dietDot[item.diet] ?? "bg-muted-foreground",
          )}
          title={dietLabel(item.diet)}
        />
        {!item.available ? (
          <span className="absolute right-2 top-2 bg-background/90 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-destructive">
            Hidden
          </span>
        ) : item.popular ? (
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 bg-background/90 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-primary">
            <Star size={12} weight="fill" />
            Popular
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="font-heading text-xl leading-tight">{item.name}</h3>
        <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
          {dietLabel(item.diet)}
        </p>
        <p className="mt-auto pt-3 font-heading text-lg">{inrExact(item.price)}</p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex min-h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 border border-border text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            {item.available ? (
              <EyeSlash size={15} weight="duotone" />
            ) : (
              <Eye size={15} weight="duotone" />
            )}
            {item.available ? "Hide" : "Show"}
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex min-h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 border border-border text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            <PencilSimple size={15} weight="duotone" />
            Edit
          </button>
        </div>
      </div>
    </article>
  );
}
