"use client";

import { createService, updateService } from "@/actions/admin/services";
import {
  FormField,
  inputClassName,
  textareaClassName,
} from "@/components/admin/FormField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/Button";
import { slugify } from "@/lib/utils";
import {
  createServiceSchema,
  type CreateServiceInput,
} from "@/lib/validations/admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";

export interface ServiceEditorProps {
  serviceId?: string;
  initialData?: Partial<CreateServiceInput>;
}

const defaultValues: CreateServiceInput = {
  title: "",
  slug: "",
  shortDescription: "",
  fullDescription: "",
  deliverables: [""],
  gallery: [],
  displayOrder: 0,
  active: true,
  featured: false,
};

export function ServiceEditor({ serviceId, initialData }: ServiceEditorProps) {
  const router = useRouter();
  const isNew = !serviceId;
  const [formError, setFormError] = useState<string | null>(null);
  const [deliverablesInput, setDeliverablesInput] = useState(
    (initialData?.deliverables ?? [""]).join("\n"),
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateServiceInput>({
    resolver: zodResolver(createServiceSchema) as Resolver<CreateServiceInput>,
    defaultValues: { ...defaultValues, ...initialData },
  });

  const title = watch("title");
  const featuredImage = watch("featuredImage");

  async function onSubmit(data: CreateServiceInput) {
    setFormError(null);

    const deliverables = deliverablesInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    if (deliverables.length === 0) {
      setFormError("At least one deliverable is required.");
      return;
    }

    const payload = {
      ...data,
      slug: data.slug || slugify(data.title),
      deliverables,
    };

    const result = isNew
      ? await createService(payload)
      : await updateService({ ...payload, id: serviceId });

    if (!result.success) {
      setFormError(result.error);
      return;
    }

    if (isNew && result.data?.id) {
      router.push(`/admin/services/${result.data.id}`);
    } else {
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/services">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold text-ink">
          {isNew ? "New service" : "Edit service"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {formError ? (
          <div className="rounded-lg border border-dusty-rose/30 bg-red-50 px-4 py-3 text-sm text-dusty-rose">
            {formError}
          </div>
        ) : null}

        <section className="rounded-xl border border-taupe/20 bg-white p-6 space-y-4">
          <FormField label="Title" required error={errors.title?.message}>
            <input {...register("title")} className={inputClassName} />
          </FormField>
          <FormField label="Slug" error={errors.slug?.message}>
            <input
              {...register("slug")}
              className={inputClassName}
              placeholder={title ? slugify(title) : ""}
            />
          </FormField>
          <FormField label="Short description" required error={errors.shortDescription?.message}>
            <textarea {...register("shortDescription")} className={textareaClassName} rows={2} />
          </FormField>
          <FormField label="Full description" required error={errors.fullDescription?.message}>
            <textarea {...register("fullDescription")} className={textareaClassName} rows={6} />
          </FormField>
          <FormField label="Deliverables (one per line)" required>
            <textarea
              value={deliverablesInput}
              onChange={(e) => setDeliverablesInput(e.target.value)}
              className={textareaClassName}
              rows={5}
            />
          </FormField>
          <FormField label="Process notes" error={errors.processNotes?.message}>
            <textarea {...register("processNotes")} className={textareaClassName} rows={3} />
          </FormField>
          <ImageUpload
            label="Featured image"
            value={featuredImage?.url ? featuredImage : null}
            onChange={(img) => setValue("featuredImage", img ?? undefined)}
            folder="zn-design/services"
          />
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("active")} className="rounded border-taupe/40 text-gold" />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("featured")} className="rounded border-taupe/40 text-gold" />
              Featured
            </label>
          </div>
          <FormField label="Display order">
            <input
              type="number"
              {...register("displayOrder", { valueAsNumber: true })}
              className={inputClassName}
            />
          </FormField>
        </section>

        <section className="rounded-xl border border-taupe/20 bg-white p-6 space-y-4">
          <h2 className="text-lg font-semibold text-ink">SEO</h2>
          <FormField label="SEO title" error={errors.seoTitle?.message}>
            <input {...register("seoTitle")} className={inputClassName} />
          </FormField>
          <FormField label="SEO description" error={errors.seoDescription?.message}>
            <textarea {...register("seoDescription")} className={textareaClassName} rows={2} />
          </FormField>
        </section>

        <div className="flex justify-end gap-3">
          <Link href="/admin/services">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" loading={isSubmitting}>
            {isNew ? "Create service" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
