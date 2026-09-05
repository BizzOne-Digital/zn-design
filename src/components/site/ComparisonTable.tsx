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
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <thead className="bg-cream/60">
            <tr>
              <th
                className="sticky left-0 z-10 min-w-[11rem] bg-cream/95 px-4 py-4 font-semibold uppercase tracking-[0.12em] text-taupe backdrop-blur-sm sm:min-w-[14rem] sm:px-6"
              >
                Included
              </th>
              {packages.map((pkg) => (
                <th
                  key={pkg._id}
                  className="min-w-[8.5rem] px-4 py-4 text-center font-display text-lg text-ink sm:min-w-[10rem] sm:px-6 sm:text-xl"
                >
                  {pkg.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allDeliverables.map((deliverable) => (
              <tr key={deliverable} className="border-t border-taupe/10">
                <td
                  className="sticky left-0 z-10 bg-ivory px-4 py-4 align-middle text-ink sm:px-6"
                >
                  {deliverable}
                </td>
                {packages.map((pkg) => {
                  const included = pkg.deliverables.includes(deliverable);
                  return (
                    <td
                      key={pkg._id}
                      className="px-4 py-4 text-center align-middle sm:px-6"
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center">
                        {included ? (
                          <Check
                            className="h-5 w-5 shrink-0 text-gold"
                            aria-label="Included"
                          />
                        ) : (
                          <Minus
                            className="h-4 w-4 shrink-0 text-taupe/50"
                            aria-label="Not included"
                          />
                        )}
                      </span>
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
