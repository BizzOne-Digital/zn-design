import { cn } from "@/lib/utils";
import type { LabelHTMLAttributes } from "react";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({
  className,
  children,
  required,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn(
        "block text-xs font-semibold uppercase tracking-[0.14em] text-taupe",
        className,
      )}
      {...props}
    >
      {children}
      {required ? (
        <span className="ml-1 text-dusty-rose" aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  );
}
