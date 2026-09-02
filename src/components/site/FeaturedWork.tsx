import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { resolveProjectCoverImage } from "@/config/media";
import type { SerializedProject } from "@/lib/data";
import { getCategoryLabel } from "@/config/categories";
import { cn } from "@/lib/utils";

export interface FeaturedWorkProps {
  projects: SerializedProject[];
}

export function FeaturedWork({ projects }: FeaturedWorkProps) {
  return (
    <section className="section-padding">
      <div className="container-editorial">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-taupe">
              Selected Work
            </p>
            <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.5rem)] leading-tight text-ink">
              Featured projects
            </h2>
          </div>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink underline-gold"
          >
            View all work
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-taupe/30 bg-cream/40 px-8 py-16 text-center">
            <p className="font-display text-2xl text-ink">Portfolio coming soon</p>
            <p className="mt-3 text-sm text-soft-black/70">
              Featured projects will appear here once published from the admin
              portal.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-12">
            {projects.map((project, index) => {
              const coverImage = resolveProjectCoverImage(project);
              const spanClass =
                index % 5 === 0
                  ? "xl:col-span-7"
                  : index % 5 === 1
                    ? "xl:col-span-5"
                    : index % 5 === 2
                      ? "xl:col-span-5"
                      : index % 5 === 3
                        ? "xl:col-span-4"
                        : "xl:col-span-3";

              return (
                <article
                  key={project._id}
                  className={cn("group", spanClass)}
                >
                  <Link
                    href={`/work/${project.slug}`}
                    className="block overflow-hidden rounded-[1.75rem] bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <div
                      className="relative overflow-hidden"
                      style={{
                        aspectRatio: project.aspectRatio || "4/5",
                      }}
                    >
                      <Image
                        src={coverImage.url}
                        alt={coverImage.alt || project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
                      <div className="absolute inset-x-0 bottom-0 p-6 text-ivory">
                        <p className="text-xs uppercase tracking-[0.18em] text-pale-gold/90">
                          {getCategoryLabel(project.category)}
                        </p>
                        <h3 className="mt-2 font-display text-2xl leading-tight">
                          {project.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-ivory/80">
                          {project.shortDescription}
                        </p>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
