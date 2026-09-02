"use client";

import Image from "next/image";
import { LineReveal, TextReveal } from "@/components/motion/TextReveal";
import { aboutHeroImage } from "@/config/media";

export function AboutHero() {
  return (
    <section className="relative min-h-[min(72svh,44rem)] overflow-hidden sm:min-h-[min(78svh,48rem)]">
      <div
        className="absolute inset-x-0 top-0 z-[2] h-[var(--header-height)] bg-ivory"
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 top-[var(--header-height)] bottom-0">
        <Image
          src={aboutHeroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_50%] sm:object-[68%_45%] md:object-[right_40%]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-ivory via-ivory/96 to-ivory/20 sm:via-ivory/92 md:via-ivory/85 md:to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-ivory/50 via-transparent to-ivory/35"
          aria-hidden="true"
        />
      </div>

      <div className="container-editorial relative z-10 flex min-h-[calc(min(72svh,44rem)-var(--header-height))] items-end pb-10 pt-8 sm:min-h-[calc(min(78svh,48rem)-var(--header-height))] sm:items-center sm:pb-14 sm:pt-10 md:pt-14">
        <div className="w-full max-w-xl space-y-4 sm:space-y-5 md:max-w-2xl md:space-y-6 lg:max-w-[52%]">
          <LineReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-dusty-rose sm:text-xs sm:tracking-[0.26em]">
              About
            </p>
          </LineReveal>

          <TextReveal
            as="h1"
            text="The creative studio behind ZN Design"
            mode="words"
            className="font-display text-[clamp(2.25rem,8vw,4.25rem)] leading-[1.05] tracking-tight text-ink lg:text-[clamp(2.75rem,4.5vw,4.75rem)]"
          />

          <LineReveal delay={0.25}>
            <p className="max-w-md text-[0.9375rem] leading-relaxed text-soft-black/85 sm:text-base md:text-lg">
              Thoughtful brand identities and polished visual design for
              businesses ready to stand out with clarity and confidence.
            </p>
          </LineReveal>
        </div>
      </div>
    </section>
  );
}
