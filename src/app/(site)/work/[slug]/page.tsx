import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";
import {
  getAdjacentProjects,
  getAllProjectSlugs,
  getProjectBySlug,
} from "@/lib/data";
import { getCategoryLabel } from "@/config/categories";
import { CaseStudyBlocks } from "@/components/site/CaseStudyBlocks";
import { ProjectNav } from "@/components/site/ProjectNav";
import { Badge } from "@/components/ui/Badge";
import { PageShell } from "@/components/site/PageShell";

export const dynamic = "force-dynamic";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return buildPageMetadata({
      title: "Project Not Found",
      description: "This project could not be found.",
      path: `/work/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: project.seoTitle || project.title,
    description: project.seoDescription || project.shortDescription,
    path: `/work/${project.slug}`,
    image: project.coverImage,
    type: "article",
  });
}

function NarrativeSection({
  title,
  content,
}: {
  title: string;
  content?: string;
}) {
  if (!content?.trim()) return null;

  return (
    <section className="space-y-4">
      <h2 className="font-display text-3xl text-ink">{title}</h2>
      <p className="prose-safe whitespace-pre-line text-base leading-relaxed text-soft-black/80">
        {content}
      </p>
    </section>
  );
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { prev, next } = await getAdjacentProjects(slug);

  return (
    <PageShell as="article">
        <header className="mb-12 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="gold">{getCategoryLabel(project.category)}</Badge>
            {project.year ? (
              <span className="text-xs uppercase tracking-[0.14em] text-taupe">
                {project.year}
              </span>
            ) : null}
            {project.isSample ? (
              <Badge variant="outline">Sample Project</Badge>
            ) : null}
          </div>
          <h1 className="mt-6 font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-tight text-ink">
            {project.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-soft-black/75">
            {project.shortDescription}
          </p>

          <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            {project.client ? (
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-taupe">
                  Client
                </dt>
                <dd className="mt-1 font-medium text-ink">{project.client}</dd>
              </div>
            ) : null}
            {project.services.length > 0 ? (
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase tracking-[0.14em] text-taupe">
                  Services
                </dt>
                <dd className="mt-1 text-ink">{project.services.join(", ")}</dd>
              </div>
            ) : null}
          </dl>
        </header>

        <div className="relative mb-16 aspect-[16/9] overflow-hidden rounded-[2rem] bg-cream">
          <Image
            src={project.coverImage.url}
            alt={project.coverImage.alt || project.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>

        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
          <NarrativeSection title="Challenge" content={project.challenge} />
          <NarrativeSection title="Strategy" content={project.strategy} />
          <NarrativeSection
            title="Creative Direction"
            content={project.creativeDirection}
          />
          <NarrativeSection title="Solution" content={project.solution} />
          <NarrativeSection title="Result" content={project.result} />
        </div>

        <div className="mt-20">
          <CaseStudyBlocks blocks={project.contentBlocks} />
        </div>

        <div className="mt-20">
          <ProjectNav prev={prev} next={next} />
        </div>

        <div className="mt-16 rounded-2xl border border-gold/25 bg-cream/50 px-5 py-8 text-center sm:rounded-[1.5rem] sm:px-8 sm:py-10">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">
            Start a similar project
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-soft-black/75">
            Ready to bring your vision to life? Book a consultation or send an
            inquiry to discuss your project.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            <Link
              href="/booking"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold uppercase tracking-[0.14em] text-ivory sm:w-auto"
            >
              Book a Consultation
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-ink/20 px-6 text-sm font-semibold uppercase tracking-[0.14em] text-ink sm:w-auto"
            >
              Contact ZN Design
            </Link>
          </div>
        </div>
    </PageShell>
  );
}
