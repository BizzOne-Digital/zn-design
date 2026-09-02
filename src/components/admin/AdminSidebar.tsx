"use client";

import { cn } from "@/lib/utils";
import {
  Calendar,
  CalendarClock,
  FolderKanban,
  LayoutDashboard,
  Mail,
  MessageSquareQuote,
  Package,
  Settings,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/availability", label: "Availability", icon: CalendarClock },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/pricing", label: "Pricing", icon: Package },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/inquiries", label: "Inquiries", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="hidden w-60 shrink-0 border-r border-taupe/20 bg-white lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b border-taupe/15 px-5 py-6">
          <Link href="/admin" className="block">
            <span className="font-display text-xl font-semibold text-ink">
              ZN Design
            </span>
            <span className="mt-0.5 block text-xs uppercase tracking-widest text-taupe">
              Admin
            </span>
          </Link>
        </div>
        <nav className="flex-1 space-y-0.5 p-3" aria-label="Admin navigation">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-ink text-ivory"
                    : "text-taupe hover:bg-cream/60 hover:text-ink",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
