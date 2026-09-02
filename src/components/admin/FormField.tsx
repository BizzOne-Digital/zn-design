"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/Label";
import type { ReactNode } from "react";

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  required,
  error,
  hint,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {children}
      {hint && !error ? (
        <p className="text-xs text-taupe">{hint}</p>
      ) : null}
      {error ? (
        <p className="text-xs text-dusty-rose" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const inputClassName =
  "w-full rounded-lg border border-taupe/30 bg-white px-3 py-2 text-sm text-ink placeholder:text-taupe/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";

export const textareaClassName =
  "w-full rounded-lg border border-taupe/30 bg-white px-3 py-2 text-sm text-ink placeholder:text-taupe/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold min-h-[100px] resize-y";

export const selectClassName =
  "w-full rounded-lg border border-taupe/30 bg-white px-3 py-2 text-sm text-ink focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";
