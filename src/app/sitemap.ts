import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import { siteConfig } from "@/config/site";
import { PortfolioProject, Service } from "@/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  {
    url: siteConfig.url,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: `${siteConfig.url}/work`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${siteConfig.url}/services`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${siteConfig.url}/pricing`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${siteConfig.url}/about`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${siteConfig.url}/contact`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${siteConfig.url}/booking`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.MONGODB_URI) {
    return STATIC_ROUTES;
  }

  try {
    await connectDB();

    const [projects, services] = await Promise.all([
      PortfolioProject.find({ status: "published" })
        .select("slug updatedAt")
        .sort({ displayOrder: 1, updatedAt: -1 })
        .lean(),
      Service.find({ active: true })
        .select("slug updatedAt")
        .sort({ displayOrder: 1, updatedAt: -1 })
        .lean(),
    ]);

    const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
      url: `${siteConfig.url}/work/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
      url: `${siteConfig.url}/services/${service.slug}`,
      lastModified: service.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    return [...STATIC_ROUTES, ...projectRoutes, ...serviceRoutes];
  } catch (error) {
    console.error("sitemap generation error:", error);
    return STATIC_ROUTES;
  }
}
