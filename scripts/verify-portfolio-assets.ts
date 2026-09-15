import fs from "fs";
import path from "path";
import { getPortfolioImagePaths } from "../src/config/media";
import { PORTFOLIO_SECTIONS } from "../src/config/portfolio-sections";

const root = process.cwd();

async function loadSeedProjects() {
  const modules = [
    "./data/vector-graphics-portfolio",
    "./data/branding-website-asset-package",
    "./data/serendip-tea-co-portfolio",
    "./data/comfort-solution-portfolio",
    "./data/asian-food-portfolio",
    "./data/brisa-cafe-portfolio",
  ];

  const projects: Array<{
    slug: string;
    portfolioSection: string;
    coverImage: { url: string };
  }> = [];

  for (const modPath of modules) {
    const mod = await import(modPath);
    const data = Object.values(mod).find((v) => Array.isArray(v)) as
      | typeof projects
      | undefined;
    if (!data) {
      throw new Error(`No portfolio array export in ${modPath}`);
    }
    projects.push(...data);
  }

  return projects;
}

function fileExists(publicUrl: string): boolean {
  const file = path.join(root, "public", publicUrl.replace(/^\//, ""));
  return fs.existsSync(file);
}

async function main() {
  const portfolioPaths = getPortfolioImagePaths();
  const sectionKeys = new Set(PORTFOLIO_SECTIONS.map((s) => s.key));
  const errors: string[] = [];

  for (const [slug, url] of Object.entries(portfolioPaths)) {
    if (!fileExists(url)) {
      errors.push(`Missing file for media fallback: ${slug} -> ${url}`);
    }
  }

  const projects = await loadSeedProjects();

  if (projects.length !== Object.keys(portfolioPaths).length) {
    errors.push(
      `Seed project count (${projects.length}) does not match media.ts entries (${Object.keys(portfolioPaths).length})`,
    );
  }

  const slugSet = new Set<string>();
  for (const project of projects) {
    if (slugSet.has(project.slug)) {
      errors.push(`Duplicate slug in seed data: ${project.slug}`);
    }
    slugSet.add(project.slug);

    if (!portfolioPaths[project.slug]) {
      errors.push(`Seed slug missing from media.ts: ${project.slug}`);
    }

    if (!sectionKeys.has(project.portfolioSection)) {
      errors.push(
        `Unknown portfolioSection "${project.portfolioSection}" on ${project.slug}`,
      );
    }

    const coverUrl = project.coverImage?.url;
    if (!coverUrl) {
      errors.push(`Missing coverImage.url on ${project.slug}`);
    } else if (!fileExists(coverUrl)) {
      errors.push(`Missing cover file for ${project.slug}: ${coverUrl}`);
    }

    const fallback = portfolioPaths[project.slug];
    if (fallback && coverUrl && fallback !== coverUrl) {
      errors.push(
        `Path mismatch for ${project.slug}: seed=${coverUrl} media=${fallback}`,
      );
    }
  }

  for (const slug of Object.keys(portfolioPaths)) {
    if (!slugSet.has(slug)) {
      errors.push(`media.ts slug not in seed data: ${slug}`);
    }
  }

  for (const section of PORTFOLIO_SECTIONS) {
    const count = projects.filter(
      (p) => p.portfolioSection === section.key,
    ).length;
    if (count === 0) {
      errors.push(`Section "${section.key}" has zero seed projects`);
    }
  }

  if (errors.length > 0) {
    console.error("Portfolio verification failed:\n");
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  console.log(
    `Portfolio OK: ${projects.length} projects, ${Object.keys(portfolioPaths).length} images, ${PORTFOLIO_SECTIONS.length} sections.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
