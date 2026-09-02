import { describe, expect, it } from "vitest";
import {
  DEFAULT_PRICE_LABEL,
  formatPackagePrice,
  hasNumericPrice,
  shouldShowCustomQuote,
} from "@/lib/pricing";

describe("pricing display", () => {
  it("shows the price label when no numeric price is provided", () => {
    const display = formatPackagePrice({
      priceLabel: "Custom Quote",
    });

    expect(display).toBe("Custom Quote");
    expect(hasNumericPrice({ priceLabel: "Custom Quote" })).toBe(false);
    expect(shouldShowCustomQuote({ priceLabel: "Custom Quote" })).toBe(true);
  });

  it("prefers an explicit price label over numeric amounts", () => {
    const display = formatPackagePrice({
      priceLabel: "Starting at $500",
      priceAmount: 1200,
    });

    expect(display).toBe("Starting at $500");
  });

  it("formats numeric prices when no label is set", () => {
    const display = formatPackagePrice({
      priceAmount: 1500,
      currency: "USD",
    });

    expect(display).toBe("$1,500");
    expect(hasNumericPrice({ priceAmount: 1500 })).toBe(true);
    expect(shouldShowCustomQuote({ priceAmount: 1500 })).toBe(false);
  });

  it("falls back to Custom Quote when neither label nor amount exists", () => {
    const display = formatPackagePrice({});

    expect(display).toBe(DEFAULT_PRICE_LABEL);
    expect(shouldShowCustomQuote({})).toBe(true);
  });

  it("treats invalid numeric amounts as custom quote packages", () => {
    expect(formatPackagePrice({ priceAmount: Number.NaN })).toBe(
      DEFAULT_PRICE_LABEL,
    );
    expect(formatPackagePrice({ priceAmount: -100 })).toBe(DEFAULT_PRICE_LABEL);
    expect(hasNumericPrice({ priceAmount: Number.NaN })).toBe(false);
  });

  it("handles seeded packages that only expose a quote label", () => {
    const seededPackages = [
      { title: "Logo Essentials", priceLabel: "Custom Quote" },
      { title: "Brand Identity", priceLabel: "Custom Quote" },
      { title: "Custom Creative Support", priceLabel: "Custom Quote" },
    ];

    for (const pkg of seededPackages) {
      expect(formatPackagePrice(pkg)).toBe("Custom Quote");
      expect(shouldShowCustomQuote(pkg)).toBe(true);
    }
  });
});
