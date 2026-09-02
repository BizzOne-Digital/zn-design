"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type TextareaHTMLAttributes } from "react";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { className, error, id, "aria-describedby": ariaDescribedBy, ...props },
    ref,
  ) {
    const errorId = error && id ? `${id}-error` : undefined;

    return (
      <div className="w-full">
        <textarea
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [ariaDescribedBy, errorId].filter(Boolean).join(" ") || undefined
          }
          className={cn(
            "min-h-[140px] w-full resize-y rounded-xl border border-taupe/30 bg-ivory px-4 py-3 text-sm text-ink",
            "placeholder:text-taupe/70 transition-colors duration-200",
            "focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error &&
              "border-dusty-rose focus:border-dusty-rose focus:ring-dusty-rose/25",
            className,
          )}
          {...props}
        />
        {error ? (
          <p
            id={errorId}
            className="mt-1.5 text-xs text-dusty-rose"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
