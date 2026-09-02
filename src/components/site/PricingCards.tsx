import Link from "next/link";
import { Check } from "lucide-react";
import type { SerializedPricingPackage } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export interface PricingCardsProps {
  packages: SerializedPricingPackage[];
}

function formatPriceLabel(label?: string): string | null {
  if (!label?.trim()) return null;
  const normalized = label.trim();
  if (normalized === "$0" || normalized.toLowerCase() === "undefined") {
    return null;
  }
  return normalized;
}

export function PricingCards({ packages }: PricingCardsProps) {
  if (packages.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-taupe/30 bg-cream/40 px-8 py-16 text-center">
        <p className="font-display text-2xl text-ink">Packages coming soon</p>
        <p className="mt-3 text-sm text-soft-black/70">
          Pricing frameworks will appear here once configured in the admin portal.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {packages.map((pkg) => {
        const priceLabel = formatPriceLabel(pkg.priceLabel);

        return (
          <article
            key={pkg._id}
            className={cn(
              "flex flex-col rounded-[1.5rem] border p-8",
              pkg.featured
                ? "border-gold/40 bg-gradient-to-br from-cream via-ivory to-pale-gold/15 shadow-[0_20px_60px_-30px_rgba(197,139,50,0.35)]"
                : "border-taupe/15 bg-ivory",
            )}
          >
            <div className="mb-6 flex items-center justify-between gap-3">
              <h3 className="font-display text-2xl text-ink">{pkg.title}</h3>
              {pkg.featured ? <Badge variant="gold">Featured</Badge> : null}
            </div>

            {pkg.subtitle ? (
              <p className="text-sm text-taupe">{pkg.subtitle}</p>
            ) : null}

            <p className="mt-4 text-sm leading-relaxed text-soft-black/80">
              {pkg.description}
            </p>

            <p className="mt-6 font-display text-3xl text-ink">
              {priceLabel ?? "Custom Quote"}
            </p>

            {pkg.deliverables.length > 0 ? (
              <ul className="mt-6 space-y-3 border-t border-taupe/15 pt-6">
                {pkg.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {pkg.idealFor ? (
              <p className="mt-6 text-sm text-taupe">
                <span className="font-semibold text-ink">Ideal for:</span>{" "}
                {pkg.idealFor}
              </p>
            ) : null}

            <Link
              href="/contact"
              className={cn(
                "mt-8 inline-flex h-12 items-center justify-center rounded-full text-sm font-semibold uppercase tracking-[0.14em] transition-colors",
                pkg.featured
                  ? "bg-ink text-ivory hover:bg-ink/90"
                  : "border border-ink/20 text-ink hover:border-ink",
              )}
            >
              Request a Quote
            </Link>
          </article>
        );
      })}
    </div>
  );
}
