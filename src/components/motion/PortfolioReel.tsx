"use client";

import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export interface PortfolioReelItem {
  slug: string;
  title: string;
  category: string;
  imageUrl: string;
  imageAlt: string;
}

export interface PortfolioReelProps {
  items: PortfolioReelItem[];
  className?: string;
}

export function PortfolioReel({ items, className }: PortfolioReelProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !trackRef.current) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const track = trackRef.current!;
      const section = sectionRef.current!;

      const ctx = gsap.context(() => {
        const scrollWidth = track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: -scrollWidth,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${scrollWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
      }, section);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [items, reducedMotion]);

  if (items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className={cn("relative overflow-hidden bg-ink text-ivory", className)}
      aria-label="Featured portfolio reel"
    >
      <div className="absolute left-6 top-8 z-10 md:left-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">
          Selected Work
        </p>
        <h2 className="mt-2 font-display text-3xl md:text-5xl">In motion</h2>
      </div>

      <div
        ref={trackRef}
        className={cn(
          "flex gap-6 px-6 pb-16 pt-32 md:gap-10 md:px-12",
          "overflow-x-auto scroll-smooth lg:overflow-visible",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {items.map((item, index) => (
          <Link
            key={item.slug}
            href={`/work/${item.slug}`}
            data-cursor-label="Case study"
            className={cn(
              "group relative shrink-0 overflow-hidden rounded-2xl bg-cream/10",
              index % 2 === 0 ? "h-[420px] w-[300px] md:h-[520px] md:w-[380px]" : "mt-12 h-[380px] w-[280px] md:mt-20 md:h-[460px] md:w-[340px]",
            )}
          >
            <Image
              src={item.imageUrl}
              alt={item.imageAlt}
              fill
              sizes="(max-width: 768px) 80vw, 380px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-gold-light">
                {item.category}
              </p>
              <h3 className="mt-2 font-display text-2xl">{item.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
