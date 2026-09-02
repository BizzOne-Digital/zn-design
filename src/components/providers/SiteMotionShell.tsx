"use client";

import { PageTransition } from "@/components/motion/PageTransition";
import type { ReactNode } from "react";

export function SiteMotionShell({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
