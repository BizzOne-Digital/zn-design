import Link from "next/link";
import type { MergedSiteSettings } from "@/lib/data";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";

const footerNav = [
  { href: "/work", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/booking", label: "Booking" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export interface FooterProps {
  settings: MergedSiteSettings;
}

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="border-t border-taupe/15 bg-cream/50">
      <div className="section-padding">
        <div className="container-editorial">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div className="space-y-6">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-soft-black/80">
              Thoughtful brand identities and visual design for businesses that
              want to stand out with clarity and style.
            </p>
            <SocialLinks links={settings.socialLinks} />
          </div>

          <div>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-taupe">
              Navigate
            </h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink/80 underline-gold hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-taupe">
              Contact
            </h2>
            <ul className="space-y-3 text-sm">
              <li>
                <span className="block text-taupe">Studio</span>
                <span className="text-ink">{settings.businessName}</span>
              </li>
              {settings.contactPerson ? (
                <li>
                  <span className="block text-taupe">Contact</span>
                  <span className="text-ink">{settings.contactPerson}</span>
                </li>
              ) : null}
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="prose-safe text-ink underline-gold"
                >
                  {settings.email}
                </a>
              </li>
              {settings.phone ? (
                <li>
                  <a
                    href={`tel:${settings.phoneLink || settings.phone}`}
                    className="text-ink underline-gold"
                  >
                    {settings.phone}
                  </a>
                </li>
              ) : null}
              {settings.address ? (
                <li className="text-ink/80">{settings.address}</li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-taupe/15 pt-8 text-sm text-taupe md:flex-row md:items-center md:justify-between">
          <p>{settings.footerText}</p>
          <p className="font-display italic text-ink/70">
            Ideas in motion — from sketch to signature.
          </p>
        </div>
        </div>
      </div>
    </footer>
  );
}
