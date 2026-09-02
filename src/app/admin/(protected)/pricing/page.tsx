import { listPricingPackages } from "@/actions/admin/pricing";
import { PricingManager, type PricingRow } from "@/components/admin/PricingManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | ZN Design Admin",
  robots: { index: false, follow: false },
};

function serializePackages(data: Record<string, unknown>[]): PricingRow[] {
  return data.map((p) => ({
    id: String(p.id),
    title: String(p.title),
    subtitle: p.subtitle ? String(p.subtitle) : undefined,
    description: String(p.description ?? ""),
    deliverables: (p.deliverables as string[]) ?? [],
    idealFor: p.idealFor ? String(p.idealFor) : undefined,
    priceLabel: p.priceLabel ? String(p.priceLabel) : undefined,
    featured: Boolean(p.featured),
    active: Boolean(p.active ?? true),
    displayOrder: Number(p.displayOrder ?? 0),
  }));
}

export default async function PricingPage() {
  const result = await listPricingPackages();

  if (!result.success) {
    return (
      <div className="rounded-xl border border-dusty-rose/30 bg-red-50 px-6 py-8 text-sm text-dusty-rose">
        {result.error}
      </div>
    );
  }

  return <PricingManager packages={serializePackages(result.data)} />;
}
