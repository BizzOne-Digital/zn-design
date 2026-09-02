"use client";

import { deleteService, updateService } from "@/actions/admin/services";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface ServiceRow {
  id: string;
  title: string;
  slug: string;
  active: boolean;
  featured: boolean;
  displayOrder: number;
}

export interface ServicesManagerProps {
  services: ServiceRow[];
}

export function ServicesManager({ services }: ServicesManagerProps) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<ServiceRow | null>(null);
  const [loading, setLoading] = useState(false);

  async function toggleFeatured(service: ServiceRow) {
    setLoading(true);
    await updateService({ id: service.id, featured: !service.featured });
    setLoading(false);
    router.refresh();
  }

  async function toggleActive(service: ServiceRow) {
    setLoading(true);
    await updateService({ id: service.id, active: !service.active });
    setLoading(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setLoading(true);
    const result = await deleteService({
      id: deleteTarget.id,
      confirmDelete: true,
    });
    setLoading(false);
    if (result.success) {
      setDeleteTarget(null);
      router.refresh();
    }
  }

  const columns: DataTableColumn<ServiceRow>[] = [
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
      key: "active",
      header: "Status",
      render: (r) => (
        <button type="button" onClick={() => toggleActive(r)} disabled={loading}>
          <StatusBadge status={r.active ? "active" : "inactive"} />
        </button>
      ),
    },
    {
      key: "featured",
      header: "Featured",
      render: (r) => (
        <button
          type="button"
          onClick={() => toggleFeatured(r)}
          disabled={loading}
          className={r.featured ? "text-gold" : "text-taupe/40"}
        >
          <Star className="h-4 w-4" fill={r.featured ? "currentColor" : "none"} />
        </button>
      ),
    },
    {
      key: "order",
      header: "Order",
      sortable: true,
      sortValue: (r) => r.displayOrder,
      render: (r) => r.displayOrder,
    },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <div className="flex gap-1">
          <Link href={`/admin/services/${r.id}`}>
            <Button variant="ghost" size="sm">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(r)}>
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
          <h1 className="text-2xl font-semibold text-ink">Services</h1>
          <p className="mt-1 text-sm text-taupe">{services.length} services</p>
        </div>
        <Link href="/admin/services/new">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            New service
          </Button>
        </Link>
      </div>

      <DataTable
        data={services}
        columns={columns}
        keyExtractor={(r) => r.id}
        emptyMessage="No services yet."
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete service"
        description={`Permanently delete "${deleteTarget?.title}"?`}
        confirmLabel="Delete"
        variant="danger"
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
