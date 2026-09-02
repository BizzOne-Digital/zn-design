"use client";

import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    id: "sketch",
    label: "Sketch",
    description: "Rough ideas, mood, and visual direction take shape on paper.",
    path: "M20 120 Q60 40 120 80 T220 60",
  },
  {
    id: "refine",
    label: "Refine",
    description: "We edit, align, and sharpen until the concept feels inevitable.",
    path: "M20 100 C80 20 140 180 220 90",
  },
  {
    id: "shape",
    label: "Shape",
    description: "Typography, colour, and systems are built with intention.",
    path: "M20 110 Q100 30 180 110 T260 70",
  },
  {
    id: "launch",
    label: "Launch",
    description: "Polished assets delivered — ready to make an impression.",
    path: "M20 90 L100 90 Q140 90 140 130 Q140 170 180 170 L260 170",
  },
] as const;

export interface ProcessStoryProps {
  className?: string;
}

export function ProcessStory({ className }: ProcessStoryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      pathRefs.current.forEach((path, index) => {
        if (!path) return;
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `top+=${index * 120} center`,
            end: `top+=${(index + 1) * 180} center`,
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className={cn("relative bg-cream py-24 md:py-32", className)}
      aria-labelledby="process-story-heading"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-taupe">
          Behind the craft
        </p>
        <h2
          id="process-story-heading"
          className="mt-3 max-w-xl font-display text-4xl text-ink md:text-5xl"
        >
          From first stroke to final reveal
        </h2>

        <div className="relative mt-16 grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <ol className="space-y-10">
            {STEPS.map((step, index) => (
              <li key={step.id} className="relative pl-10">
                <span
                  className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border border-taupe/40 bg-ivory text-xs font-semibold text-dusty-rose"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-2xl text-ink">{step.label}</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-taupe">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>

          <div className="relative min-h-[320px] rounded-3xl border border-taupe/20 bg-ivory p-6 md:min-h-[420px]">
            <svg
              viewBox="0 0 280 200"
              className="h-full w-full"
              aria-hidden="true"
            >
              {STEPS.map((step, index) => (
                <path
                  key={step.id}
                  ref={(el) => {
                    pathRefs.current[index] = el;
                  }}
                  d={step.path}
                  fill="none"
                  stroke={index % 2 === 0 ? "#D88484" : "#C58B32"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity={reducedMotion ? 1 : 0.9}
                  style={
                    reducedMotion
                      ? undefined
                      : { strokeDasharray: 1, strokeDashoffset: 0 }
                  }
                />
              ))}
            </svg>
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-blush/5 via-transparent to-gold/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
