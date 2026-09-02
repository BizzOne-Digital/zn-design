import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export interface MetricsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: LucideIcon;
  href?: string;
  className?: string;
}

export function MetricsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  href,
  className,
}: MetricsCardProps) {
  const content = (
    <div
      className={cn(
        "rounded-xl border border-taupe/20 bg-white p-5 transition-colors",
        href && "hover:border-gold/40 hover:bg-cream/30",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-taupe">
            {title}
          </p>
          <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
          {subtitle ? (
            <p className="mt-1 text-xs text-taupe">{subtitle}</p>
          ) : null}
        </div>
        {Icon ? (
          <div className="rounded-lg bg-cream/60 p-2.5 text-dusty-rose">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        ) : null}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
