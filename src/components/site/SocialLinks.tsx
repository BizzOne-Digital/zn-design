import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  type LucideIcon,
} from "lucide-react";
import type { SocialLinks as SocialLinksType } from "@/types";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
};

export interface SocialLinksProps {
  links?: SocialLinksType | null;
  className?: string;
  iconClassName?: string;
}

export function SocialLinks({
  links,
  className,
  iconClassName,
}: SocialLinksProps) {
  if (!links) return null;

  const entries = Object.entries(links).filter(
    ([, url]) => typeof url === "string" && url.trim().length > 0,
  );

  if (entries.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap items-center gap-3", className)}>
      {entries.map(([key, url]) => {
        const Icon = iconMap[key];
        const label = key.charAt(0).toUpperCase() + key.slice(1);

        return (
          <li key={key}>
            <Link
              href={url as string}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-full border border-taupe/25 text-ink transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                iconClassName,
              )}
              aria-label={`${label} (opens in new tab)`}
            >
              {Icon ? (
                <Icon className="h-4 w-4" aria-hidden="true" />
              ) : (
                <span className="text-xs font-semibold uppercase">{label[0]}</span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
