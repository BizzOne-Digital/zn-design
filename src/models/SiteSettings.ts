import mongoose, { type Model, Schema } from "mongoose";
import type { ISiteSettings } from "@/types";
import { MediaImageSchema } from "./shared";

export const SITE_SETTINGS_SINGLETON_KEY = "default";

const SocialLinksSchema = new Schema(
  {
    instagram: { type: String, trim: true },
    facebook: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    behance: { type: String, trim: true },
    dribbble: { type: String, trim: true },
    pinterest: { type: String, trim: true },
    tiktok: { type: String, trim: true },
    youtube: { type: String, trim: true },
    twitter: { type: String, trim: true },
  },
  { _id: false },
);

const SeoDefaultsSchema = new Schema(
  {
    title: { type: String, trim: true, maxlength: 70 },
    description: { type: String, trim: true, maxlength: 160 },
    keywords: { type: [String], default: [] },
  },
  { _id: false },
);

const MaintenanceBannerSchema = new Schema(
  {
    enabled: { type: Boolean, default: false },
    content: { type: String, trim: true },
  },
  { _id: false },
);

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: SITE_SETTINGS_SINGLETON_KEY,
      immutable: true,
    },
    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
      maxlength: 120,
    },
    contactPerson: { type: String, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: { type: String, trim: true, maxlength: 30 },
    phoneLink: { type: String, trim: true, maxlength: 30 },
    address: { type: String, trim: true, maxlength: 500 },
    socialLinks: SocialLinksSchema,
    heroEyebrow: { type: String, trim: true, maxlength: 120 },
    heroHeadline: { type: String, trim: true, maxlength: 200 },
    heroSupport: { type: String, trim: true, maxlength: 500 },
    heroCtaPrimary: { type: String, trim: true, maxlength: 80 },
    heroCtaSecondary: { type: String, trim: true, maxlength: 80 },
    aboutText: { type: String, trim: true },
    introOfferText: { type: String, trim: true },
    bookingTimezone: {
      type: String,
      trim: true,
      default: "America/New_York",
    },
    notificationEmail: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    footerText: { type: String, trim: true },
    seoDefaults: SeoDefaultsSchema,
    logo: MediaImageSchema,
    favicon: MediaImageSchema,
    ogImage: MediaImageSchema,
    maintenanceBanner: {
      type: MaintenanceBannerSchema,
      default: () => ({ enabled: false }),
    },
    privacyContent: { type: String },
    termsContent: { type: String },
    aboutImage: MediaImageSchema,
  },
  {
    timestamps: true,
    collection: "site_settings",
  },
);

const SiteSettings: Model<ISiteSettings> =
  (mongoose.models.SiteSettings as Model<ISiteSettings>) ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
