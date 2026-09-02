"use server";

import type { ActionResponse } from "@/types/actions";
import { siteConfig } from "@/config/site";
import { connectDB } from "@/lib/db";
import { siteSettingsSchema } from "@/lib/validations/admin";
import {
  logActivity,
  requireAdmin,
  validationError,
} from "@/actions/helpers";
import {
  SiteSettings,
  SITE_SETTINGS_SINGLETON_KEY,
} from "@/models";

function mapSettingsFields(data: Record<string, unknown>) {
  return {
    ...(data.businessName !== undefined ? { businessName: data.businessName } : {}),
    ...(data.contactPerson !== undefined
      ? { contactPerson: data.contactPerson }
      : {}),
    ...(data.email !== undefined ? { email: data.email } : {}),
    ...(data.phone !== undefined ? { phone: data.phone } : {}),
    ...(data.phoneLink !== undefined ? { phoneLink: data.phoneLink } : {}),
    ...(data.address !== undefined ? { address: data.address } : {}),
    ...(data.socialLinks !== undefined ? { socialLinks: data.socialLinks } : {}),
    ...(data.heroEyebrow !== undefined ? { heroEyebrow: data.heroEyebrow } : {}),
    ...(data.heroHeadline !== undefined
      ? { heroHeadline: data.heroHeadline }
      : {}),
    ...(data.heroSupport !== undefined ? { heroSupport: data.heroSupport } : {}),
    ...(data.heroCtaPrimary !== undefined
      ? { heroCtaPrimary: data.heroCtaPrimary }
      : {}),
    ...(data.heroCtaSecondary !== undefined
      ? { heroCtaSecondary: data.heroCtaSecondary }
      : {}),
    ...(data.aboutText !== undefined ? { aboutText: data.aboutText } : {}),
    ...(data.introOfferText !== undefined
      ? { introOfferText: data.introOfferText }
      : {}),
    ...(data.bookingTimezone !== undefined
      ? { bookingTimezone: data.bookingTimezone }
      : {}),
    ...(data.notificationEmail !== undefined
      ? { notificationEmail: data.notificationEmail }
      : {}),
    ...(data.footerText !== undefined ? { footerText: data.footerText } : {}),
    ...(data.seoDefaults !== undefined ? { seoDefaults: data.seoDefaults } : {}),
    ...(data.logo !== undefined ? { logo: data.logo } : {}),
    ...(data.favicon !== undefined ? { favicon: data.favicon } : {}),
    ...(data.ogImage !== undefined ? { ogImage: data.ogImage } : {}),
    ...(data.maintenanceBanner !== undefined
      ? { maintenanceBanner: data.maintenanceBanner }
      : {}),
    ...(data.privacyContent !== undefined
      ? { privacyContent: data.privacyContent }
      : {}),
    ...(data.termsContent !== undefined ? { termsContent: data.termsContent } : {}),
    ...(data.aboutImage !== undefined ? { aboutImage: data.aboutImage } : {}),
  };
}

function cleanSocialLinks(
  socialLinks?: Record<string, string | undefined>,
): Record<string, string> | undefined {
  if (!socialLinks) {
    return undefined;
  }

  const cleaned = Object.fromEntries(
    Object.entries(socialLinks).filter(([, value]) => Boolean(value)),
  ) as Record<string, string>;

  return Object.keys(cleaned).length > 0 ? cleaned : {};
}

export async function getSiteSettings(): Promise<
  ActionResponse<Record<string, unknown>>
> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  try {
    await connectDB();

    let settings = await SiteSettings.findOne({
      singletonKey: SITE_SETTINGS_SINGLETON_KEY,
    }).lean();

    if (!settings) {
      const created = await SiteSettings.create({
        singletonKey: SITE_SETTINGS_SINGLETON_KEY,
        businessName: siteConfig.businessName,
        contactPerson: siteConfig.contactPerson,
        email: siteConfig.email,
        phone: siteConfig.phone,
        phoneLink: siteConfig.phoneLink,
        notificationEmail: siteConfig.email,
        bookingTimezone: siteConfig.timezone,
      });
      settings = created.toObject();
    }

    return {
      success: true,
      data: { ...settings, id: String(settings._id) },
    };
  } catch (error) {
    console.error("getSiteSettings error:", error);
    return { success: false, error: "Unable to load site settings." };
  }
}

export async function updateSiteSettings(
  input: unknown,
): Promise<ActionResponse<{ id: string }>> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return admin.response;
  }

  const parsed = siteSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const data = {
    ...parsed.data,
    email: parsed.data.email.toLowerCase(),
    notificationEmail: parsed.data.notificationEmail.toLowerCase(),
    socialLinks: cleanSocialLinks(parsed.data.socialLinks),
  };

  try {
    await connectDB();

    const settings = await SiteSettings.findOneAndUpdate(
      { singletonKey: SITE_SETTINGS_SINGLETON_KEY },
      {
        $set: mapSettingsFields(data),
        $setOnInsert: { singletonKey: SITE_SETTINGS_SINGLETON_KEY },
      },
      { new: true, upsert: true, runValidators: true },
    );

    await logActivity({
      action: "update",
      entity: "settings",
      entityId: String(settings._id),
      details: { businessName: settings.businessName },
      adminEmail: admin.email,
    });

    return { success: true, data: { id: String(settings._id) } };
  } catch (error) {
    console.error("updateSiteSettings error:", error);
    return { success: false, error: "Unable to update site settings." };
  }
}
