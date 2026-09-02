"use client";

import { useFinePointer, useReducedMotion } from "@/lib/hooks";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CustomCursor() {
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 420, damping: 38 });
  const springY = useSpring(cursorY, { stiffness: 420, damping: 38 });

  useEffect(() => {
    if (!finePointer || reducedMotion) return;

    const onMove = (event: MouseEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
      setVisible(true);

      const target = event.target as HTMLElement | null;
      const interactive = target?.closest<HTMLElement>(
        "[data-cursor-label], a, button, [role='button']",
      );
      const customLabel = interactive?.dataset.cursorLabel;
      if (customLabel) {
        setLabel(customLabel);
      } else if (interactive?.tagName === "A") {
        setLabel("View");
      } else if (interactive) {
        setLabel("Open");
      } else {
        setLabel("");
      }
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [finePointer, reducedMotion, cursorX, cursorY]);

  if (!finePointer || reducedMotion) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[400] hidden md:block"
      style={{ x: springX, y: springY }}
      aria-hidden="true"
    >
      <motion.div
        animate={{
          scale: visible ? 1 : 0,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="relative -translate-x-1/2 -translate-y-1/2"
      >
        <div className="h-3 w-3 rounded-full border border-ink/30 bg-blush/30 backdrop-blur-sm" />
        {label ? (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-ivory"
          >
            {label}
          </motion.span>
        ) : null}
      </motion.div>
    </motion.div>
  );
}
