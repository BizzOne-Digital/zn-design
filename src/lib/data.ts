import { cache } from "react";
import { unstable_cache } from "next/cache";
import connectDB from "@/lib/db";
import { siteConfig } from "@/config/site";
import {
  PortfolioProject,
  PricingPackage,
  Service,
  SiteSettings,
  Testimonial,
} from "@/models";
import { SITE_SETTINGS_SINGLETON_KEY } from "@/models/SiteSettings";
import type {
  IPortfolioProject,
  IPricingPackage,
  IService,
  ISiteSettings,
  ITestimonial,
  ProjectCategory,
} from "@/types";

function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export type SerializedSiteSettings = Omit<ISiteSettings, "_id"> & {
  _id: string;
};

export type SerializedProject = Omit<IPortfolioProject, "_id"> & {
  _id: string;
};

export type SerializedService = Omit<IService, "_id"> & { _id: string };

export type SerializedTestimonial = Omit<ITestimonial, "_id" | "relatedProject"> & {
  _id: string;
  relatedProject?: string;
};

export type SerializedPricingPackage = Omit<IPricingPackage, "_id"> & {
  _id: string;
};

export interface MergedSiteSettings {
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  phoneLink: string;
  address: string;
  socialLinks: NonNullable<ISiteSettings["socialLinks"]>;
  heroEyebrow: string;
  heroHeadline: string;
  heroSupport: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  aboutText: string;
  introOfferText: string;
  footerText: string;
  seoDefaults: NonNullable<ISiteSettings["seoDefaults"]>;
  logo?: ISiteSettings["logo"];
  favicon?: ISiteSettings["favicon"];
  ogImage?: ISiteSettings["ogImage"];
  aboutImage?: ISiteSettings["aboutImage"];
  maintenanceBanner: NonNullable<ISiteSettings["maintenanceBanner"]>;
  privacyContent?: string;
  termsContent?: string;
  bookingTimezone: string;
  notificationEmail: string;
}

function mergeSiteSettings(
  settings: SerializedSiteSettings | null,
): MergedSiteSettings {
  return {
    businessName: settings?.businessName ?? siteConfig.businessName,
    contactPerson: settings?.contactPerson ?? siteConfig.contactPerson,
    email: settings?.email ?? siteConfig.email,
    phone: settings?.phone ?? siteConfig.phone,
    phoneLink: settings?.phoneLink ?? siteConfig.phoneLink,
    address: settings?.address ?? siteConfig.address,
    socialLinks: settings?.socialLinks ?? siteConfig.social,
    heroEyebrow: settings?.heroEyebrow ?? siteConfig.hero.eyebrow,
    heroHeadline: settings?.heroHeadline ?? siteConfig.hero.headline,
    heroSupport: settings?.heroSupport ?? siteConfig.hero.support,
    heroCtaPrimary: settings?.heroCtaPrimary ?? siteConfig.hero.ctaPrimary,
    heroCtaSecondary: settings?.heroCtaSecondary ?? siteConfig.hero.ctaSecondary,
    aboutText:
      settings?.aboutText ??
      "Hi, I'm Zafreen — the designer behind ZN Design. I'm a New York–based graphic designer helping small businesses and entrepreneurs build brands that feel authentic, polished, and memorable.",
    introOfferText:
      settings?.introOfferText ??
      "New clients may contact ZN Design for introductory package options. Custom packages are available based on individual branding and design needs.",
    footerText: settings?.footerText ?? siteConfig.footer.text,
    seoDefaults: {
      title: settings?.seoDefaults?.title ?? siteConfig.seo.title,
      description:
        settings?.seoDefaults?.description ?? siteConfig.seo.description,
      keywords: settings?.seoDefaults?.keywords ?? [...siteConfig.seo.keywords],
    },
    logo: settings?.logo,
    favicon: settings?.favicon,
    ogImage: settings?.ogImage,
    aboutImage: settings?.aboutImage,
    maintenanceBanner: settings?.maintenanceBanner ?? {
      enabled: false,
      content: "",
    },
    privacyContent: settings?.privacyContent,
    termsContent: settings?.termsContent,
    bookingTimezone: settings?.bookingTimezone ?? siteConfig.timezone,
    notificationEmail:
      settings?.notificationEmail ?? siteConfig.booking.notificationEmail,
  };
}

