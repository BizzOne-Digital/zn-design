"use client";

import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export interface TextRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  id?: string;
  delay?: number;
  mode?: "chars" | "words" | "lines";
  once?: boolean;
}

const tagMap = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
};

export function TextReveal({
  text,
  as = "p",
  className,
  id,
  delay = 0,
  mode = "words",
  once = true,
}: TextRevealProps) {
  const reducedMotion = useReducedMotion();
  const Component = tagMap[as];

  if (reducedMotion) {
    const Static = as;
    return (
      <Static id={id} className={className}>
        {text}
      </Static>
    );
  }

  const segments =
    mode === "chars"
      ? text.split("")
      : mode === "lines"
        ? text.split("\n")
        : text.split(" ");

  const separator = mode === "chars" ? "" : mode === "lines" ? "\n" : " ";

  return (
    <Component
      id={id}
      className={cn("overflow-hidden", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-10% 0px" }}
      aria-label={text}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {segments.map((segment, index) => (
          <motion.span
            key={`${segment}-${index}`}
            className="inline-block"
            variants={{
              hidden: { y: "110%", opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.55,
                  delay: delay + index * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
          >
            {segment}
            {index < segments.length - 1 ? separator : ""}
          </motion.span>
        ))}
      </span>
    </Component>
  );
}

export function LineReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
