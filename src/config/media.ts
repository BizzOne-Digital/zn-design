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
  "vector-graphics-01-character-illustration":
    "/images/portfolio/vector-graphics/01-character-illustration-charmander.png",
  "vector-graphics-02-character-pair-illustration":
    "/images/portfolio/vector-graphics/02-character-pair-cafe.png",
  "vector-graphics-03-animal-character-illustration":
    "/images/portfolio/vector-graphics/03-animal-character-eevee.png",
  "vector-graphics-04-underwater-vector-scene":
    "/images/portfolio/vector-graphics/04-underwater-vector-scene.png",
  "vector-graphics-05-character-illustration-pikachu":
    "/images/portfolio/vector-graphics/05-character-illustration-pikachu.png",
  "vector-graphics-06-original-character-illustration":
    "/images/portfolio/vector-graphics/06-original-character-ladybug.png",
  "vector-graphics-07-vector-portrait":
    "/images/portfolio/vector-graphics/07-vector-portrait-professional.png",
  "vector-graphics-08-character-scene":
    "/images/portfolio/vector-graphics/08-character-scene-squirtle.png",
  "vector-graphics-09-vector-portrait":
    "/images/portfolio/vector-graphics/09-vector-portrait-south-asian.png",
  "vector-graphics-10-character-pair-illustration":
    "/images/portfolio/vector-graphics/10-character-pair-outdoor.png",
  "vector-graphics-11-character-group-illustration":
    "/images/portfolio/vector-graphics/11-character-group-food-stand.png",
  "vector-graphics-12-vector-portrait":
    "/images/portfolio/vector-graphics/12-vector-portrait-male.png",
  "branding-sierra-link-01-brochure-design":
    "/images/portfolio/branding-sierra-link/01-brochure-design.png",
  "branding-sierra-link-02-billboard-advertising":
    "/images/portfolio/branding-sierra-link/02-billboard-advertising.png",
  "branding-sierra-link-03-business-card-promotional-collateral":
    "/images/portfolio/branding-sierra-link/03-business-card-promotional-collateral.png",
  "branding-sierra-link-04-instagram-carousel":
    "/images/portfolio/branding-sierra-link/04-instagram-carousel.png",
  "branding-sierra-link-05-chauffeur-uniform-badge":
    "/images/portfolio/branding-sierra-link/05-chauffeur-uniform-badge.png",
  "branding-sierra-link-06-business-card-contact-side":
    "/images/portfolio/branding-sierra-link/06-business-card-contact-side.png",
  "branding-sierra-link-07-digital-promotional-graphic":
    "/images/portfolio/branding-sierra-link/07-digital-promotional-graphic.png",
  "branding-sierra-link-08-vehicle-branding":
    "/images/portfolio/branding-sierra-link/08-vehicle-branding.png",
  "serendip-tea-co-01-lifestyle-brand-applications":
    "/images/portfolio/serendip-tea-co/packaging/01-lifestyle-brand-applications.png",
  "serendip-tea-co-02-teabag-product-tag":
    "/images/portfolio/serendip-tea-co/packaging/02-teabag-product-tag.png",
  "serendip-tea-co-03-premium-packaging-collection":
    "/images/portfolio/serendip-tea-co/packaging/03-premium-packaging-collection.png",
  "serendip-tea-co-04-packaging-details":
    "/images/portfolio/serendip-tea-co/packaging/04-packaging-details.png",
  "serendip-tea-co-05-brand-message-graphic":
    "/images/portfolio/serendip-tea-co/brand/05-brand-message-graphic.png",
  "serendip-tea-co-06-brand-hero-banner":
    "/images/portfolio/serendip-tea-co/brand/06-brand-hero-banner.png",
  "serendip-tea-co-07-website-ecommerce-design":
    "/images/portfolio/serendip-tea-co/brand/07-website-ecommerce-design.png",
  "serendip-tea-co-08-2027-calendar-design":
    "/images/portfolio/serendip-tea-co/brand/08-2027-calendar-design.png",
  "serendip-tea-co-09-business-card-design":
    "/images/portfolio/serendip-tea-co/brand/09-business-card-design.png",
  "serendip-tea-co-10-brand-badge-secondary-mark":
    "/images/portfolio/serendip-tea-co/brand/10-brand-badge-secondary-mark.png",
  "serendip-tea-co-11-primary-logo":
    "/images/portfolio/serendip-tea-co/brand/11-primary-logo.png",
  "comfort-solution-01-brand-identity":
    "/images/portfolio/comfort-solution/01-brand-identity.png",
  "comfort-solution-02-business-card-design":
    "/images/portfolio/comfort-solution/02-business-card-design.png",
  "comfort-solution-03-outdoor-advertising":
    "/images/portfolio/comfort-solution/03-outdoor-advertising.png",
  "comfort-solution-04-website-digital-experience":
    "/images/portfolio/comfort-solution/04-website-digital-experience.png",
  "comfort-solution-05-stationery-corporate-identity":
    "/images/portfolio/comfort-solution/05-stationery-corporate-identity.png",
  "comfort-solution-06-brochure-design":
    "/images/portfolio/comfort-solution/06-brochure-design.png",
  "comfort-solution-07-social-media-marketing":
    "/images/portfolio/comfort-solution/07-social-media-marketing.png",
  "comfort-solution-08-print-packaging-applications":
    "/images/portfolio/comfort-solution/08-print-packaging-applications.png",
  "asian-food-01-logo-design":
    "/images/portfolio/asian-food/01-logo-design.png",
  "asian-food-02-menu-design":
    "/images/portfolio/asian-food/02-menu-design.png",
  "asian-food-03-brochure-design-menu-layout":
    "/images/portfolio/asian-food/03-brochure-design-menu-layout.png",
  "asian-food-04-brand-applications-packaging":
    "/images/portfolio/asian-food/04-brand-applications-packaging.png",
  "asian-food-05-stationery-brand-identity":
    "/images/portfolio/asian-food/05-stationery-brand-identity.png",
  "asian-food-06-promotional-flyer-poster":
    "/images/portfolio/asian-food/06-promotional-flyer-poster.png",
  "brisa-cafe-01-cafe-table-dining-brand-applications":
    "/images/portfolio/brisa-cafe/01-cafe-table-dining-brand-applications.png",
  "brisa-cafe-02-social-media-giveaway-design":
    "/images/portfolio/brisa-cafe/02-social-media-giveaway-design.png",
  "brisa-cafe-03-environmental-signage":
    "/images/portfolio/brisa-cafe/03-environmental-signage.png",
  "brisa-cafe-04-cafe-interior-brand-atmosphere":
    "/images/portfolio/brisa-cafe/04-cafe-interior-brand-atmosphere.png",
  "brisa-cafe-05-instagram-carousel":
    "/images/portfolio/brisa-cafe/05-instagram-carousel.png",
  "brisa-cafe-06-menu-brochure":
    "/images/portfolio/brisa-cafe/06-menu-brochure.png",
  "brisa-cafe-07-primary-logo-design":
    "/images/portfolio/brisa-cafe/07-primary-logo-design.png",
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
