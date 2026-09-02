import { getServiceById } from "@/actions/admin/services";
import { ServiceEditor } from "@/components/admin/ServiceEditor";
import type { CreateServiceInput } from "@/lib/validations/admin";
import type { MediaImage } from "@/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Service | ZN Design Admin",
  robots: { index: false, follow: false },
};

function serializeService(data: Record<string, unknown>): CreateServiceInput {
  return {
    title: String(data.title ?? ""),
    slug: String(data.slug ?? ""),
    shortDescription: String(data.shortDescription ?? ""),
    fullDescription: String(data.fullDescription ?? ""),
    deliverables: (data.deliverables as string[]) ?? [],
    processNotes: data.processNotes ? String(data.processNotes) : undefined,
    featuredImage: data.featuredImage as MediaImage | undefined,
    gallery: (data.gallery as MediaImage[]) ?? [],
    displayOrder: Number(data.displayOrder ?? 0),
    active: Boolean(data.active ?? true),
    featured: Boolean(data.featured),
    seoTitle: data.seoTitle ? String(data.seoTitle) : undefined,
    seoDescription: data.seoDescription
      ? String(data.seoDescription)
      : undefined,
  };
}

export default async function ServiceEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "new") {
    return <ServiceEditor />;
  }

  const result = await getServiceById(id);

  if (!result.success) {
    notFound();
  }

  return (
    <ServiceEditor
      serviceId={id}
      initialData={serializeService(result.data)}
    />
  );
}