const getCachedSiteSettings = unstable_cache(
  async (): Promise<SerializedSiteSettings | null> => {
    await connectDB();
    const settings = await SiteSettings.findOne({
      singletonKey: SITE_SETTINGS_SINGLETON_KEY,
    }).lean();

    return settings
      ? (serialize(settings) as unknown as SerializedSiteSettings)
      : null;
  },
  ["site-settings"],
  { revalidate: 300, tags: ["site-settings"] },
);

export const getSiteSettings = cache(
  async (): Promise<SerializedSiteSettings | null> => {
    try {
      return await getCachedSiteSettings();
    } catch (error) {
      console.error("getSiteSettings error:", error);
      return null;
    }
  },
);

export const getMergedSettings = cache(
  async (): Promise<MergedSiteSettings> => {
    const settings = await getSiteSettings();
    return mergeSiteSettings(settings);
  },
);

export const getFeaturedProjects = cache(
  async (limit = 8): Promise<SerializedProject[]> => {
    try {
      await connectDB();
      const projects = await PortfolioProject.find({
        status: "published",
        featured: true,
      })
        .sort({ displayOrder: 1, createdAt: -1 })
        .limit(limit)
        .lean();

      return serialize(projects) as unknown as SerializedProject[];
    } catch (error) {
      console.error("getFeaturedProjects error:", error);
      return [];
    }
  },
);

export interface PublishedProjectsQuery {
  category?: ProjectCategory | "All";
  page?: number;
  limit?: number;
}

