import type { MediaImage } from "../../src/types";

function localImage(path: string, alt: string): MediaImage {
  return {
    url: path,
    publicId: path.replace(/^\//, "").replace(/\//g, "-"),
    alt,
  };
}

const SECTION = "branding-website-asset-package";
const SECTION_ORDER = 2;
const YEAR = 2025;
const CLIENT = "Sierra Link Executive Transportation";
const BASE = "/images/portfolio/branding-sierra-link";

const items = [
  {
    num: "01",
    title: "Brochure Design",
    slug: "branding-sierra-link-01-brochure-design",
    file: "01-brochure-design.png",
    shortDescription: "Tri-fold brochure design for executive chauffeur services.",
    alt: "Sierra Link tri-fold brochure design mockup",
    displayOrder: 1,
  },
  {
    num: "02",
    title: "Billboard Advertising",
    slug: "branding-sierra-link-02-billboard-advertising",
    file: "02-billboard-advertising.png",
    shortDescription: "Large-format billboard creative for premium transportation.",
    alt: "Sierra Link billboard advertising mockup",
    displayOrder: 2,
  },
  {
    num: "03",
    title: "Business Card & Promotional Collateral",
    slug: "branding-sierra-link-03-business-card-promotional-collateral",
    file: "03-business-card-promotional-collateral.png",
    shortDescription: "Luxury business card suite and promotional brand collateral.",
    alt: "Sierra Link business cards and promotional collateral",
    displayOrder: 3,
  },
  {
    num: "04",
    title: "Instagram Carousel",
    slug: "branding-sierra-link-04-instagram-carousel",
    file: "04-instagram-carousel.png",
    shortDescription: "Social carousel templates for executive transportation marketing.",
    alt: "Sierra Link Instagram carousel design",
    displayOrder: 4,
  },
  {
    num: "05",
    title: "Chauffeur Uniform & Badge",
    slug: "branding-sierra-link-05-chauffeur-uniform-badge",
    file: "05-chauffeur-uniform-badge.png",
    shortDescription: "Branded chauffeur uniform, crest, and name badge system.",
    alt: "Sierra Link chauffeur uniform and badge branding",
    displayOrder: 5,
  },
  {
    num: "06",
    title: "Business Card — Contact Side",
    slug: "branding-sierra-link-06-business-card-contact-side",
    file: "06-business-card-contact-side.png",
    shortDescription: "Contact-side business card layout with service area details.",
    alt: "Sierra Link business card contact side design",
    displayOrder: 6,
  },
  {
    num: "07",
    title: "Digital Promotional Graphic",
    slug: "branding-sierra-link-07-digital-promotional-graphic",
    file: "07-digital-promotional-graphic.png",
    shortDescription: "Digital promo graphic highlighting premium ride experience.",
    alt: "Sierra Link digital promotional graphic",
    displayOrder: 7,
  },
  {
    num: "08",
    title: "Vehicle Branding",
    slug: "branding-sierra-link-08-vehicle-branding",
    file: "08-vehicle-branding.png",
    shortDescription: "Executive fleet vehicle wrap and logo application.",
    alt: "Sierra Link luxury vehicle branding mockup",
    displayOrder: 8,
  },
] as const;

export const brandingWebsiteAssetPackageData = items.map((item) => {
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
      "Build a cohesive luxury brand system for executive transportation across print, digital, uniform, and vehicle touchpoints.",
    solution:
      "Developed gold-and-black brand assets with consistent typography, crest identity, and polished layouts tailored to Sierra Link's premium positioning.",
    result: item.shortDescription,
    status: "published" as const,
    featured: false,
    displayOrder: item.displayOrder,
    portfolioSection: SECTION,
    sectionOrder: SECTION_ORDER,
    isSample: false,
  };
});
