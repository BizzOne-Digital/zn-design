"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import type { MergedSiteSettings } from "@/lib/data";
import { useFocusTrap } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Portfolio" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export interface HeaderProps {
  settings: MergedSiteSettings;
}

export function Header({ settings }: HeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useFocusTrap(menuRef, menuOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      firstLinkRef.current?.focus();
    }
  }, [menuOpen]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuOpen) {
        closeMenu();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, closeMenu]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled || !isHome
            ? "border-b border-taupe/10 bg-ivory/96 py-2.5 shadow-[0_4px_24px_-12px_rgba(17,16,15,0.12)] backdrop-blur-md md:py-3"
            : "bg-ivory/80 py-3 backdrop-blur-sm md:bg-transparent md:py-6",
        )}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-[var(--page-gutter)] md:grid md:grid-cols-[1fr_auto_1fr] md:gap-4 md:px-10 lg:px-14">
          <div className="min-w-0 shrink-0 justify-self-start">
            <Logo size="sm" showWordmark={false} variant="mark" className="md:hidden" />
            <Logo size="md" showWordmark={false} variant="mark" className="hidden md:inline-flex" />
          </div>

          <nav
            className="hidden items-center justify-center gap-5 md:flex lg:gap-9"
            aria-label="Primary"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-[11px] font-medium uppercase tracking-[0.16em] text-ink/75 transition-colors hover:text-ink lg:text-xs lg:tracking-[0.18em]",
                  isActive(link.href) && "text-ink",
                )}
              >
                {link.label}
                {isActive(link.href) ? (
                  <span
                    className="absolute -bottom-1.5 left-0 h-px w-full bg-blush"
                    aria-hidden="true"
                  />
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
            <Link
              href="/booking"
              className="inline-flex h-11 min-w-[4.5rem] items-center justify-center bg-ink px-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-soft-black sm:px-4 sm:text-[10px] md:hidden"
            >
              Book
            </Link>
            <Link
              href="/booking"
              className="hidden h-10 items-center justify-center bg-ink px-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-soft-black md:inline-flex lg:px-6 lg:text-[11px]"
            >
              Book a Project
            </Link>

            <button
              ref={menuButtonRef}
              type="button"
              className="touch-target inline-flex h-11 w-11 items-center justify-center border border-ink/15 text-ink md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menuRef}
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-ivory px-[var(--page-gutter)] pb-8 pt-[calc(var(--header-height)+1rem)] transition-all duration-500 md:hidden",
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile" className="flex flex-col gap-0">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              ref={index === 0 ? firstLinkRef : undefined}
              href={link.href}
              onClick={closeMenu}
              className="group flex min-h-14 items-baseline gap-4 border-b border-taupe/15 py-4"
            >
              <span className="font-display text-sm text-blush/80">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-2xl text-ink transition-transform duration-300 group-hover:translate-x-2 sm:text-3xl">
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-4 border-t border-taupe/15 pt-8">
          <p className="text-sm text-taupe">{settings.contactPerson}</p>
          <a
            href={`mailto:${settings.email}`}
            className="prose-safe block text-base text-ink underline decoration-blush underline-offset-4"
          >
            {settings.email}
          </a>
          {settings.phone ? (
            <a
              href={`tel:${settings.phoneLink || settings.phone}`}
              className="block text-base text-ink underline decoration-blush underline-offset-4"
            >
              {settings.phone}
            </a>
          ) : null}
          <Link
            href="/booking"
            onClick={closeMenu}
            className="flex h-12 w-full items-center justify-center bg-ink text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory"
          >
            Book a Project
          </Link>
        </div>
      </div>
    </>
  );
}
