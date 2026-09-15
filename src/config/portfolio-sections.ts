export interface PortfolioSectionConfig {
  key: string;
  title: string;
  order: number;
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
    title: "SERENDIP TEA CO. — BRAND & PACKAGING COLLECTION",
    order: 3,
  },
  {
    key: "serendip-tea-co-brand-assets",
    title: "SERENDIP TEA CO. — BRAND & DIGITAL ASSETS",
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
  return (
    PORTFOLIO_SECTIONS.find((section) => section.key === key)?.title ?? key
  );
}
