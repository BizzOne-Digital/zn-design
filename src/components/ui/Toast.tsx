"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

export type ToastVariant = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toast: (item: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icons: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const variantStyles: Record<ToastVariant, string> = {
  success: "border-gold/40 bg-ivory",
  error: "border-dusty-rose/50 bg-ivory",
  info: "border-taupe/30 bg-cream/80",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (item: Omit<ToastItem, "id">) => {
      const id = crypto.randomUUID();
      const duration = item.duration ?? 5000;

      setToasts((prev) => [...prev, { ...item, id }]);

      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted
        ? createPortal(
            <div
              aria-live="polite"
              aria-relevant="additions"
              className="pointer-events-none fixed bottom-4 right-4 z-[300] flex w-full max-w-sm flex-col gap-3 p-4 sm:bottom-6 sm:right-6"
            >
              <AnimatePresence mode="popLayout">
                {toasts.map((item) => {
                  const Icon = icons[item.variant ?? "info"];
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 16, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className={cn(
                        "pointer-events-auto rounded-xl border p-4 shadow-xl backdrop-blur-md",
                        variantStyles[item.variant ?? "info"],
                      )}
                      role="status"
                    >
                      <div className="flex gap-3">
                        <Icon
                          className={cn(
                            "mt-0.5 h-5 w-5 shrink-0",
                            item.variant === "error"
                              ? "text-dusty-rose"
                              : item.variant === "success"
                                ? "text-gold"
                                : "text-taupe",
                          )}
                          aria-hidden="true"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-ink">
                            {item.title}
                          </p>
                          {item.description ? (
                            <p className="mt-0.5 text-xs text-taupe">
                              {item.description}
                            </p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => dismiss(item.id)}
                          className="shrink-0 rounded-full p-1 text-taupe hover:bg-cream hover:text-ink"
                          aria-label="Dismiss notification"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
