import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { aboutHeroImage } from "@/config/media";
import type { MergedSiteSettings } from "@/lib/data";

export interface AboutDesignerProps {
  settings: MergedSiteSettings;
}

export function AboutDesigner({ settings }: AboutDesignerProps) {
  const portrait = settings.aboutImage ?? {
    url: aboutHeroImage,
    alt: `${settings.contactPerson}, designer at ZN Design`,
    publicId: "about-designer-portrait",
  };

  return (
    <section className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_1.15fr] lg:items-start lg:gap-14">
      <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-cream sm:rounded-[2rem] lg:mx-0 lg:max-w-none">
        <Image
          src={portrait.url}
          alt={portrait.alt || `${settings.contactPerson} portrait`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 90vw, 40vw"
          priority
        />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-taupe">
          Meet the Designer
        </p>
        <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-ink">
          Hi, I&apos;m {settings.contactPerson.split(" ")[0]}
        </h2>
        <p className="prose-safe mt-6 whitespace-pre-line text-base leading-relaxed text-soft-black/80">
          {settings.aboutText}
        </p>
        <p className="mt-6 text-base leading-relaxed text-soft-black/75">
          Based in {settings.address || "New York, United States"}, I founded ZN
          Design to partner with small businesses, entrepreneurs, and growing
          brands — creating visual identities that feel clear, distinctive, and
          thoughtfully crafted.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink underline-gold"
        >
          Work with me
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
