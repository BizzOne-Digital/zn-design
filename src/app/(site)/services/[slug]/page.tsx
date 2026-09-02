import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";
import {
  getAllServiceSlugs,
  getServiceBySlug,
} from "@/lib/data";
import { ServiceSection } from "@/components/site/ServiceSection";
import { FinalCTA } from "@/components/site/FinalCTA";
import { PageShell } from "@/components/site/PageShell";

export const dynamic = "force-dynamic";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return buildPageMetadata({
      title: "Service Not Found",
      description: "This service could not be found.",
      path: `/services/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: service.seoTitle || service.title,
    description: service.seoDescription || service.shortDescription,
    path: `/services/${service.slug}`,
    image: service.featuredImage,
  });
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <PageShell>
          <ServiceSection service={service} />
      </PageShell>
      <FinalCTA />
    </>
  );
}
