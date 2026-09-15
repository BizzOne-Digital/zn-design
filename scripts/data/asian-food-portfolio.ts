import type { MediaImage } from "../../src/types";

function localImage(path: string, alt: string): MediaImage {
  return {
    url: path,
    publicId: path.replace(/^\//, "").replace(/\//g, "-"),
    alt,
  };
}

const SECTION = "asian-food";
const SECTION_ORDER = 6;
const YEAR = 2025;
const CLIENT = "Asian Food";
const BASE = "/images/portfolio/asian-food";

const items = [
  {
    num: "01",
    title: "Logo Design",
    slug: "asian-food-01-logo-design",
    file: "01-logo-design.png",
    shortDescription:
      "Primary logo with bowl mark, pagoda motif, and halal-focused tagline.",
    alt: "Asian Food logo design",
    displayOrder: 1,
  },
  {
    num: "02",
    title: "Menu Design",
    slug: "asian-food-02-menu-design",
    file: "02-menu-design.png",
    shortDescription:
      "Tri-fold menu layout with fry, grill, hot pot, drinks, and desserts.",
    alt: "Asian Food tri-fold menu design mockup",
    displayOrder: 2,
  },
  {
    num: "03",
    title: "Brochure Design — Menu Layout",
    slug: "asian-food-03-brochure-design-menu-layout",
    file: "03-brochure-design-menu-layout.png",
    shortDescription:
      "Brochure-style menu with USPs, dish highlights, and order information.",
    alt: "Asian Food brochure menu layout design",
    displayOrder: 3,
  },
  {
    num: "04",
    title: "Brand Applications & Packaging",
    slug: "asian-food-04-brand-applications-packaging",
    file: "04-brand-applications-packaging.png",
    shortDescription:
      "Aprons, cups, tableware, takeout packaging, and in-restaurant applications.",
    alt: "Asian Food brand applications and packaging mockup",
    displayOrder: 4,
  },
  {
    num: "05",
    title: "Stationery & Brand Identity",
    slug: "asian-food-05-stationery-brand-identity",
    file: "05-stationery-brand-identity.png",
    shortDescription:
      "Letterhead, envelope, business cards, notepad, coaster, and desk mat.",
    alt: "Asian Food stationery and brand identity mockup",
    displayOrder: 5,
  },
  {
    num: "06",
    title: "Promotional Flyer / Poster",
    slug: "asian-food-06-promotional-flyer-poster",
    file: "06-promotional-flyer-poster.png",
    shortDescription:
      "BBQ and hot pot promotional flyer with menu gallery and order CTA.",
    alt: "Asian Food promotional flyer and poster design",
    displayOrder: 6,
  },
] as const;

export const asianFoodPortfolioData = items.map((item) => {
  const imagePath = `${BASE}/${item.file}`;
  const coverImage = localImage(imagePath, item.alt);

  return {
    title: `${item.num} ${item.title}`,
    slug: item.slug,
    category: "Branding" as const,
    shortDescription: item.shortDescription,
    client: CLIENT,
    year: YEAR,
    services: [
      "Branding",
      "Print Design",
      "Packaging Design",
      "Visual Design",
    ],
    coverImage,
    gallery: [coverImage],
    contentBlocks: [
      {
        type: "full-width-image" as const,
        displayOrder: 0,
        image: coverImage,
        caption: item.shortDescription,
      },
    ],
    challenge:
      "Build a cohesive restaurant brand that feels authentic, premium, and clearly communicates halal positioning across menu and packaging.",
    solution:
      "Created a forest-green and cream identity with bamboo motifs, illustrated logo lockups, and consistent layouts for menus, stationery, packaging, and promotional print.",
    result: item.shortDescription,
    status: "published" as const,
    featured: false,
    displayOrder: item.displayOrder,
    portfolioSection: SECTION,
    sectionOrder: SECTION_ORDER,
    isSample: false,
  };
});
