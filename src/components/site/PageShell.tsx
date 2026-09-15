import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface PageShellProps {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
  portfolio?: boolean;
  as?: "div" | "article";
}

export function PageShell({
  children,
  className,
  narrow = false,
  portfolio = false,
  as: Tag = "div",
}: PageShellProps) {
  const containerClass = portfolio
    ? "container-portfolio"
    : "container-editorial";

  return (
    <Tag className={cn("section-padding page-offset", className)}>
      <div className={cn(containerClass, narrow && "max-w-3xl")}>
        {children}
      </div>
    </Tag>
  );
}
