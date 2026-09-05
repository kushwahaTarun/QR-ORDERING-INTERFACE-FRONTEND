import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "ink";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-[#d4b07a] disabled:opacity-50",
  secondary:
    "bg-transparent text-foreground border border-border hover:border-primary disabled:opacity-50",
  ghost: "bg-transparent hover:text-primary text-muted-foreground disabled:opacity-50",
  outline:
    "border border-border bg-transparent hover:border-primary disabled:opacity-50",
  danger: "text-destructive border border-destructive/40 hover:bg-destructive/10",
  ink: "bg-ink text-paper hover:bg-[#2a2118] disabled:opacity-50",
};

const sizes: Record<Size, string> = {
  sm: "min-h-11 px-4 text-[11px] tracking-[0.16em] uppercase",
  md: "min-h-11 px-5 text-[11px] tracking-[0.16em] uppercase",
  lg: "min-h-12 px-6 text-xs tracking-[0.18em] uppercase",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm font-medium transition-[color,background-color,border-color,transform] duration-300 ease-out will-change-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:hover:translate-y-0",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
