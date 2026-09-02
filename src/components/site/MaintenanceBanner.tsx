import type { MergedSiteSettings } from "@/lib/data";

export interface MaintenanceBannerProps {
  settings: MergedSiteSettings;
}

export function MaintenanceBanner({ settings }: MaintenanceBannerProps) {
  const banner = settings.maintenanceBanner;

  if (!banner?.enabled || !banner.content?.trim()) {
    return null;
  }

  return (
    <div
      role="status"
      className="border-b border-gold/30 bg-cream px-[var(--page-gutter)] py-3 text-center text-sm text-ink"
    >
      <p className="prose-safe">{banner.content}</p>
    </div>
  );
}
