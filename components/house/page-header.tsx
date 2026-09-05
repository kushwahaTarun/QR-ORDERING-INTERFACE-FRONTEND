"use client";

import type { Icon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { IconWell } from "@/components/house/icon-well";

export function PageHeader({
  icon,
  title,
  description,
  actions,
}: {
  icon?: Icon;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="group flex items-start gap-4">
        {icon ? <IconWell icon={icon} size="lg" /> : null}
        <div>
          <h1 className="font-heading text-3xl tracking-tight sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
