import { listProjects } from "@/actions/admin/projects";
import { ProjectsManager, type ProjectRow } from "@/components/admin/ProjectsManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | ZN Design Admin",
  robots: { index: false, follow: false },
};

function serializeProjects(data: Record<string, unknown>[]): ProjectRow[] {
  return data.map((p) => ({
    id: String(p.id),
    title: String(p.title),
    slug: String(p.slug),
    category: String(p.category),
    status: p.status as ProjectRow["status"],
    featured: Boolean(p.featured),
    displayOrder: Number(p.displayOrder ?? 0),
    updatedAt:
      p.updatedAt instanceof Date
        ? p.updatedAt.toISOString()
        : String(p.updatedAt),
  }));
}

export default async function ProjectsPage() {
  const result = await listProjects();

  if (!result.success) {
    return (
      <div className="rounded-xl border border-dusty-rose/30 bg-red-50 px-6 py-8 text-sm text-dusty-rose">
        {result.error}
      </div>
    );
  }

  return <ProjectsManager projects={serializeProjects(result.data)} />;
}
