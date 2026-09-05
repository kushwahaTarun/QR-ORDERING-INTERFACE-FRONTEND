import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "danger"
  | "ink"
  | "link"
  | "inkGhost"
  | "accentGhost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-[#d4b07a] disabled:opacity-50",
  secondary:
    "bg-transparent text-foreground border border-border hover:border-primary disabled:opacity-50",
  ghost:
    "bg-transparent hover:text-primary text-muted-foreground disabled:opacity-50",
  outline:
    "border border-border bg-transparent hover:border-primary disabled:opacity-50",
  danger: "text-destructive border border-destructive/40 hover:bg-destructive/10",
  ink: "bg-ink text-paper hover:bg-[#2a2118] disabled:opacity-50",
  link: "bg-transparent text-primary hover:text-[#d4b07a] disabled:opacity-50",
  inkGhost: "bg-transparent text-ink hover:opacity-70 disabled:opacity-50",
  accentGhost: "bg-transparent text-accent hover:opacity-70 disabled:opacity-50",
};

const sizes: Record<Size, string> = {
  sm: "min-h-11 px-4 text-[11px] tracking-[0.16em] uppercase",
  md: "min-h-11 px-5 text-[11px] tracking-[0.16em] uppercase",
  lg: "min-h-12 px-6 text-xs tracking-[0.18em] uppercase",
};

const baseClass =
  "press inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm font-medium disabled:cursor-not-allowed";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  href?: string;
  external?: boolean;
  children?: ReactNode;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  href,
  external,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const classes = cn(baseClass, variants[variant], sizes[size], className);
  const ariaLabel = props["aria-label"];

  if (href) {
    if (disabled) {
      return (
        <span className={cn(classes, "pointer-events-none opacity-50")}>
          {children}
        </span>
      );
    }
    const isExternal = external || /^(https?:|tel:|mailto:)/i.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          aria-label={ariaLabel}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} className={classes} {...props}>
      {children}
    </button>
  );
}
