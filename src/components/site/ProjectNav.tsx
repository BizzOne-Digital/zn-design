import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { SerializedProject } from "@/lib/data";

export interface ProjectNavProps {
  prev: SerializedProject | null;
  next: SerializedProject | null;
}

export function ProjectNav({ prev, next }: ProjectNavProps) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Project navigation"
      className="grid gap-4 border-t border-taupe/15 pt-10 md:grid-cols-2"
    >
      {prev ? (
        <Link
          href={`/work/${prev.slug}`}
          className="group rounded-[1.25rem] border border-taupe/15 bg-cream/40 p-6 transition-colors hover:border-gold/40"
        >
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-taupe">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Previous
          </span>
          <p className="mt-3 font-display text-2xl text-ink group-hover:text-gold">
            {prev.title}
          </p>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/work/${next.slug}`}
          className="group rounded-[1.25rem] border border-taupe/15 bg-cream/40 p-6 text-right transition-colors hover:border-gold/40 md:ml-auto"
        >
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-taupe">
            Next
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
          <p className="mt-3 font-display text-2xl text-ink group-hover:text-gold">
            {next.title}
          </p>
        </Link>
      ) : null}
    </nav>
  );
}
