import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface PageShellProps {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
  as?: "div" | "article";
}

export function PageShell({
  children,
  className,
  narrow = false,
  as: Tag = "div",
}: PageShellProps) {
  return (
    <Tag className={cn("section-padding page-offset", className)}>
      <div className={cn("container-editorial", narrow && "max-w-3xl")}>
        {children}
      </div>
    </Tag>
  );
}
