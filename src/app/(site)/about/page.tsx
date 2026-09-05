import { AboutHero } from "@/components/site/AboutHero";
import { AboutDesigner } from "@/components/site/AboutDesigner";
import { AboutValues } from "@/components/site/AboutValues";
import { FinalCTA } from "@/components/site/FinalCTA";
import { PageShell } from "@/components/site/PageShell";
import { aboutHeroImage } from "@/config/media";
import { buildPageMetadata } from "@/lib/seo";
import { getMergedSettings } from "@/lib/data";

export async function generateMetadata() {
  const settings = await getMergedSettings();

  return buildPageMetadata({
    title: "About",
    description:
      "Meet Zafreen and learn about ZN Design — a New York creative studio focused on thoughtful brand identities and meaningful visual design.",
    path: "/about",
    image: settings.aboutImage ?? aboutHeroImage,
  });
}

export default async function AboutPage() {
  const settings = await getMergedSettings();

  return (
    <>
      <AboutHero />
      <PageShell>
        <AboutDesigner settings={settings} />
        <AboutValues />
      </PageShell>
      <FinalCTA />
    </>
  );
}
