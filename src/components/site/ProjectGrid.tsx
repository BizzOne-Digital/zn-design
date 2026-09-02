"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { SerializedProject } from "@/lib/data";
import { projectCategories, isValidProjectCategory } from "@/config/categories";
import type { ProjectCategory } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "./ProjectCard";

export interface ProjectGridProps {
  initialProjects: SerializedProject[];
  initialTotal: number;
  initialHasMore: boolean;
  pageSize: number;
}

function buildCategoryHref(category: ProjectCategory | "All"): string {
  if (category === "All") return "/work";
  return `/work?category=${encodeURIComponent(category)}`;
}

export function ProjectGrid({
  initialProjects,
  initialTotal,
  initialHasMore,
  pageSize,
}: ProjectGridProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") ?? "All";
  const activeCategory: ProjectCategory | "All" =
    categoryParam === "All" || isValidProjectCategory(categoryParam)
      ? (categoryParam as ProjectCategory | "All")
      : "All";

  const [projects, setProjects] = useState(initialProjects);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: "All" as const, label: "All" },
    ...projectCategories,
  ];

  const loadMore = async () => {
    setLoading(true);
    try {
      const nextPage = page + 1;
      const params = new URLSearchParams();
      if (activeCategory !== "All") {
        params.set("category", activeCategory);
      }
      params.set("page", String(nextPage));
      params.set("limit", String(pageSize));

      const response = await fetch(`/api/projects?${params.toString()}`);
      if (!response.ok) return;

      const data = (await response.json()) as {
        projects: SerializedProject[];
        hasMore: boolean;
        total: number;
      };

      setProjects((current) => [...current, ...data.projects]);
      setPage(nextPage);
      setHasMore(data.hasMore);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="mb-10 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filter projects by category"
      >
        {categories.map((category) => {
          const value = category.value;
          const isActive = activeCategory === value;

          return (
            <Link
              key={value}
              href={buildCategoryHref(value)}
              role="tab"
              aria-selected={isActive}
              className={cn(
                "min-h-11 rounded-full border px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors sm:px-4 sm:text-xs sm:tracking-[0.14em]",
                isActive
                  ? "border-ink bg-ink text-ivory"
                  : "border-taupe/25 bg-ivory text-ink hover:border-gold hover:text-gold",
              )}
            >
              {category.label}
            </Link>
          );
        })}
      </div>

      {projects.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-taupe/30 bg-cream/40 px-8 py-16 text-center">
          <p className="font-display text-2xl text-ink">No projects found</p>
          <p className="mt-3 text-sm text-soft-black/70">
            {activeCategory === "All"
              ? "Published portfolio projects will appear here."
              : `No published projects in ${activeCategory} yet.`}
          </p>
        </div>
      ) : (
        <>
          <p className="mb-6 text-sm text-taupe">
            Showing {projects.length} of {total} projects
          </p>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </>
      )}

      {hasMore ? (
        <div className="mt-12 text-center">
          <Button
            type="button"
            variant="outline"
            size="lg"
            loading={loading}
            onClick={loadMore}
          >
            Load More Projects
          </Button>
        </div>
      ) : null}
    </div>
  );
}
