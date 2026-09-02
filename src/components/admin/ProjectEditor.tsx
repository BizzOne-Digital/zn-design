"use client";

import { createProject, updateProject } from "@/actions/admin/projects";
import { ContentBlockEditor } from "@/components/admin/ContentBlockEditor";
import {
  FormField,
  inputClassName,
  selectClassName,
  textareaClassName,
} from "@/components/admin/FormField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/Button";
import { projectCategories } from "@/config/categories";
import { slugify } from "@/lib/utils";
import {
  createProjectSchema,
  type CreateProjectInput,
} from "@/lib/validations/admin";
import type { ContentBlock } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";

export interface ProjectEditorProps {
  projectId?: string;
  initialData?: Partial<CreateProjectInput>;
}

const defaultValues: CreateProjectInput = {
  title: "",
  slug: "",
  category: "Branding",
  shortDescription: "",
  client: "",
  year: new Date().getFullYear(),
  services: [],
  coverImage: { url: "", publicId: "", alt: "" },
  gallery: [],
  contentBlocks: [],
  status: "draft",
  featured: false,
  displayOrder: 0,
  isSample: false,
};

export function ProjectEditor({ projectId, initialData }: ProjectEditorProps) {
  const router = useRouter();
  const isNew = !projectId;
  const [formError, setFormError] = useState<string | null>(null);
  const [servicesInput, setServicesInput] = useState(
    (initialData?.services ?? []).join(", "),
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema) as Resolver<CreateProjectInput>,
    defaultValues: { ...defaultValues, ...initialData },
  });

  const title = watch("title");
  const coverImage = watch("coverImage");
  const contentBlocks = watch("contentBlocks");
  const status = watch("status");

  async function onSubmit(data: CreateProjectInput) {
    setFormError(null);

    const payload = {
      ...data,
      slug: data.slug || slugify(data.title),
      services: servicesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const result = isNew
      ? await createProject(payload)
      : await updateProject({ ...payload, id: projectId });

    if (!result.success) {
      setFormError(result.error);
      return;
    }

    if (isNew && result.data?.id) {
      router.push(`/admin/projects/${result.data.id}`);
    } else {
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-ink">
            {isNew ? "New project" : "Edit project"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {formError ? (
          <div className="rounded-lg border border-dusty-rose/30 bg-red-50 px-4 py-3 text-sm text-dusty-rose">
            {formError}
          </div>
        ) : null}

        <section className="rounded-xl border border-taupe/20 bg-white p-6">
          <h2 className="text-lg font-semibold text-ink">Basic info</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <FormField label="Title" required error={errors.title?.message}>
              <input {...register("title")} className={inputClassName} />
            </FormField>
            <FormField label="Slug" error={errors.slug?.message} hint="Auto-generated from title if empty">
              <input
                {...register("slug")}
                className={inputClassName}
                placeholder={title ? slugify(title) : ""}
              />
            </FormField>
            <FormField label="Category" required error={errors.category?.message}>
              <select {...register("category")} className={selectClassName}>
                {projectCategories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Year" required error={errors.year?.message}>
              <input
                type="number"
                {...register("year", { valueAsNumber: true })}
                className={inputClassName}
              />
            </FormField>
            <FormField label="Client" error={errors.client?.message}>
              <input {...register("client")} className={inputClassName} />
            </FormField>
            <FormField label="Display order" error={errors.displayOrder?.message}>
              <input
                type="number"
                {...register("displayOrder", { valueAsNumber: true })}
                className={inputClassName}
              />
            </FormField>
            <FormField label="Short description" required className="md:col-span-2" error={errors.shortDescription?.message}>
              <textarea {...register("shortDescription")} className={textareaClassName} rows={2} />
            </FormField>
            <FormField label="Services (comma-separated)" className="md:col-span-2">
              <input
                value={servicesInput}
                onChange={(e) => setServicesInput(e.target.value)}
                className={inputClassName}
                placeholder="Branding, Logo Design"
              />
            </FormField>
          </div>
        </section>

        <section className="rounded-xl border border-taupe/20 bg-white p-6">
          <h2 className="text-lg font-semibold text-ink">Images</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <ImageUpload
              label="Cover image"
              required
              value={coverImage?.url ? coverImage : null}
              onChange={(img) => img && setValue("coverImage", img)}
              folder="zn-design/projects"
              error={errors.coverImage?.message}
            />
          </div>
        </section>

        <section className="rounded-xl border border-taupe/20 bg-white p-6">
          <h2 className="text-lg font-semibold text-ink">Case study</h2>
          <div className="mt-4 space-y-4">
            {(["challenge", "strategy", "creativeDirection", "solution", "result"] as const).map(
              (field) => (
                <FormField key={field} label={field.replace(/([A-Z])/g, " $1").trim()}>
                  <textarea
                    {...register(field)}
                    className={textareaClassName}
                    rows={3}
                  />
                </FormField>
              ),
            )}
          </div>
        </section>

        <section className="rounded-xl border border-taupe/20 bg-white p-6">
          <h2 className="text-lg font-semibold text-ink">Content blocks</h2>
          <div className="mt-4">
            <ContentBlockEditor
              value={(contentBlocks ?? []) as ContentBlock[]}
              onChange={(blocks) => setValue("contentBlocks", blocks)}
            />
          </div>
        </section>

        <section className="rounded-xl border border-taupe/20 bg-white p-6">
          <h2 className="text-lg font-semibold text-ink">Publishing</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <FormField label="Status" error={errors.status?.message}>
              <select {...register("status")} className={selectClassName}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </FormField>
            <FormField label="Aspect ratio" error={errors.aspectRatio?.message}>
              <input {...register("aspectRatio")} className={inputClassName} placeholder="16/9" />
            </FormField>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("featured")} className="rounded border-taupe/40 text-gold" />
              Featured project
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("isSample")} className="rounded border-taupe/40 text-gold" />
              Sample project
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-taupe/20 bg-white p-6">
          <h2 className="text-lg font-semibold text-ink">SEO</h2>
          <div className="mt-4 space-y-4">
            <FormField label="SEO title" error={errors.seoTitle?.message}>
              <input {...register("seoTitle")} className={inputClassName} />
            </FormField>
            <FormField label="SEO description" error={errors.seoDescription?.message}>
              <textarea {...register("seoDescription")} className={textareaClassName} rows={2} />
            </FormField>
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <Link href="/admin/projects">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" loading={isSubmitting}>
            {isNew ? "Create project" : `Save ${status === "published" ? "published" : "draft"}`}
          </Button>
        </div>
      </form>
    </div>
  );
}
