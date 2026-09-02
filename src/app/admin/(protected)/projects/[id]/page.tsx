import { getProjectById } from "@/actions/admin/projects";
import { ProjectEditor } from "@/components/admin/ProjectEditor";
import type { CreateProjectInput } from "@/lib/validations/admin";
import type { ContentBlock, MediaImage } from "@/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Project | ZN Design Admin",
  robots: { index: false, follow: false },
};

function serializeProject(data: Record<string, unknown>): CreateProjectInput {
  return {
    title: String(data.title ?? ""),
    slug: String(data.slug ?? ""),
    category: data.category as CreateProjectInput["category"],
    shortDescription: String(data.shortDescription ?? ""),
    client: data.client ? String(data.client) : undefined,
    year: Number(data.year ?? new Date().getFullYear()),
    services: (data.services as string[]) ?? [],
    coverImage: data.coverImage as MediaImage,
    gallery: (data.gallery as MediaImage[]) ?? [],
    contentBlocks: (data.contentBlocks as ContentBlock[]) ?? [],
    challenge: data.challenge ? String(data.challenge) : undefined,
    strategy: data.strategy ? String(data.strategy) : undefined,
    creativeDirection: data.creativeDirection
      ? String(data.creativeDirection)
      : undefined,
    solution: data.solution ? String(data.solution) : undefined,
    result: data.result ? String(data.result) : undefined,
    status: (data.status as CreateProjectInput["status"]) ?? "draft",
    featured: Boolean(data.featured),
    displayOrder: Number(data.displayOrder ?? 0),
    seoTitle: data.seoTitle ? String(data.seoTitle) : undefined,
    seoDescription: data.seoDescription
      ? String(data.seoDescription)
      : undefined,
    aspectRatio: data.aspectRatio ? String(data.aspectRatio) : undefined,
    isSample: Boolean(data.isSample),
  };
}

export default async function ProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "new") {
    return <ProjectEditor />;
  }

  const result = await getProjectById(id);

  if (!result.success) {
    notFound();
  }

  return (
    <ProjectEditor
      projectId={id}
      initialData={serializeProject(result.data)}
    />
  );
}
