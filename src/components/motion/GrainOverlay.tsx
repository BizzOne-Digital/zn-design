"use client";

import { cn } from "@/lib/utils";

export interface GrainOverlayProps {
  className?: string;
  opacity?: number;
}

export function GrainOverlay({ className, opacity = 0.04 }: GrainOverlayProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-[1] mix-blend-multiply grain-texture",
        className,
      )}
      style={{ opacity }}
    />
  );
}
