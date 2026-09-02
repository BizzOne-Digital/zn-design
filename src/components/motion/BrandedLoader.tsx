"use client";

import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const LOADER_KEY = "zn-design-loader-seen";

export function BrandedLoader() {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const seen = sessionStorage.getItem(LOADER_KEY);
    if (!seen) {
      setVisible(true);
      sessionStorage.setItem(LOADER_KEY, "1");
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(
      () => setVisible(false),
      reducedMotion ? 400 : 1400,
    );
    return () => window.clearTimeout(timer);
  }, [visible, reducedMotion]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[500] flex items-center justify-center bg-ivory"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.2 : 0.6, ease: "easeInOut" }}
          aria-hidden={!visible}
          role="presentation"
        >
          <div className="relative flex h-40 w-40 items-center justify-center">
            <motion.svg
              viewBox="0 0 160 160"
              className="absolute inset-0 h-full w-full"
              initial={{ rotate: -90 }}
              animate={{ rotate: reducedMotion ? 0 : 360 }}
              transition={{
                duration: reducedMotion ? 0 : 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.circle
                cx="80"
                cy="80"
                r="72"
                fill="none"
                stroke="#D88484"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0.4 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: reducedMotion ? 0.2 : 1, ease: "easeInOut" }}
              />
            </motion.svg>

            <motion.div
              className="relative z-10 flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: reducedMotion ? 0 : 0.25, duration: 0.5 }}
            >
              <Image
                src="/brand/zn-design-logo.jpg"
                alt=""
                width={120}
                height={120}
                className="h-28 w-auto object-contain"
                priority
                unoptimized
              />
              <span className="mt-2 font-display text-lg tracking-[0.3em] text-ink">
                ZN
              </span>
            </motion.div>

            <motion.svg
              viewBox="0 0 24 24"
              className="absolute -right-1 -top-1 h-6 w-6 text-gold"
              initial={{ opacity: 0, scale: 0, rotate: -30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                delay: reducedMotion ? 0 : 0.7,
                duration: 0.4,
                type: "spring",
                stiffness: 260,
              }}
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M12 2l2.09 6.26L20 9.27l-5 3.64L16.18 20 12 16.77 7.82 20 9 12.91l-5-3.64 5.91-.91L12 2z"
              />
            </motion.svg>

            <motion.div
              className={cn(
                "pointer-events-none absolute inset-0 rounded-full bg-ivory",
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 12 }}
              transition={{
                delay: reducedMotion ? 0.15 : 1,
                duration: reducedMotion ? 0.2 : 0.55,
                ease: [0.76, 0, 0.24, 1],
              }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
