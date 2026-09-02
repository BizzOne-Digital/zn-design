"use client";

import Image from "next/image";
import Link from "next/link";
import { LineReveal, TextReveal } from "@/components/motion/TextReveal";
import type { MergedSiteSettings } from "@/lib/data";

export interface HeroProps {
  settings: MergedSiteSettings;
}

export function Hero({ settings }: HeroProps) {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 z-[2] h-[var(--header-height)] bg-ivory"
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 top-[var(--header-height)] bottom-0">
        <Image
          src="/images/hero-background.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[75%_60%] sm:object-[70%_55%] md:object-[right_45%]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-ivory via-ivory/95 to-ivory/25 sm:via-ivory/92 md:via-ivory/88 md:to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-ivory/60 via-transparent to-ivory/30"
          aria-hidden="true"
        />
      </div>

      <div className="container-editorial relative z-10 flex min-h-[calc(100svh-var(--header-height))] items-start pb-12 pt-8 sm:pb-16 sm:pt-10 md:pt-16 lg:pt-20">
        <div className="w-full max-w-xl space-y-5 sm:space-y-6 md:max-w-2xl md:space-y-8 lg:max-w-[52%]">
          <LineReveal>
            <p className="max-w-[18rem] text-[11px] font-semibold uppercase leading-relaxed tracking-[0.2em] text-dusty-rose sm:max-w-none sm:text-xs sm:tracking-[0.26em]">
              {settings.heroEyebrow}
            </p>
          </LineReveal>

          <TextReveal
            as="h1"
            text={settings.heroHeadline}
            mode="words"
            className="font-display text-[clamp(2.25rem,9vw,4.75rem)] leading-[1.05] tracking-tight text-ink lg:text-[clamp(3rem,5vw,5.25rem)]"
          />

          <LineReveal delay={0.3}>
            <p className="max-w-md text-[0.9375rem] leading-relaxed text-soft-black/85 sm:text-base md:text-lg">
              Modern brand identities and visual experiences for businesses
              ready to stand out.
            </p>
          </LineReveal>

          <LineReveal delay={0.45}>
            <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6 md:gap-8">
              <Link
                href="/work"
                className="inline-flex h-12 w-full items-center justify-center bg-ink px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-soft-black sm:w-auto sm:px-8 md:h-[52px] md:px-10 md:text-[11px] md:tracking-[0.22em]"
              >
                {settings.heroCtaPrimary}
              </Link>
              <Link
                href="/booking"
                className="inline-flex h-12 w-full items-center justify-center text-[11px] font-semibold uppercase tracking-[0.18em] text-ink sm:h-auto sm:w-auto sm:justify-start md:text-[11px] md:tracking-[0.22em]"
              >
                <span className="relative">
                  {settings.heroCtaSecondary}
                  <span
                    className="absolute -bottom-1 left-0 h-px w-full bg-blush"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </div>
          </LineReveal>
        </div>
      </div>
    </section>
  );
}
