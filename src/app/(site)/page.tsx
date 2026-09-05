import { buildPageMetadata } from "@/lib/seo";
import { getMergedSettings } from "@/lib/data";
import { getFeaturedProjects, getFeaturedServices } from "@/lib/data";
import { Hero } from "@/components/site/Hero";
import { Manifesto } from "@/components/site/Manifesto";
import { FeaturedWork } from "@/components/site/FeaturedWork";
import { ServicesPreview } from "@/components/site/ServicesPreview";
import { ProcessSection } from "@/components/site/ProcessSection";
import { TransformationShowcase } from "@/components/site/TransformationShowcase";
import { IntroOffer } from "@/components/site/IntroOffer";
import { FinalCTA } from "@/components/site/FinalCTA";

export async function generateMetadata() {
  const settings = await getMergedSettings();

  return buildPageMetadata({
    title: settings.seoDefaults.title ?? "Home",
    description: settings.seoDefaults.description ?? "",
    path: "/",
    image: settings.ogImage,
  });
}

export default async function HomePage() {
  const [settings, featuredProjects, services] = await Promise.all([
    getMergedSettings(),
    getFeaturedProjects(3),
    getFeaturedServices(6),
  ]);

  return (
    <>
      <Hero settings={settings} />
      <Manifesto />
      <FeaturedWork projects={featuredProjects} />
      <ServicesPreview services={services} />
      <ProcessSection />
      <TransformationShowcase />
      <IntroOffer text={settings.introOfferText} />
      <FinalCTA />
    </>
  );
}
