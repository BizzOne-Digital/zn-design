import type { MediaImage } from "../../src/types";

function localImage(path: string, alt: string): MediaImage {
  return {
    url: path,
    publicId: path.replace(/^\//, "").replace(/\//g, "-"),
    alt,
  };
}

const SECTION = "vector-graphics";
const SECTION_ORDER = 1;
const YEAR = 2025;

const items = [
  {
    num: "01",
    title: "Character Illustration",
    slug: "vector-graphics-01-character-illustration",
    file: "01-character-illustration-charmander.png",
    shortDescription: "Charmander-inspired character artwork.",
    alt: "Charmander-inspired character illustration",
    featured: false,
    displayOrder: 1,
  },
  {
    num: "02",
    title: "Character Pair Illustration",
    slug: "vector-graphics-02-character-pair-illustration",
    file: "02-character-pair-cafe.png",
    shortDescription: "Pikachu- and Eevee-inspired café scene.",
    alt: "Pikachu and Eevee inspired café scene",
    featured: false,
    displayOrder: 2,
  },
  {
    num: "03",
    title: "Animal Character Illustration",
    slug: "vector-graphics-03-animal-character-illustration",
    file: "03-animal-character-eevee.png",
    shortDescription: "Eevee-inspired smiling character.",
    alt: "Eevee-inspired smiling character illustration",
    featured: false,
    displayOrder: 3,
  },
  {
    num: "04",
    title: "Underwater Vector Scene",
    slug: "vector-graphics-04-underwater-vector-scene",
    file: "04-underwater-vector-scene.png",
    shortDescription: "Colorful fish and sea-turtle composition.",
    alt: "Underwater vector scene with fish and sea turtle",
    featured: false,
    displayOrder: 4,
  },
  {
    num: "05",
    title: "Character Illustration",
    slug: "vector-graphics-05-character-illustration-pikachu",
    file: "05-character-illustration-pikachu.png",
    shortDescription: "Pikachu-inspired playful character.",
    alt: "Pikachu-inspired playful character illustration",
    featured: false,
    displayOrder: 5,
  },
  {
    num: "06",
    title: "Original Character Illustration",
    slug: "vector-graphics-06-original-character-illustration",
    file: "06-original-character-ladybug.png",
    shortDescription: "Ladybug-inspired character and plant scene.",
    alt: "Ladybug-inspired character and plant scene",
    featured: false,
    displayOrder: 6,
  },
  {
    num: "07",
    title: "Vector Portrait",
    slug: "vector-graphics-07-vector-portrait",
    file: "07-vector-portrait-professional.png",
    shortDescription: "Professional illustrated portrait.",
    alt: "Professional illustrated vector portrait",
    featured: false,
    displayOrder: 7,
  },
  {
    num: "08",
    title: "Character Scene",
    slug: "vector-graphics-08-character-scene",
    file: "08-character-scene-squirtle.png",
    shortDescription: "Squirtle- and Charmander-inspired scene.",
    alt: "Squirtle-inspired character scene",
    featured: false,
    displayOrder: 8,
  },
  {
    num: "09",
    title: "Vector Portrait",
    slug: "vector-graphics-09-vector-portrait",
    file: "09-vector-portrait-south-asian.png",
    shortDescription: "Illustrated South Asian female portrait.",
    alt: "Illustrated South Asian female vector portrait",
    featured: false,
    displayOrder: 9,
  },
  {
    num: "10",
    title: "Character Pair Illustration",
    slug: "vector-graphics-10-character-pair-illustration",
    file: "10-character-pair-outdoor.png",
    shortDescription: "Pikachu- and Eevee-inspired outdoor composition.",
    alt: "Pikachu and Eevee inspired outdoor composition",
    featured: false,
    displayOrder: 10,
  },
  {
    num: "11",
    title: "Character Group Illustration",
    slug: "vector-graphics-11-character-group-illustration",
    file: "11-character-group-food-stand.png",
    shortDescription: "Pikachu- and Eevee-inspired food stand scene.",
    alt: "Pikachu and Eevee inspired food stand scene",
    featured: false,
    displayOrder: 11,
  },
  {
    num: "12",
    title: "Vector Portrait",
    slug: "vector-graphics-12-vector-portrait",
    file: "12-vector-portrait-male.png",
    shortDescription: "Stylized male character portrait.",
    alt: "Stylized male character vector portrait",
    featured: false,
    displayOrder: 12,
  },
] as const;

export const vectorGraphicsPortfolioData = items.map((item) => {
  const imagePath = `/images/portfolio/vector-graphics/${item.file}`;
  const coverImage = localImage(imagePath, item.alt);

  return {
    title: `${item.num} ${item.title}`,
    slug: item.slug,
    category: "Visual Design" as const,
    shortDescription: item.shortDescription,
    client: "ZN Design",
    year: YEAR,
    services: ["Vector Graphics", "Character Illustration", "Visual Design"],
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
      "Create a polished vector illustration with clear shapes, expressive character, and a cohesive color palette.",
    solution:
      "Developed the artwork in a bold vector style with intentional linework, flat color, and readable silhouette for digital display.",
    result: item.shortDescription,
    status: "published" as const,
    featured: item.featured,
    displayOrder: item.displayOrder,
    portfolioSection: SECTION,
    sectionOrder: SECTION_ORDER,
    isSample: false,
  };
});
