"use client";

import { deleteProject, updateProject } from "@/actions/admin/projects";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/Button";
import { formatAdminDateShort } from "@/lib/admin-utils";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface ProjectRow {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: "draft" | "published";
  featured: boolean;
  displayOrder: number;
  updatedAt: string;
}

export interface ProjectsManagerProps {
  projects: ProjectRow[];
}

export function ProjectsManager({ projects }: ProjectsManagerProps) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<ProjectRow | null>(null);
  const [loading, setLoading] = useState(false);

  async function toggleFeatured(project: ProjectRow) {
    setLoading(true);
    await updateProject({
      id: project.id,
      featured: !project.featured,
    });
    setLoading(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setLoading(true);
    const result = await deleteProject({
      id: deleteTarget.id,
      confirmDelete: true,
    });
    setLoading(false);
    if (result.success) {
      setDeleteTarget(null);
      router.refresh();
    }
  }

  const columns: DataTableColumn<ProjectRow>[] = [
    {
      key: "title",
      header: "Title",
      sortable: true,
      sortValue: (r) => r.title,
      render: (r) => (
        <div>
          <p className="font-medium">{r.title}</p>
          <p className="text-xs text-taupe">{r.slug}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      sortValue: (r) => r.category,
      render: (r) => r.category,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "featured",
      header: "Featured",
      render: (r) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFeatured(r);
          }}
          disabled={loading}
          className={r.featured ? "text-gold" : "text-taupe/40"}
          aria-label={r.featured ? "Remove from featured" : "Mark as featured"}
        >
          <Star className="h-4 w-4" fill={r.featured ? "currentColor" : "none"} />
        </button>
      ),
    },
    {
      key: "updated",
      header: "Updated",
      sortable: true,
      sortValue: (r) => new Date(r.updatedAt),
      render: (r) => (
        <span className="text-xs text-taupe">
          {formatAdminDateShort(r.updatedAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <div className="flex gap-1">
          <Link href={`/admin/projects/${r.id}`}>
            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(r);
            }}
          >
            <Trash2 className="h-4 w-4 text-dusty-rose" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Projects</h1>
          <p className="mt-1 text-sm text-taupe">{projects.length} projects</p>
        </div>
        <Link href="/admin/projects/new">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            New project
          </Button>
        </Link>
      </div>

      <DataTable
        data={projects}
        columns={columns}
        keyExtractor={(r) => r.id}
        emptyMessage="No projects yet. Create your first project."
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete project"
        description={`Permanently delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
