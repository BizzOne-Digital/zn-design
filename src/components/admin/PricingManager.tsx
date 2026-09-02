"use client";

import {
  createPricingPackage,
  deletePricingPackage,
  updatePricingPackage,
} from "@/actions/admin/pricing";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  FormField,
  inputClassName,
  textareaClassName,
} from "@/components/admin/FormField";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/Button";
import {
  createPricingPackageSchema,
  type CreatePricingPackageInput,
} from "@/lib/validations/admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";

export interface PricingRow {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  deliverables: string[];
  idealFor?: string;
  priceLabel?: string;
  featured: boolean;
  active: boolean;
  displayOrder: number;
}

export interface PricingManagerProps {
  packages: PricingRow[];
}

export function PricingManager({ packages }: PricingManagerProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<PricingRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PricingRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [deliverablesInput, setDeliverablesInput] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePricingPackageInput>({
    resolver: zodResolver(createPricingPackageSchema) as Resolver<CreatePricingPackageInput>,
    defaultValues: {
      title: "",
      description: "",
      deliverables: [],
      displayOrder: 0,
      active: true,
      featured: false,
    },
  });

  function openCreate() {
    reset({
      title: "",
      description: "",
      deliverables: [],
      displayOrder: packages.length,
      active: true,
      featured: false,
    });
    setDeliverablesInput("");
    setEditing(null);
    setCreating(true);
  }

  function openEdit(pkg: PricingRow) {
    reset({
      title: pkg.title,
      subtitle: pkg.subtitle,
      description: pkg.description ?? "",
      deliverables: pkg.deliverables ?? [],
      idealFor: pkg.idealFor,
      priceLabel: pkg.priceLabel,
      featured: pkg.featured,
      displayOrder: pkg.displayOrder,
      active: pkg.active,
    });
    setDeliverablesInput((pkg.deliverables ?? []).join("\n"));
    setCreating(false);
    setEditing(pkg);
  }

  async function onSubmit(data: CreatePricingPackageInput) {
    const deliverables = deliverablesInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    if (deliverables.length === 0) {
      return;
    }

    const payload = { ...data, deliverables };

    const result = editing
      ? await updatePricingPackage({ ...payload, id: editing.id })
      : await createPricingPackage(payload);

    if (result.success) {
      setCreating(false);
      setEditing(null);
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setLoading(true);
    const result = await deletePricingPackage({
      id: deleteTarget.id,
      confirmDelete: true,
    });
    setLoading(false);
    if (result.success) {
      setDeleteTarget(null);
      router.refresh();
    }
  }

  const showForm = creating || editing;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Pricing</h1>
          <p className="mt-1 text-sm text-taupe">{packages.length} packages</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New package
        </Button>
      </div>

      {showForm ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-xl border border-taupe/20 bg-white p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {editing ? "Edit package" : "New package"}
            </h2>
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
            >
              <X className="h-5 w-5 text-taupe" />
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Title" required error={errors.title?.message}>
              <input {...register("title")} className={inputClassName} />
            </FormField>
            <FormField label="Subtitle" error={errors.subtitle?.message}>
              <input {...register("subtitle")} className={inputClassName} />
            </FormField>
            <FormField label="Price label" error={errors.priceLabel?.message}>
              <input {...register("priceLabel")} className={inputClassName} placeholder="From $500" />
            </FormField>
            <FormField label="Display order">
              <input
                type="number"
                {...register("displayOrder", { valueAsNumber: true })}
                className={inputClassName}
              />
            </FormField>
          </div>
          <FormField label="Description" required error={errors.description?.message}>
            <textarea {...register("description")} className={textareaClassName} rows={3} />
          </FormField>
          <FormField label="Deliverables (one per line)" required>
            <textarea
              value={deliverablesInput}
              onChange={(e) => setDeliverablesInput(e.target.value)}
              className={textareaClassName}
              rows={4}
            />
          </FormField>
          <FormField label="Ideal for" error={errors.idealFor?.message}>
            <input {...register("idealFor")} className={inputClassName} />
          </FormField>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("active")} className="rounded border-taupe/40 text-gold" />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("featured")} className="rounded border-taupe/40 text-gold" />
              Featured
            </label>
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting}>
              {editing ? "Save changes" : "Create package"}
            </Button>
          </div>
        </form>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="rounded-xl border border-taupe/20 bg-white p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-ink">{pkg.title}</h3>
                {pkg.subtitle ? (
                  <p className="text-sm text-taupe">{pkg.subtitle}</p>
                ) : null}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEdit(pkg)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(pkg)}>
                  <Trash2 className="h-4 w-4 text-dusty-rose" />
                </Button>
              </div>
            </div>
            {pkg.priceLabel ? (
              <p className="mt-2 text-sm font-medium text-gold">{pkg.priceLabel}</p>
            ) : null}
            <div className="mt-3 flex gap-2">
              <StatusBadge status={pkg.active ? "active" : "inactive"} />
              {pkg.featured ? <StatusBadge status="featured" /> : null}
            </div>
          </div>
        ))}
      </div>

      {packages.length === 0 && !showForm ? (
        <p className="text-center text-sm text-taupe py-8">No pricing packages yet.</p>
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete package"
        description={`Delete "${deleteTarget?.title}"?`}
        confirmLabel="Delete"
        variant="danger"
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
