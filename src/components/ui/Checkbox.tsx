"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: React.ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { className, label, error, id, "aria-describedby": ariaDescribedBy, ...props },
    ref,
  ) {
    const errorId = error && id ? `${id}-error` : undefined;

    return (
      <div className="w-full">
        <label
          htmlFor={id}
          className={cn(
            "group flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink",
            props.disabled && "cursor-not-allowed opacity-50",
            className,
          )}
        >
          <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
            <input
              ref={ref}
              id={id}
              type="checkbox"
              aria-invalid={error ? true : undefined}
              aria-describedby={
                [ariaDescribedBy, errorId].filter(Boolean).join(" ") ||
                undefined
              }
              className="peer sr-only"
              {...props}
            />
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-md border border-taupe/40 bg-ivory",
                "transition-all duration-200",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-gold peer-focus-visible:ring-offset-2",
                "peer-checked:border-ink peer-checked:bg-ink",
                "peer-checked:[&_svg]:opacity-100",
                error && "border-dusty-rose",
              )}
              aria-hidden="true"
            >
              <Check className="h-3.5 w-3.5 text-ivory opacity-0 transition-opacity" />
            </span>
          </span>
          <span>{label}</span>
        </label>
        {error ? (
          <p
            id={errorId}
            className="mt-1.5 pl-8 text-xs text-dusty-rose"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
