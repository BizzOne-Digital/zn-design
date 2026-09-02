import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/brand/zn-design-logo.jpg";

export interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "mark";
}

const sizeMap = {
  sm: { height: 44, wordmark: "text-base" },
  md: { height: 56, wordmark: "text-lg" },
  lg: { height: 72, wordmark: "text-xl" },
};

export function Logo({
  className,
  showWordmark = true,
  size = "md",
  variant = "default",
}: LogoProps) {
  const dimensions = sizeMap[size];
  const isMarkOnly = variant === "mark" || !showWordmark;

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex max-w-full items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory sm:gap-3",
        className,
      )}
      aria-label="ZN Design — Home"
    >
      <span
        className={cn(
          "relative block shrink-0 transition-transform duration-300 group-hover:scale-[1.02]",
          isMarkOnly ? "" : "rounded-full bg-cream p-1 ring-1 ring-taupe/15",
        )}
        style={{ height: dimensions.height }}
      >
        <Image
          src={LOGO_SRC}
          alt="ZN Design logo"
          width={dimensions.height}
          height={dimensions.height}
          className="h-full w-auto max-w-none object-contain"
          priority
          unoptimized
        />
      </span>
      {showWordmark ? (
        <span
          className={cn(
            "font-display font-semibold tracking-[0.08em] text-ink",
            dimensions.wordmark,
          )}
        >
          ZN Design
        </span>
      ) : null}
    </Link>
  );
}
