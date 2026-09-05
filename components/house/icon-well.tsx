import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function IconWell({
  icon: Icon,
  className,
  size = "md",
}: {
  icon: Icon;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const box =
    size === "lg" ? "h-12 w-12" : size === "sm" ? "h-9 w-9" : "h-10 w-10";
  const glyph = size === "lg" ? 26 : size === "sm" ? 18 : 22;

  return (
    <span className={cn("icon-well transition-transform duration-300 ease-out", box, className)}>
      <Icon weight="duotone" size={glyph} />
    </span>
  );
}