export interface PublishedProjectsResult {
  projects: SerializedProject[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export const getPublishedProjects = cache(
  async (
    query: PublishedProjectsQuery = {},
  ): Promise<PublishedProjectsResult> => {
    const { category = "All", page = 1, limit = 12 } = query;

    try {
      await connectDB();

      const filter: Record<string, unknown> = { status: "published" };
      if (category !== "All") {
        filter.category = category;
      }

      const skip = (page - 1) * limit;

      const [projects, total] = await Promise.all([
        PortfolioProject.find(filter)
          .sort({ displayOrder: 1, createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        PortfolioProject.countDocuments(filter),
      ]);

      return {
        projects: serialize(projects) as unknown as SerializedProject[],
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
        hasMore: skip + projects.length < total,
      };
    } catch (error) {
      console.error("getPublishedProjects error:", error);
      return {
        projects: [],
        total: 0,
        page,
        limit,
        totalPages: 1,
        hasMore: false,
      };
    }
  },
);

export const getProjectBySlug = cache(
  async (slug: string): Promise<SerializedProject | null> => {
    try {
      await connectDB();
      const project = await PortfolioProject.findOne({
        slug,
        status: "published",
      }).lean();

      return project ? (serialize(project) as unknown as SerializedProject) : null;
    } catch (error) {
      console.error("getProjectBySlug error:", error);
      return null;
    }
  },
);

export interface AdjacentProjects {
  prev: SerializedProject | null;
  next: SerializedProject | null;
}

export const getAdjacentProjects = cache(
  async (slug: string): Promise<AdjacentProjects> => {
    try {
      await connectDB();

      const current = await PortfolioProject.findOne({
        slug,
        status: "published",
      })
        .select("_id displayOrder createdAt")
        .lean();

      if (!current) {
        return { prev: null, next: null };
      }

      const [prev, next] = await Promise.all([
        PortfolioProject.findOne({
          status: "published",
          $or: [
            { displayOrder: { $lt: current.displayOrder } },
            {
              displayOrder: current.displayOrder,
              createdAt: { $gt: current.createdAt },
            },
          ],
        })
          .sort({ displayOrder: -1, createdAt: 1 })
          .lean(),
        PortfolioProject.findOne({
          status: "published",
          $or: [
            { displayOrder: { $gt: current.displayOrder } },
            {
              displayOrder: current.displayOrder,
              createdAt: { $lt: current.createdAt },
            },
          ],
        })
          .sort({ displayOrder: 1, createdAt: -1 })
          .lean(),
      ]);

      return {
        prev: prev ? (serialize(prev) as unknown as SerializedProject) : null,
        next: next ? (serialize(next) as unknown as SerializedProject) : null,
      };
    } catch (error) {
      console.error("getAdjacentProjects error:", error);
      return { prev: null, next: null };
    }
  },
);

export const getServices = cache(async (): Promise<SerializedService[]> => {
  try {
    await connectDB();
    const services = await Service.find({ active: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return serialize(services) as unknown as SerializedService[];
  } catch (error) {
    console.error("getServices error:", error);
    return [];
  }
});

export const getFeaturedServices = cache(
  async (limit = 6): Promise<SerializedService[]> => {
    try {
      await connectDB();
      const services = await Service.find({ active: true, featured: true })
        .sort({ displayOrder: 1, createdAt: -1 })
        .limit(limit)
        .lean();

      if (services.length > 0) {
        return serialize(services) as unknown as SerializedService[];
      }

      const fallback = await Service.find({ active: true })
        .sort({ displayOrder: 1, createdAt: -1 })
        .limit(limit)
        .lean();

      return serialize(fallback) as unknown as SerializedService[];
    } catch (error) {
      console.error("getFeaturedServices error:", error);
      return [];
    }
  },
);

export const getServiceBySlug = cache(
  async (slug: string): Promise<SerializedService | null> => {
    try {
      await connectDB();
      const service = await Service.findOne({ slug, active: true }).lean();
      return service ? (serialize(service) as unknown as SerializedService) : null;
    } catch (error) {
      console.error("getServiceBySlug error:", error);
      return null;
    }
  },
);

export const getPricingPackages = cache(
  async (): Promise<SerializedPricingPackage[]> => {
    try {
      await connectDB();
      const packages = await PricingPackage.find({ active: true })
        .sort({ displayOrder: 1, createdAt: -1 })
        .lean();

      return serialize(packages) as unknown as SerializedPricingPackage[];
    } catch (error) {
      console.error("getPricingPackages error:", error);
      return [];
    }
  },
);

export interface TestimonialsQuery {
  featured?: boolean;
  limit?: number;
}

export const getTestimonials = cache(
  async (query: TestimonialsQuery = {}): Promise<SerializedTestimonial[]> => {
    const { featured, limit } = query;

    try {
      await connectDB();

      const filter: Record<string, unknown> = { published: true };
      if (featured) {
        filter.featured = true;
      }

      let queryBuilder = Testimonial.find(filter).sort({
        displayOrder: 1,
        createdAt: -1,
      });

      if (limit) {
        queryBuilder = queryBuilder.limit(limit);
      }

      const testimonials = await queryBuilder.lean();
      return serialize(testimonials) as unknown as SerializedTestimonial[];
    } catch (error) {
      console.error("getTestimonials error:", error);
      return [];
    }
  },
);

export const getAllProjectSlugs = cache(async (): Promise<string[]> => {
  try {
    await connectDB();
    const projects = await PortfolioProject.find({ status: "published" })
      .select("slug")
      .lean();
    return projects.map((project) => project.slug);
  } catch (error) {
    console.error("getAllProjectSlugs error:", error);
    return [];
  }
});

export const getAllServiceSlugs = cache(async (): Promise<string[]> => {
  try {
    await connectDB();
    const services = await Service.find({ active: true }).select("slug").lean();
    return services.map((service) => service.slug);
  } catch (error) {
    console.error("getAllServiceSlugs error:", error);
    return [];
  }
});
