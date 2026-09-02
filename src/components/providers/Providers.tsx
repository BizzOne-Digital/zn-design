"use client";

import { BrandedLoader } from "@/components/motion/BrandedLoader";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <MotionProvider>
        <ToastProvider>
          <BrandedLoader />
          <CustomCursor />
          {children}
        </ToastProvider>
      </MotionProvider>
    </SessionProvider>
  );
}
