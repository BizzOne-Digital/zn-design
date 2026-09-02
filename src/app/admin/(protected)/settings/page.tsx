import { getSiteSettings } from "@/actions/admin/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";
import type { SiteSettingsInput } from "@/lib/validations/admin";
import type { MediaImage } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | ZN Design Admin",
  robots: { index: false, follow: false },
};

function serializeSettings(data: Record<string, unknown>): SiteSettingsInput {
  return {
    businessName: String(data.businessName ?? ""),
    contactPerson: String(data.contactPerson ?? ""),
    email: String(data.email ?? ""),
    phone: String(data.phone ?? ""),
    phoneLink: String(data.phoneLink ?? ""),
    address: data.address ? String(data.address) : undefined,
    socialLinks: (data.socialLinks as SiteSettingsInput["socialLinks"]) ?? {},
    heroEyebrow: data.heroEyebrow ? String(data.heroEyebrow) : undefined,
    heroHeadline: data.heroHeadline ? String(data.heroHeadline) : undefined,
    heroSupport: data.heroSupport ? String(data.heroSupport) : undefined,
    heroCtaPrimary: data.heroCtaPrimary
      ? String(data.heroCtaPrimary)
      : undefined,
    heroCtaSecondary: data.heroCtaSecondary
      ? String(data.heroCtaSecondary)
      : undefined,
    aboutText: data.aboutText ? String(data.aboutText) : undefined,
    introOfferText: data.introOfferText
      ? String(data.introOfferText)
      : undefined,
    bookingTimezone: String(data.bookingTimezone ?? "America/New_York"),
    notificationEmail: String(data.notificationEmail ?? data.email ?? ""),
    footerText: data.footerText ? String(data.footerText) : undefined,
    seoDefaults: (data.seoDefaults as SiteSettingsInput["seoDefaults"]) ?? {},
    logo: data.logo as MediaImage | undefined,
    favicon: data.favicon as MediaImage | undefined,
    ogImage: data.ogImage as MediaImage | undefined,
    maintenanceBanner: (data.maintenanceBanner as SiteSettingsInput["maintenanceBanner"]) ?? {
      enabled: false,
    },
    privacyContent: data.privacyContent
      ? String(data.privacyContent)
      : undefined,
    termsContent: data.termsContent ? String(data.termsContent) : undefined,
    aboutImage: data.aboutImage as MediaImage | undefined,
  };
}

export default async function SettingsPage() {
  const result = await getSiteSettings();

  if (!result.success) {
    return (
      <div className="rounded-xl border border-dusty-rose/30 bg-red-50 px-6 py-8 text-sm text-dusty-rose">
        {result.error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Site settings</h1>
        <p className="mt-1 text-sm text-taupe">
          Manage business details, content, images, and maintenance banner.
        </p>
      </div>
      <SettingsForm initialData={serializeSettings(result.data)} />
    </div>
  );
}
