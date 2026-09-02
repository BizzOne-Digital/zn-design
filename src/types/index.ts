import type { Types } from "mongoose";

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

export interface MediaImage {
  url: string;
  publicId: string;
  alt: string;
  width?: number;
  height?: number;
}

// ---------------------------------------------------------------------------
// Portfolio content blocks (discriminated union)
// ---------------------------------------------------------------------------

export type ContentBlockType =
  | "full-width-image"
  | "two-column-images"
  | "text-image"
  | "color-palette"
  | "typography"
  | "quote"
  | "video-embed"
  | "final-result";

export interface ContentBlockBase {
  _id?: Types.ObjectId | string;
  type: ContentBlockType;
  displayOrder?: number;
}

export interface FullWidthImageBlock extends ContentBlockBase {
  type: "full-width-image";
  image: MediaImage;
  caption?: string;
}

export interface TwoColumnImagesBlock extends ContentBlockBase {
  type: "two-column-images";
  leftImage: MediaImage;
  rightImage: MediaImage;
  leftCaption?: string;
  rightCaption?: string;
}

export interface TextImageBlock extends ContentBlockBase {
  type: "text-image";
  heading?: string;
  body: string;
  image: MediaImage;
  imagePosition: "left" | "right";
}

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface ColorPaletteBlock extends ContentBlockBase {
  type: "color-palette";
  heading?: string;
  colors: ColorSwatch[];
}

export interface TypographySample {
  label: string;
  fontFamily: string;
  fontWeight?: string;
  fontSize?: string;
  sampleText?: string;
}

export interface TypographyBlock extends ContentBlockBase {
  type: "typography";
  heading?: string;
  samples: TypographySample[];
}

export interface QuoteBlock extends ContentBlockBase {
  type: "quote";
  quote: string;
  attribution?: string;
}

export interface VideoEmbedBlock extends ContentBlockBase {
  type: "video-embed";
  url: string;
  title?: string;
  provider?: "youtube" | "vimeo" | "other";
}

export interface FinalResultBlock extends ContentBlockBase {
  type: "final-result";
  heading?: string;
  body?: string;
  images: MediaImage[];
}

export type ContentBlock =
  | FullWidthImageBlock
  | TwoColumnImagesBlock
  | TextImageBlock
  | ColorPaletteBlock
  | TypographyBlock
  | QuoteBlock
  | VideoEmbedBlock
  | FinalResultBlock;

// ---------------------------------------------------------------------------
// Enums & status types
// ---------------------------------------------------------------------------

export const PROJECT_CATEGORIES = [
  "Branding",
  "Logo Design",
  "Social Media",
  "Print",
  "Packaging",
  "Banners",
  "Visual Design",
  "Custom",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECT_STATUSES = ["draft", "published"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const BOOKING_STATUSES = [
  "New",
  "Confirmed",
  "In Progress",
  "Completed",
  "Cancelled",
  "No Show",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const CONTACT_STATUSES = ["new", "read", "archived"] as const;
export type ContactStatus = (typeof CONTACT_STATUSES)[number];

// ---------------------------------------------------------------------------
// Availability
// ---------------------------------------------------------------------------

export interface TimeRange {
  start: string; // HH:mm (24h)
  end: string; // HH:mm (24h)
}

export interface WeeklyHoursEntry {
  dayOfWeek: number; // 0 = Sunday … 6 = Saturday
  ranges: TimeRange[];
}

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  behance?: string;
  dribbble?: string;
  pinterest?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
}

export interface SeoDefaults {
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface MaintenanceBanner {
  enabled: boolean;
  content?: string;
}

// ---------------------------------------------------------------------------
// Document interfaces (plain TypeScript, mirrors Mongoose docs)
// ---------------------------------------------------------------------------

export interface IAdminUser {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPortfolioProject {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  category: ProjectCategory;
  shortDescription: string;
  client?: string;
  year?: number;
  services: string[];
  coverImage: MediaImage;
  gallery: MediaImage[];
  contentBlocks: ContentBlock[];
  challenge?: string;
  strategy?: string;
  creativeDirection?: string;
  solution?: string;
  result?: string;
  status: ProjectStatus;
  featured: boolean;
  displayOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  aspectRatio?: string;
  isSample: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IService {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  deliverables: string[];
  processNotes?: string;
  featuredImage?: MediaImage;
  gallery: MediaImage[];
  displayOrder: number;
  active: boolean;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPricingPackage {
  _id: Types.ObjectId;
  title: string;
  subtitle?: string;
  description: string;
  deliverables: string[];
  idealFor?: string;
  priceLabel?: string;
  featured: boolean;
  displayOrder: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITestimonial {
  _id: Types.ObjectId;
  clientName: string;
  businessRole?: string;
  quote: string;
  clientImage?: MediaImage;
  relatedProject?: Types.ObjectId;
  showRating: boolean;
  rating?: number;
  featured: boolean;
  displayOrder: number;
  published: boolean;
  isSample: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBooking {
  _id: Types.ObjectId;
  reference: string;
  clientName: string;
  email: string;
  phone?: string;
  businessName?: string;
  website?: string;
  serviceId?: Types.ObjectId;
  serviceName?: string;
  projectType?: string;
  budgetRange?: string;
  timeline?: string;
  description?: string;
  referralSource?: string;
  scheduledAt: Date;
  timezone: string;
  status: BookingStatus;
  internalNotes?: string;
  emailSent: boolean;
  emailError?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAvailabilityRule {
  _id: Types.ObjectId;
  singletonKey: string;
  timezone: string;
  slotDurationMinutes: number;
  leadTimeHours: number;
  bookingHorizonDays: number;
  weeklyHours: WeeklyHoursEntry[];
  blackoutDates: Date[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IContactSubmission {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  business?: string;
  serviceInterest?: string;
  budgetRange?: string;
  timeline?: string;
  message: string;
  consent: boolean;
  status: ContactStatus;
  internalNotes?: string;
  honeypot?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISiteSettings {
  _id: Types.ObjectId;
  singletonKey: string;
  businessName: string;
  contactPerson?: string;
  email: string;
  phone?: string;
  phoneLink?: string;
  address?: string;
  socialLinks?: SocialLinks;
  heroEyebrow?: string;
  heroHeadline?: string;
  heroSupport?: string;
  heroCtaPrimary?: string;
  heroCtaSecondary?: string;
  aboutText?: string;
  introOfferText?: string;
  bookingTimezone?: string;
  notificationEmail?: string;
  footerText?: string;
  seoDefaults?: SeoDefaults;
  logo?: MediaImage;
  favicon?: MediaImage;
  ogImage?: MediaImage;
  maintenanceBanner?: MaintenanceBanner;
  privacyContent?: string;
  termsContent?: string;
  aboutImage?: MediaImage;
  createdAt: Date;
  updatedAt: Date;
}

export interface IActivityLog {
  _id: Types.ObjectId;
  action: string;
  entity: string;
  entityId?: Types.ObjectId | string;
  details?: Record<string, unknown>;
  adminEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Booking slots (API / lib)
// ---------------------------------------------------------------------------

export interface BookingSlot {
  start: Date;
  end: Date;
  startLocal: string;
  endLocal: string;
}
