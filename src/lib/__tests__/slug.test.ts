import { describe, expect, it } from "vitest";
import {
  isSlugAvailable,
  resolveSlug,
  slugConflictMessage,
} from "@/lib/slug";
import { slugify } from "@/lib/utils";

describe("slugify", () => {
  it("creates URL-friendly slugs from titles", () => {
    expect(slugify("Logo & Brand Identity")).toBe("logo-and-brand-identity");
    expect(slugify("  Social Media  ")).toBe("social-media");
    expect(slugify("Custom Graphic!")).toBe("custom-graphic");
  });
});

describe("resolveSlug", () => {
  it("uses an explicit slug when provided", () => {
    expect(resolveSlug("Ignored Title", "custom-slug")).toBe("custom-slug");
  });

  it("derives a slug from the title when none is provided", () => {
    expect(resolveSlug("Northwind Coffee Mark")).toBe("northwind-coffee-mark");
  });
});

describe("slug uniqueness", () => {
  const takenSlugs = [
    "logo-brand-identity",
    "social-media",
    "bloom-botanicals-rebrand",
  ];

  it("reports conflicts for slugs already in use", () => {
    expect(isSlugAvailable("social-media", takenSlugs)).toBe(false);
    expect(slugConflictMessage("service")).toBe(
      "A service with this slug already exists.",
    );
  });

  it("allows a record to keep its current slug during updates", () => {
    expect(
      isSlugAvailable("social-media", takenSlugs, "social-media"),
    ).toBe(true);
  });

  it("allows new slugs that are not taken", () => {
    expect(isSlugAvailable("print-design", takenSlugs)).toBe(true);
  });

  it("prevents collisions when two titles slugify to the same value", () => {
    const firstSlug = resolveSlug("Brand Identity");
    const secondSlug = resolveSlug("Brand Identity");

    expect(firstSlug).toBe(secondSlug);
    expect(isSlugAvailable(secondSlug, [firstSlug])).toBe(false);
  });
});
