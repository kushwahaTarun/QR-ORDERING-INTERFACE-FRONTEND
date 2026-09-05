import { cn } from "@/lib/utils";

export type ColumnItem = {
  key: string;
  value: number;
  label: string;
  detail: string;
  tipTitle: string;
  tipBody: string;
  muteLabel?: boolean;
  sublabel?: string;
};

function tipAlign(index: number, total: number) {
  if (index === 0) return "left-0";
  if (index === total - 1) return "right-0";
  return "left-1/2 -translate-x-1/2";
}

export function ColumnChart({
  items,
  caption,
}: {
  items: ColumnItem[];
  caption: string;
}) {
  const max = Math.max(1, ...items.map((item) => item.value));
  const dense = items.length > 12;
  const showCounts = items.length <= 8;

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Nothing to show yet.</p>;
  }

  return (
    <ul
      className={cn("flex items-stretch pt-12", dense ? "gap-px" : "gap-2")}
      aria-label={caption}
    >
      {items.map((item, index) => {
        const peak = item.value > 0 && item.value === max;
        const height =
          item.value <= 0 ? 3 : Math.max(8, Math.round((item.value / max) * 100));
        return (
          <li key={item.key} className="min-w-0 flex-1">
            <button
              type="button"
              aria-label={item.detail}
              className="press group relative z-0 flex h-full w-full cursor-pointer flex-col border-0 bg-transparent p-0 text-left font-[inherit] hover:z-30 focus-visible:z-30"
            >
              <div className="relative flex h-36 flex-col justify-end">
                <div
                  className={cn(
                    "pointer-events-none absolute bottom-full z-20 mb-2 w-max max-w-[12rem] origin-bottom rounded-md border border-border bg-popover px-2.5 py-2 opacity-0 shadow-lg transition-[opacity,transform] duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:scale-100 group-focus-visible:opacity-100",
                    tipAlign(index, items.length),
                    "translate-y-1 scale-95",
                  )}
                >
                  <p className="font-heading text-sm leading-tight text-foreground">
                    {item.tipTitle}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {item.tipBody}
                  </p>
                </div>
                {showCounts && item.value > 0 ? (
                  <p
                    className={cn(
                      "mb-1 text-center text-[10px] tabular-nums transition-colors duration-300",
                      peak
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-primary group-focus-visible:text-primary",
                    )}
                    aria-hidden="true"
                  >
                    {item.value}
                  </p>
                ) : null}
                <div
                  className={cn(
                    "w-full origin-bottom rounded-sm transition-[transform,background-color] duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-110 group-hover:bg-primary group-focus-visible:scale-y-110 group-focus-visible:bg-primary",
                    peak ? "bg-primary" : "bg-primary/30",
                  )}
                  style={{ height: `${height}%` }}
                />
              </div>
              <p
                className={cn(
                  "mt-2 truncate text-center transition-colors duration-300",
                  item.sublabel
                    ? "text-[12px] leading-tight"
                    : "text-[10px] uppercase tracking-[0.08em]",
                  peak
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground",
                  item.muteLabel && "invisible",
                )}
                aria-hidden="true"
              >
                {item.label}
              </p>
              {item.sublabel ? (
                <p
                  className="truncate text-center text-[10px] text-muted-foreground"
                  aria-hidden="true"
                >
                  {item.sublabel}
                </p>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}