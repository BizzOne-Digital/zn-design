import { slugify } from "@/lib/utils";

export function resolveSlug(title: string, explicitSlug?: string): string {
  const trimmed = explicitSlug?.trim();
  if (trimmed) {
    return trimmed;
  }

  return slugify(title);
}

export function isSlugAvailable(
  slug: string,
  takenSlugs: string[],
  currentSlug?: string,
): boolean {
  if (currentSlug && slug === currentSlug) {
    return true;
  }

  return !takenSlugs.includes(slug);
}

export function slugConflictMessage(entityLabel: string): string {
  return `A ${entityLabel} with this slug already exists.`;
}
