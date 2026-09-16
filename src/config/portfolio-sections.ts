export interface PortfolioSectionConfig {
  key: string;
  title: string;
  order: number;
  subtitle?: string;
  secondaryLogo?: {
    src: string;
    alt: string;
  };
}

export const PORTFOLIO_SECTIONS: PortfolioSectionConfig[] = [
  {
    key: "vector-graphics",
    title: "VECTOR GRAPHICS",
    order: 1,
  },
  {
    key: "branding-website-asset-package",
    title: "BRANDING & WEBSITE ASSET PACKAGE",
    order: 2,
  },
  {
    key: "serendip-brand-packaging-collection",
    title: "SERENDIP TEA CO.",
    subtitle: "BRAND & PACKAGING COLLECTION",
    secondaryLogo: {
      src: "/images/portfolio/serendip-tea-co/secondary-logo.png",
      alt: "Serendip Tea Co. secondary logo",
    },
    order: 3,
  },
  {
    key: "serendip-tea-co-brand-assets",
    title: "SERENDIP TEA CO.",
    subtitle: "BRAND & DIGITAL ASSETS",
    secondaryLogo: {
      src: "/images/portfolio/serendip-tea-co/secondary-logo.png",
      alt: "Serendip Tea Co. secondary logo",
    },
    order: 4,
  },
  {
    key: "comfort-solution",
    title: "COMFORT SOLUTION",
    order: 5,
  },
  {
    key: "asian-food",
    title: "ASIAN FOOD",
    order: 6,
  },
  {
    key: "brisa-cafe",
    title: "BRISA CAFE",
    order: 7,
  },
];

export function getPortfolioSectionTitle(key: string): string {
  const section = PORTFOLIO_SECTIONS.find((item) => item.key === key);
  if (!section) return key;
  if (section.subtitle) {
    return `${section.title} — ${section.subtitle}`;
  }
  return section.title;
}

export function getPortfolioSectionConfig(key: string): PortfolioSectionConfig | undefined {
  return PORTFOLIO_SECTIONS.find((section) => section.key === key);
}
