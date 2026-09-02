import { cn } from "@/lib/utils";
import type { BookingStatus, ContactStatus } from "@/types";

type StatusType = BookingStatus | ContactStatus | "draft" | "published" | "active" | "inactive" | "featured";

const statusStyles: Record<string, string> = {
  New: "bg-gold/15 text-gold border-gold/30",
  new: "bg-gold/15 text-gold border-gold/30",
  Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
  Completed: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Cancelled: "bg-stone-100 text-stone-600 border-stone-200",
  "No Show": "bg-red-50 text-red-700 border-red-200",
  read: "bg-stone-100 text-stone-600 border-stone-200",
  archived: "bg-stone-50 text-stone-500 border-stone-200",
  draft: "bg-stone-100 text-stone-600 border-stone-200",
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  inactive: "bg-stone-100 text-stone-500 border-stone-200",
  featured: "bg-gold/15 text-gold border-gold/30",
};

export interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = statusStyles[status] ?? "bg-cream text-ink border-taupe/30";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize",
        style,
        className,
      )}
    >
      {status === "No Show" ? "No Show" : status}
    </span>
  );
}
