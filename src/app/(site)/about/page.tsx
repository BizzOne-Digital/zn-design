import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AboutHero } from "@/components/site/AboutHero";
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
      "Meet Zafreen and learn about ZN Design — a creative studio focused on thoughtful brand identities and meaningful visual design.",
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
        <div className="max-w-3xl">
          <p className="prose-safe whitespace-pre-line text-base leading-relaxed text-soft-black/80">
            {settings.aboutText}
          </p>
          <p className="mt-6 text-base leading-relaxed text-soft-black/75">
            Led by {settings.contactPerson}, ZN Design partners with small
            businesses, entrepreneurs, and growing brands to create visual
            identities that feel clear, distinctive, and thoughtfully crafted.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink underline-gold"
          >
            Get in touch
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <AboutValues />
      </PageShell>
      <FinalCTA />
    </>
  );
}
