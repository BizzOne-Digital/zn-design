import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export type BadgeVariant = "default" | "gold" | "blush" | "outline" | "ink";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-cream text-ink",
  gold: "bg-gold/15 text-gold border border-gold/30",
  blush: "bg-blush/20 text-dusty-rose border border-blush/40",
  outline: "border border-taupe/40 text-taupe bg-transparent",
  ink: "bg-ink text-ivory",
};

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em]",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
