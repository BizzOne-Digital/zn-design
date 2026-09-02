"use client";

import {
  createTestimonial,
  deleteTestimonial,
  updateTestimonial,
} from "@/actions/admin/testimonials";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  FormField,
  inputClassName,
  textareaClassName,
} from "@/components/admin/FormField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/Button";
import {
  createTestimonialSchema,
  type CreateTestimonialInput,
} from "@/lib/validations/admin";
import type { MediaImage } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";

export interface TestimonialRow {
  id: string;
  clientName: string;
  businessRole?: string;
  quote: string;
  clientImage?: MediaImage;
  showRating: boolean;
  rating?: number;
  featured: boolean;
  published: boolean;
  displayOrder: number;
}

export interface TestimonialsManagerProps {
  testimonials: TestimonialRow[];
}

export function TestimonialsManager({
  testimonials,
}: TestimonialsManagerProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<TestimonialRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TestimonialRow | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTestimonialInput>({
    resolver: zodResolver(createTestimonialSchema) as Resolver<CreateTestimonialInput>,
    defaultValues: {
      clientName: "",
      quote: "",
      showRating: false,
      featured: false,
      published: false,
      displayOrder: 0,
      isSample: false,
    },
  });

  const clientImage = watch("clientImage");
  const showRating = watch("showRating");

  function openCreate() {
    reset({
      clientName: "",
      quote: "",
      showRating: false,
      featured: false,
      published: false,
      displayOrder: testimonials.length,
      isSample: false,
    });
    setEditing(null);
    setCreating(true);
  }

  function openEdit(t: TestimonialRow) {
    reset({
      clientName: t.clientName,
      businessRole: t.businessRole,
      quote: t.quote,
      clientImage: t.clientImage,
      showRating: t.showRating,
      rating: t.rating,
      featured: t.featured,
      published: t.published,
      displayOrder: t.displayOrder,
    });
    setCreating(false);
    setEditing(t);
  }

  async function onSubmit(data: CreateTestimonialInput) {
    const result = editing
      ? await updateTestimonial({ ...data, id: editing.id })
      : await createTestimonial(data);

    if (result.success) {
      setCreating(false);
      setEditing(null);
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setLoading(true);
    const result = await deleteTestimonial({
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
          <h1 className="text-2xl font-semibold text-ink">Testimonials</h1>
          <p className="mt-1 text-sm text-taupe">
            {testimonials.length} testimonials
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New testimonial
        </Button>
      </div>

      {showForm ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-xl border border-taupe/20 bg-white p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {editing ? "Edit testimonial" : "New testimonial"}
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
            <FormField label="Client name" required error={errors.clientName?.message}>
              <input {...register("clientName")} className={inputClassName} />
            </FormField>
            <FormField label="Business / role" error={errors.businessRole?.message}>
              <input {...register("businessRole")} className={inputClassName} />
            </FormField>
          </div>
          <FormField label="Quote" required error={errors.quote?.message}>
            <textarea {...register("quote")} className={textareaClassName} rows={4} />
          </FormField>
          <ImageUpload
            label="Client image"
            value={clientImage?.url ? clientImage : null}
            onChange={(img) => setValue("clientImage", img ?? undefined)}
            folder="zn-design/testimonials"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              {...register("showRating")}
              className="rounded border-taupe/40 text-gold"
            />
            Show rating
          </label>
          {showRating ? (
            <FormField label="Rating (1-5)" error={errors.rating?.message}>
              <input
                type="number"
                min={1}
                max={5}
                {...register("rating", { valueAsNumber: true })}
                className={inputClassName}
              />
            </FormField>
          ) : null}
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("published")} className="rounded border-taupe/40 text-gold" />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("featured")} className="rounded border-taupe/40 text-gold" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("isSample")} className="rounded border-taupe/40 text-gold" />
              Sample
            </label>
          </div>
          <FormField label="Display order">
            <input
              type="number"
              {...register("displayOrder", { valueAsNumber: true })}
              className={inputClassName}
            />
          </FormField>
          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting}>
              {editing ? "Save changes" : "Create testimonial"}
            </Button>
          </div>
        </form>
      ) : null}

      <div className="space-y-3">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="flex items-start justify-between gap-4 rounded-xl border border-taupe/20 bg-white p-5"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-ink">{t.clientName}</h3>
                {t.businessRole ? (
                  <span className="text-sm text-taupe">· {t.businessRole}</span>
                ) : null}
                <StatusBadge status={t.published ? "published" : "draft"} />
                {t.featured ? <StatusBadge status="featured" /> : null}
              </div>
              <p className="mt-2 text-sm text-ink line-clamp-2">&ldquo;{t.quote}&rdquo;</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button variant="ghost" size="sm" onClick={() => openEdit(t)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(t)}>
                <Trash2 className="h-4 w-4 text-dusty-rose" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {testimonials.length === 0 && !showForm ? (
        <p className="py-8 text-center text-sm text-taupe">No testimonials yet.</p>
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete testimonial"
        description={`Delete testimonial from ${deleteTarget?.clientName}?`}
        confirmLabel="Delete"
        variant="danger"
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
