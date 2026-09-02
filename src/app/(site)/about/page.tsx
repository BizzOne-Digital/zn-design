import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";
import { getMergedSettings } from "@/lib/data";
import { AboutValues } from "@/components/site/AboutValues";
import { FinalCTA } from "@/components/site/FinalCTA";
import { PageShell } from "@/components/site/PageShell";

export async function generateMetadata() {
  const settings = await getMergedSettings();

  return buildPageMetadata({
    title: "About",
    description:
      "Meet Zafreen and learn about ZN Design — a creative studio focused on thoughtful brand identities and meaningful visual design.",
    path: "/about",
    image: settings.aboutImage ?? settings.ogImage,
  });
}

export default async function AboutPage() {
  const settings = await getMergedSettings();

  return (
    <>
      <PageShell>
          <div className="grid gap-10 sm:gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-taupe">
                About
              </p>
              <h1 className="mt-3 font-display text-[clamp(2.5rem,5vw,4rem)] leading-tight text-ink">
                The creative studio behind ZN Design
              </h1>
              <p className="prose-safe mt-6 whitespace-pre-line text-base leading-relaxed text-soft-black/80">
                {settings.aboutText}
              </p>
              <p className="mt-6 text-base leading-relaxed text-soft-black/75">
                Led by {settings.contactPerson}, ZN Design partners with small
                businesses, entrepreneurs, and growing brands to create visual
                identities that feel clear, distinctive, and thoughtfully
                crafted.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink underline-gold"
              >
                Get in touch
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="relative aspect-[4/5] min-h-[18rem] overflow-hidden rounded-2xl bg-cream sm:rounded-[2rem]">
              {settings.aboutImage ? (
                <Image
                  src={settings.aboutImage.url}
                  alt={settings.aboutImage.alt || `${settings.contactPerson} portrait`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-10 text-center">
                  <div className="h-24 w-24 rounded-full border border-taupe/20 bg-ivory" />
                  <p className="mt-6 font-display text-2xl text-ink">
                    Studio portrait
                  </p>
                  <p className="mt-2 text-sm text-soft-black/70">
                    Upload a portrait or studio image from Site Settings.
                  </p>
                </div>
              )}
            </div>
          </div>

          <AboutValues />
      </PageShell>
      <FinalCTA />
    </>
  );
}
