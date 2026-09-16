import Image from "next/image";
import type { SerializedProject } from "@/lib/data";
import { getPortfolioSectionTitle } from "@/config/portfolio-sections";
import { ProjectCard } from "./ProjectCard";

export interface PortfolioSectionGroup {
  key: string;
  title: string;
  subtitle?: string;
  secondaryLogo?: {
    src: string;
    alt: string;
  };
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
      {sections.map((section) => {
        const heading =
          section.subtitle
            ? section.title
            : section.title || getPortfolioSectionTitle(section.key);

        return (
          <section key={section.key} aria-labelledby={`section-${section.key}`}>
            <header className="mb-8 sm:mb-10">
              <h2
                id={`section-${section.key}`}
                className="font-display text-[clamp(1.75rem,4vw,2.75rem)] uppercase tracking-[0.08em] text-ink"
              >
                {heading}
              </h2>
              {section.secondaryLogo ? (
                <div className="mt-6 max-w-md">
                  <Image
                    src={section.secondaryLogo.src}
                    alt={section.secondaryLogo.alt}
                    width={640}
                    height={800}
                    className="h-auto w-full max-w-[280px] rounded-xl sm:max-w-xs"
                    sizes="(max-width: 768px) 70vw, 320px"
                  />
                </div>
              ) : null}
              {section.subtitle ? (
                <p
                  className={
                    section.secondaryLogo
                      ? "mt-5 font-display text-[clamp(1.25rem,3vw,1.75rem)] uppercase tracking-[0.1em] text-ink/85"
                      : "mt-3 font-display text-[clamp(1.25rem,3vw,1.75rem)] uppercase tracking-[0.1em] text-ink/85"
                  }
                >
                  {section.subtitle}
                </p>
              ) : null}
            </header>
            <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:gap-10">
              {section.projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  variant="portfolio"
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
