import type { MediaImage } from "../../src/types";

function localImage(path: string, alt: string): MediaImage {
  return {
    url: path,
    publicId: path.replace(/^\//, "").replace(/\//g, "-"),
    alt,
  };
}

const CLIENT = "Serendip Tea Co.";
const YEAR = 2025;

type SerendipItem = {
  num: string;
  title: string;
  slug: string;
  file: string;
  shortDescription: string;
  alt: string;
  portfolioSection: string;
  sectionOrder: number;
  displayOrder: number;
  featured?: boolean;
  aspectRatio?: string;
};

const BASE_PACKAGING = "/images/portfolio/serendip-tea-co/packaging";
const BASE_BRAND = "/images/portfolio/serendip-tea-co/brand";

const items: SerendipItem[] = [
  {
    num: "01",
    title: "Lifestyle Brand Applications",
    slug: "serendip-tea-co-01-lifestyle-brand-applications",
    file: "01-lifestyle-brand-applications.png",
    shortDescription:
      "Lifestyle mockups including bag, cup, journal, and brand display card.",
    alt: "Serendip Tea Co. lifestyle brand applications mockup",
    portfolioSection: "serendip-brand-packaging-collection",
    sectionOrder: 3,
    displayOrder: 1,
    featured: false,
  },
  {
    num: "02",
    title: "Teabag Product Tag",
    slug: "serendip-tea-co-02-teabag-product-tag",
    file: "02-teabag-product-tag.png",
    shortDescription: "Pyramid teabag tag design with gold logo detailing.",
    alt: "Serendip Tea Co. teabag product tag design",
    portfolioSection: "serendip-brand-packaging-collection",
    sectionOrder: 3,
    displayOrder: 2,
    featured: false,
  },
  {
    num: "03",
    title: "Premium Packaging Collection",
    slug: "serendip-tea-co-03-premium-packaging-collection",
    file: "03-premium-packaging-collection.png",
    shortDescription:
      "Premium tea tin, box, and pouch packaging collection mockup.",
    alt: "Serendip Tea Co. premium packaging collection",
    portfolioSection: "serendip-brand-packaging-collection",
    sectionOrder: 3,
    displayOrder: 3,
    featured: false,
  },
  {
    num: "04",
    title: "Packaging Details",
    slug: "serendip-tea-co-04-packaging-details",
    file: "04-packaging-details.png",
    shortDescription:
      "Close-up packaging artwork with botanical illustrations and product labeling.",
    alt: "Serendip Tea Co. packaging details close-up",
    portfolioSection: "serendip-brand-packaging-collection",
    sectionOrder: 3,
    displayOrder: 4,
  },
  {
    num: "05",
    title: "Brand Message / Graphic",
    slug: "serendip-tea-co-05-brand-message-graphic",
    file: "05-brand-message-graphic.png",
    shortDescription: "Brand message graphic — Sri Lanka inspires every sip.",
    alt: "Serendip Tea Co. brand message graphic",
    portfolioSection: "serendip-tea-co-brand-assets",
    sectionOrder: 4,
    displayOrder: 5,
  },
  {
    num: "06",
    title: "Brand Hero Banner",
    slug: "serendip-tea-co-06-brand-hero-banner",
    file: "06-brand-hero-banner.png",
    shortDescription:
      "Hero banner creative with tea leaf framing and brand tagline.",
    alt: "Serendip Tea Co. brand hero banner",
    portfolioSection: "serendip-tea-co-brand-assets",
    sectionOrder: 4,
    displayOrder: 6,
  },
  {
    num: "07",
    title: "Website / E-Commerce Design",
    slug: "serendip-tea-co-07-website-ecommerce-design",
    file: "07-website-ecommerce-design.png",
    shortDescription: "Full website and e-commerce homepage design mockup.",
    alt: "Serendip Tea Co. website and e-commerce design",
    portfolioSection: "serendip-tea-co-brand-assets",
    sectionOrder: 4,
    displayOrder: 7,
  },
  {
    num: "08",
    title: "2027 Calendar Design",
    slug: "serendip-tea-co-08-2027-calendar-design",
    file: "08-2027-calendar-design.png",
    shortDescription: "2027 wall calendar design with monthly brand storytelling.",
    alt: "Serendip Tea Co. 2027 calendar design",
    portfolioSection: "serendip-tea-co-brand-assets",
    sectionOrder: 4,
    displayOrder: 8,
  },
  {
    num: "09",
    title: "Business Card Design",
    slug: "serendip-tea-co-09-business-card-design",
    file: "09-business-card-design.png",
    shortDescription: "Front and back business card design with contact details.",
    alt: "Serendip Tea Co. business card design",
    portfolioSection: "serendip-tea-co-brand-assets",
    sectionOrder: 4,
    displayOrder: 9,
  },
  {
    num: "10",
    title: "Brand Badge / Secondary Mark",
    slug: "serendip-tea-co-10-brand-badge-secondary-mark",
    file: "10-brand-badge-secondary-mark.png",
    shortDescription: "Circular secondary brand badge — Good Tea, Good Mood, Everyday.",
    alt: "Serendip Tea Co. brand badge secondary mark",
    portfolioSection: "serendip-tea-co-brand-assets",
    sectionOrder: 4,
    displayOrder: 10,
    featured: true,
    aspectRatio: "1/1",
  },
  {
    num: "11",
    title: "Primary Logo",
    slug: "serendip-tea-co-11-primary-logo",
    file: "11-primary-logo.png",
    shortDescription: "Primary logo lockup with cup mark and brand typography.",
    alt: "Serendip Tea Co. primary logo design",
    portfolioSection: "serendip-tea-co-brand-assets",
    sectionOrder: 4,
    displayOrder: 11,
  },
];

export const serendipTeaCoPortfolioData = items.map((item) => {
  const basePath = item.portfolioSection === "serendip-brand-packaging-collection"
    ? BASE_PACKAGING
    : BASE_BRAND;
  const imagePath = `${basePath}/${item.file}`;
  const coverImage = localImage(imagePath, item.alt);

  return {
    title: `${item.num} ${item.title}`,
    slug: item.slug,
    category: "Packaging" as const,
    shortDescription: item.shortDescription,
    client: CLIENT,
    year: YEAR,
    services: ["Branding", "Packaging Design", "Print Design", "Visual Design"],
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
      "Create a premium Ceylon tea brand identity that feels natural, elegant, and cohesive across packaging and digital touchpoints.",
    solution:
      "Developed forest-green and gold brand assets with botanical detailing, refined typography, and consistent logo applications across product and marketing materials.",
    result: item.shortDescription,
    status: "published" as const,
    featured: item.featured ?? false,
    ...(item.aspectRatio ? { aspectRatio: item.aspectRatio } : {}),
    displayOrder: item.displayOrder,
    portfolioSection: item.portfolioSection,
    sectionOrder: item.sectionOrder,
    isSample: false,
  };
});
