import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { resolveProjectCoverImage } from "@/config/media";
import type { SerializedProject } from "@/lib/data";
import { getCategoryLabel } from "@/config/categories";
import { Badge } from "@/components/ui/Badge";

export interface ProjectCardProps {
  project: SerializedProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const coverImage = resolveProjectCoverImage(project);

  return (
    <article className="group">
      <Link
        href={`/work/${project.slug}`}
        className="block overflow-hidden rounded-[1.5rem] bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: project.aspectRatio || "4/5" }}
        >
          <Image
            src={coverImage.url}
            alt={coverImage.alt || project.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </div>
        <div className="space-y-3 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{getCategoryLabel(project.category)}</Badge>
            {project.year ? (
              <span className="text-xs uppercase tracking-[0.14em] text-taupe">
                {project.year}
              </span>
            ) : null}
          </div>
          <h3 className="font-display text-2xl leading-tight text-ink transition-colors group-hover:text-gold">
            {project.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-soft-black/75">
            {project.shortDescription}
          </p>
          {project.services.length > 0 ? (
            <p className="text-xs uppercase tracking-[0.12em] text-taupe">
              {project.services.slice(0, 3).join(" · ")}
            </p>
          ) : null}
          <p className="inline-flex items-center gap-1.5 pt-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink group-hover:text-gold">
            View Project
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </p>
        </div>
      </Link>
    </article>
  );
}
