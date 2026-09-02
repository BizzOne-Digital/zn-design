import { PROJECT_CATEGORIES, type ProjectCategory } from "@/types";

export interface ProjectCategoryOption {
  value: ProjectCategory;
  label: string;
  description: string;
}

export const projectCategories: ProjectCategoryOption[] = [
  {
    value: "Branding",
    label: "Branding",
    description: "Complete brand identity systems and visual language",
  },
  {
    value: "Logo Design",
    label: "Logo Design",
    description: "Distinctive logos and mark systems",
  },
  {
    value: "Social Media",
    label: "Social Media",
    description: "Scroll-stopping content and campaign visuals",
  },
  {
    value: "Print",
    label: "Print",
    description: "Business cards, brochures, flyers, and print collateral",
  },
  {
    value: "Packaging",
    label: "Packaging",
    description: "Product packaging and label design",
  },
  {
    value: "Banners",
    label: "Banners",
    description: "Event banners, signage, and large-format graphics",
  },
  {
    value: "Visual Design",
    label: "Visual Design",
    description: "General visual design and creative assets",
  },
  {
    value: "Custom",
    label: "Custom",
    description: "Tailored creative projects outside standard categories",
  },
];

export const projectCategoryValues = PROJECT_CATEGORIES;

export function getCategoryLabel(category: ProjectCategory): string {
  return (
    projectCategories.find((item) => item.value === category)?.label ??
    category
  );
}

export function isValidProjectCategory(
  value: string,
): value is ProjectCategory {
  return PROJECT_CATEGORIES.includes(value as ProjectCategory);
}
