import type { MediaImage } from "../../src/types";

function localImage(path: string, alt: string): MediaImage {
  return {
    url: path,
    publicId: path.replace(/^\//, "").replace(/\//g, "-"),
    alt,
  };
}

const SECTION = "comfort-solution";
const SECTION_ORDER = 5;
const YEAR = 2025;
const CLIENT = "Comfort Solution";
const BASE = "/images/portfolio/comfort-solution";

const items = [
  {
    num: "01",
    title: "Brand Identity",
    slug: "comfort-solution-01-brand-identity",
    file: "01-brand-identity.png",
    shortDescription:
      "Primary logo lockup for heating, air conditioning, and electrical services.",
    alt: "Comfort Solution brand identity and primary logo",
    displayOrder: 1,
  },
  {
    num: "02",
    title: "Business Card Design",
    slug: "comfort-solution-02-business-card-design",
    file: "02-business-card-design.png",
    shortDescription:
      "Front and back business card designs with QR code and contact details.",
    alt: "Comfort Solution business card design mockup",
    displayOrder: 2,
  },
  {
    num: "03",
    title: "Outdoor Advertising",
    slug: "comfort-solution-03-outdoor-advertising",
    file: "03-outdoor-advertising.png",
    shortDescription: "Billboard creative for city-scale outdoor advertising.",
    alt: "Comfort Solution outdoor billboard advertising mockup",
    displayOrder: 3,
  },
  {
    num: "04",
    title: "Website & Digital Experience",
    slug: "comfort-solution-04-website-digital-experience",
    file: "04-website-digital-experience.png",
    shortDescription:
      "Homepage website design with services, trust signals, and CTAs.",
    alt: "Comfort Solution website and digital experience design",
    displayOrder: 4,
  },
  {
    num: "05",
    title: "Stationery & Corporate Identity",
    slug: "comfort-solution-05-stationery-corporate-identity",
    file: "05-stationery-corporate-identity.png",
    shortDescription:
      "Letterhead, envelopes, business cards, pens, and compliment slips.",
    alt: "Comfort Solution stationery and corporate identity mockup",
    displayOrder: 5,
  },
  {
    num: "06",
    title: "Brochure Design",
    slug: "comfort-solution-06-brochure-design",
    file: "06-brochure-design.png",
    shortDescription:
      "Multi-panel brochure covering core services, trust, and offers.",
    alt: "Comfort Solution brochure design layout",
    displayOrder: 6,
  },
  {
    num: "07",
    title: "Social Media Marketing",
    slug: "comfort-solution-07-social-media-marketing",
    file: "07-social-media-marketing.png",
    shortDescription:
      "Instagram carousel — Home Comfort Masterclass tips series.",
    alt: "Comfort Solution social media marketing carousel mockup",
    displayOrder: 7,
  },
  {
    num: "08",
    title: "Print & Packaging Applications",
    slug: "comfort-solution-08-print-packaging-applications",
    file: "08-print-packaging-applications.png",
    shortDescription:
      "Shipping boxes, mailers, folders, apparel, and branded merchandise.",
    alt: "Comfort Solution print and packaging applications mockup",
    displayOrder: 8,
  },
] as const;

export const comfortSolutionPortfolioData = items.map((item) => {
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
      "Web Design",
      "Social Media Design",
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
      "Create a trustworthy home-services brand that unifies heating, cooling, and electrical under one clear, professional identity.",
    solution:
      "Developed a navy-and-orange logo system with service icons, consistent typography, and applied it across print, outdoor, web, social, and packaging touchpoints.",
    result: item.shortDescription,
    status: "published" as const,
    featured: false,
    displayOrder: item.displayOrder,
    portfolioSection: SECTION,
    sectionOrder: SECTION_ORDER,
    isSample: false,
  };
});
