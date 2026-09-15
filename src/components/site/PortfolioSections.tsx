import type { SerializedProject } from "@/lib/data";
import { getPortfolioSectionTitle } from "@/config/portfolio-sections";
import { ProjectCard } from "./ProjectCard";

export interface PortfolioSectionGroup {
  key: string;
  title: string;
  order: number;
  projects: SerializedProject[];
}

export interface PortfolioSectionsProps {
  sections: PortfolioSectionGroup[];
}

export function PortfolioSections({ sections }: PortfolioSectionsProps) {
  if (sections.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-taupe/30 bg-cream/40 px-8 py-16 text-center">
        <p className="font-display text-2xl text-ink">Portfolio coming soon</p>
        <p className="mt-3 text-sm text-soft-black/70">
          New work will appear here as projects are published.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-20 sm:space-y-24">
      {sections.map((section) => (
        <section key={section.key} aria-labelledby={`section-${section.key}`}>
          <h2
            id={`section-${section.key}`}
            className="mb-8 font-display text-[clamp(1.75rem,4vw,2.75rem)] uppercase tracking-[0.08em] text-ink sm:mb-10"
          >
            {section.title || getPortfolioSectionTitle(section.key)}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {section.projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
