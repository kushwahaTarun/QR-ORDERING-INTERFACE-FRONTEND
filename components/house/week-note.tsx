import {
  Flag,
  ThumbsUp,
  Warning,
  type Icon,
} from "@phosphor-icons/react";
import { IconWell } from "@/components/house/icon-well";
import type { Insight } from "@/lib/types";
import { cn } from "@/lib/utils";

const TONE: Record<
  string,
  { label: string; icon: Icon }
> = {
  good: { label: "Going well", icon: ThumbsUp },
  watch: { label: "Have a look", icon: Warning },
  action: { label: "Do this", icon: Flag },
};

export function WeekNote({ note }: { note: Insight }) {
  const tone = TONE[note.tone] ?? TONE.watch;
  const tags = note.tags?.filter(Boolean) ?? [];

  return (
    <article className="group lift surface flex gap-4 rounded-md p-4 hover:border-primary/40">
      <IconWell icon={tone.icon} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-primary">
          {tone.label}
        </p>
        <h3 className="mt-1 font-heading text-2xl leading-tight">{note.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {note.body}
        </p>
        {tags.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <li
                key={tag}
                className="border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

export function WeekNoteList({
  notes,
  className,
}: {
  notes: Insight[];
  className?: string;
}) {
  if (notes.length === 0) return null;
  return (
    <ul className={cn("grid gap-3", className)} aria-label="Notes for this week">
      {notes.map((note) => (
        <li key={note.title}>
          <WeekNote note={note} />
        </li>
      ))}
    </ul>
  );
}
