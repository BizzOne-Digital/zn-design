"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { forwardRef, type SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      className,
      options,
      error,
      placeholder,
      id,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) {
    const errorId = error && id ? `${id}-error` : undefined;

    return (
      <div className="relative w-full">
        <select
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [ariaDescribedBy, errorId].filter(Boolean).join(" ") || undefined
          }
          className={cn(
            "w-full appearance-none rounded-xl border border-taupe/30 bg-ivory px-4 py-3 pr-10 text-sm text-ink",
            "transition-colors duration-200",
            "focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error &&
              "border-dusty-rose focus:border-dusty-rose focus:ring-dusty-rose/25",
            className,
          )}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-taupe"
          aria-hidden="true"
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
