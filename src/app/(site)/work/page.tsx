import { Suspense } from "react";
import { buildPageMetadata } from "@/lib/seo";
import { getPublishedProjects } from "@/lib/data";
import { ProjectGrid } from "@/components/site/ProjectGrid";
import { PageShell } from "@/components/site/PageShell";
import { isValidProjectCategory } from "@/config/categories";
import type { ProjectCategory } from "@/types";

export const metadata = buildPageMetadata({
  title: "Portfolio",
  description:
    "Explore the ZN Design portfolio — branding, logo design, social media, print, packaging, and visual design projects.",
  path: "/work",
});

const PAGE_SIZE = 12;

interface WorkPageProps {
  searchParams: Promise<{
    category?: string;
    page?: string;
  }>;
}

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const params = await searchParams;
  const categoryParam = params.category ?? "All";
  const category: ProjectCategory | "All" =
    categoryParam === "All" || isValidProjectCategory(categoryParam)
      ? (categoryParam as ProjectCategory | "All")
      : "All";

  const { projects, total, hasMore } = await getPublishedProjects({
    category,
    page: 1,
    limit: PAGE_SIZE,
  });

  return (
    <PageShell>
        <div className="mb-8 max-w-3xl sm:mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-taupe">
            Portfolio
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,5vw,4rem)] leading-tight text-ink">
            Selected portfolio & case studies
          </h1>
          <p className="mt-4 text-base leading-relaxed text-soft-black/75">
            A curated collection of branding, visual design, and creative
            projects crafted for clarity, distinction, and impact.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="rounded-3xl border border-taupe/15 bg-cream/40 px-8 py-16 text-center text-sm text-taupe">
              Loading portfolio…
            </div>
          }
        >
          <ProjectGrid
            key={category}
            initialProjects={projects}
            initialTotal={total}
            initialHasMore={hasMore}
            pageSize={PAGE_SIZE}
          />
        </Suspense>
    </PageShell>
  );
}
