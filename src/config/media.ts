import type { MediaImage } from "@/types";

export const aboutHeroImage = "/images/about/about-hero.jpg";

export const manifestoBackgroundImage = "/images/manifesto-background.jpg";

const serviceImagePaths: Record<string, string> = {
  "logo-brand-identity": "/images/services/logo-brand-identity.jpg",
  "social-media": "/images/services/social-media.jpg",
  print: "/images/services/print.jpg",
  packaging: "/images/services/packaging.jpg",
  banner: "/images/services/banner.jpg",
  visual: "/images/services/visual.jpg",
  "custom-graphic": "/images/services/custom-graphic.jpg",
};

const portfolioImagePaths: Record<string, string> = {
  "bloom-botanicals-rebrand": "/images/portfolio/bloom-botanicals-rebrand.jpg",
  "northwind-coffee-mark": "/images/portfolio/northwind-coffee-mark.jpg",
  "luxe-skincare-launch-campaign":
    "/images/portfolio/luxe-skincare-launch-campaign.jpg",
  "artisan-bakery-menu-suite": "/images/portfolio/artisan-bakery-menu-suite.jpg",
  "clean-label-snack-packaging":
    "/images/portfolio/clean-label-snack-packaging.jpg",
  "tech-conference-hero-signage":
    "/images/portfolio/tech-conference-hero-signage.jpg",
  "editorial-type-collection": "/images/portfolio/editorial-type-collection.jpg",
};

function localImage(path: string, alt: string): MediaImage {
  return {
    url: path,
    publicId: path.replace(/^\//, "").replace(/\//g, "-"),
    alt,
  };
}

export function resolveServiceFeaturedImage(service: {
  slug: string;
  title: string;
  featuredImage?: MediaImage;
}): MediaImage | undefined {
  if (service.featuredImage?.url) {
    return service.featuredImage;
  }

  const path = serviceImagePaths[service.slug];
  if (!path) {
    return undefined;
  }

  return localImage(path, `${service.title} showcase`);
}

export function getServiceImagePaths() {
  return { ...serviceImagePaths };
}

export function resolveProjectCoverImage(project: {
  slug: string;
  title: string;
  coverImage: MediaImage;
}): MediaImage {
  if (project.coverImage?.url?.startsWith("/images/")) {
    return project.coverImage;
  }

  const path = portfolioImagePaths[project.slug];
  if (!path) {
    return project.coverImage;
  }

  return localImage(
    path,
    project.coverImage?.alt || `${project.title} cover`,
  );
}

export function getPortfolioImagePaths() {
  return { ...portfolioImagePaths };
}
