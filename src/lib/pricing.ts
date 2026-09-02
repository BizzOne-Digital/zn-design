export interface PackagePriceInput {
  priceLabel?: string | null;
  priceAmount?: number | null;
  currency?: string;
}

export const DEFAULT_PRICE_LABEL = "Custom Quote";

export function formatPackagePrice(input: PackagePriceInput): string {
  const label = input.priceLabel?.trim();
  if (label) {
    return label;
  }

  if (hasNumericPrice(input)) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: input.currency ?? "USD",
      maximumFractionDigits: 0,
    }).format(input.priceAmount as number);
  }

  return DEFAULT_PRICE_LABEL;
}

export function hasNumericPrice(input: PackagePriceInput): boolean {
  return (
    input.priceAmount != null &&
    Number.isFinite(input.priceAmount) &&
    input.priceAmount >= 0
  );
}

export function shouldShowCustomQuote(input: PackagePriceInput): boolean {
  return !hasNumericPrice(input);
}
