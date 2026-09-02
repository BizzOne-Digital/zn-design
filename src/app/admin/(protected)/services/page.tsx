import { listServices } from "@/actions/admin/services";
import { ServicesManager, type ServiceRow } from "@/components/admin/ServicesManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | ZN Design Admin",
  robots: { index: false, follow: false },
};

function serializeServices(data: Record<string, unknown>[]): ServiceRow[] {
  return data.map((s) => ({
    id: String(s.id),
    title: String(s.title),
    slug: String(s.slug),
    active: Boolean(s.active),
    featured: Boolean(s.featured),
    displayOrder: Number(s.displayOrder ?? 0),
  }));
}

export default async function ServicesPage() {
  const result = await listServices();

  if (!result.success) {
    return (
      <div className="rounded-xl border border-dusty-rose/30 bg-red-50 px-6 py-8 text-sm text-dusty-rose">
        {result.error}
      </div>
    );
  }

  return <ServicesManager services={serializeServices(result.data)} />;
}
