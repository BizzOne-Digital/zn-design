import type { MediaImage } from "../../src/types";

function localImage(path: string, alt: string): MediaImage {
  return {
    url: path,
    publicId: path.replace(/^\//, "").replace(/\//g, "-"),
    alt,
  };
}

const SECTION = "brisa-cafe";
const SECTION_ORDER = 7;
const YEAR = 2025;
const CLIENT = "Brisa Cafe";
const BASE = "/images/portfolio/brisa-cafe";

const items = [
  {
    num: "01",
    title: "Cafe Table & Dining Brand Applications",
    slug: "brisa-cafe-01-cafe-table-dining-brand-applications",
    file: "01-cafe-table-dining-brand-applications.png",
    shortDescription:
      "Mugs, coasters, napkins, table signage, and dining touchpoints.",
    alt: "Brisa Cafe table and dining brand applications mockup",
    displayOrder: 1,
  },
  {
    num: "02",
    title: "Social Media Giveaway Design",
    slug: "brisa-cafe-02-social-media-giveaway-design",
    file: "02-social-media-giveaway-design.png",
    shortDescription:
      "Giveaway post creative with product bundle and entry instructions.",
    alt: "Brisa Cafe social media giveaway design",
    displayOrder: 2,
  },
  {
    num: "03",
    title: "Environmental Signage",
    slug: "brisa-cafe-03-environmental-signage",
    file: "03-environmental-signage.png",
    shortDescription:
      "Wooden counter sign — Good Coffee, Better Days, Brisa Cafe.",
    alt: "Brisa Cafe environmental signage mockup",
    displayOrder: 3,
  },
  {
    num: "04",
    title: "Cafe Interior & Brand Atmosphere",
    slug: "brisa-cafe-04-cafe-interior-brand-atmosphere",
    file: "04-cafe-interior-brand-atmosphere.png",
    shortDescription:
      "Interior wall branding and warm, natural cafe atmosphere styling.",
    alt: "Brisa Cafe interior and brand atmosphere",
    displayOrder: 4,
  },
  {
    num: "05",
    title: "Instagram Carousel",
    slug: "brisa-cafe-05-instagram-carousel",
    file: "05-instagram-carousel.png",
    shortDescription:
      "Three-slide carousel — discover, brew story, and visit & connect.",
    alt: "Brisa Cafe Instagram carousel design",
    displayOrder: 5,
  },
  {
    num: "06",
    title: "Menu Brochure",
    slug: "brisa-cafe-06-menu-brochure",
    file: "06-menu-brochure.png",
    shortDescription:
      "Tri-fold menu brochure with gold foil branding and menu sections.",
    alt: "Brisa Cafe menu brochure design mockup",
    displayOrder: 6,
  },
  {
    num: "07",
    title: "Primary Logo Design",
    slug: "brisa-cafe-07-primary-logo-design",
    file: "07-primary-logo-design.png",
    shortDescription:
      "Primary logo with cup mark, botanical branch, and Sip. Relax. Enjoy.",
    alt: "Brisa Cafe primary logo design",
    displayOrder: 7,
  },
] as const;

export const brisaCafePortfolioData = items.map((item) => {
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
      "Environmental Design",
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
      "Shape a cozy, premium cafe brand that feels natural and consistent from logo to in-store experience and social content.",
    solution:
      "Developed earthy cream-and-sage identity with script wordmark, botanical cup icon, and applied it across dining, signage, interiors, menus, and Instagram.",
    result: item.shortDescription,
    status: "published" as const,
    featured: false,
    displayOrder: item.displayOrder,
    portfolioSection: SECTION,
    sectionOrder: SECTION_ORDER,
    isSample: false,
  };
});
