import type { SerializedPricingPackage } from "@/lib/data";
import { Check, Minus } from "lucide-react";

export interface ComparisonTableProps {
  packages: SerializedPricingPackage[];
}

export function ComparisonTable({ packages }: ComparisonTableProps) {
  if (packages.length < 2) return null;

  const allDeliverables = Array.from(
    new Set(packages.flatMap((pkg) => pkg.deliverables)),
  );

  if (allDeliverables.length === 0) return null;

  return (
    <div>
      <p className="mb-3 text-xs text-taupe md:hidden">
        Swipe horizontally to compare packages
      </p>
      <div className="overflow-x-auto rounded-2xl border border-taupe/15 sm:rounded-[1.5rem]">
      <table className="min-w-[36rem] border-collapse text-left text-sm">
        <thead className="bg-cream/60">
          <tr>
            <th className="px-6 py-4 font-semibold uppercase tracking-[0.12em] text-taupe">
              Included
            </th>
            {packages.map((pkg) => (
              <th
                key={pkg._id}
                className="px-6 py-4 font-display text-xl text-ink"
              >
                {pkg.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allDeliverables.map((deliverable) => (
            <tr key={deliverable} className="border-t border-taupe/10">
              <td className="px-6 py-4 text-ink">{deliverable}</td>
              {packages.map((pkg) => {
                const included = pkg.deliverables.includes(deliverable);
                return (
                  <td key={pkg._id} className="px-6 py-4">
                    {included ? (
                      <Check className="h-4 w-4 text-gold" aria-label="Included" />
                    ) : (
                      <Minus className="h-4 w-4 text-taupe/50" aria-label="Not included" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
