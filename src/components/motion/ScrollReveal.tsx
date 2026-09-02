"use client";

import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ElementType, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

export interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  y?: number;
  opacity?: number;
  duration?: number;
  delay?: number;
  start?: string;
  scrub?: boolean | number;
  stagger?: number;
  as?: ElementType;
}

export function ScrollReveal({
  children,
  className,
  y = 48,
  opacity = 0,
  duration = 1,
  delay = 0,
  start = "top 85%",
  scrub = false,
  stagger = 0,
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !ref.current) return;

    const ctx = gsap.context(() => {
      const targets = stagger
        ? ref.current!.querySelectorAll("[data-reveal]")
        : ref.current;

      gsap.fromTo(
        targets,
        { y, opacity, filter: "blur(6px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration,
          delay,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start,
            scrub: scrub || false,
            toggleActions: scrub ? undefined : "play none none reverse",
          },
        },
      );
    }, ref);

    return () => ctx.revert();
  }, [reducedMotion, y, opacity, duration, delay, start, scrub, stagger]);

  return (
    <Tag ref={ref as never} className={cn(className)}>
      {children}
    </Tag>
  );
}
