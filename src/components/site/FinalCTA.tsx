import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="section-padding bg-ink text-ivory">
      <div className="container-editorial text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pale-gold/80">
          Let&apos;s Create
        </p>
        <h2 className="mx-auto mt-6 max-w-4xl font-display text-[clamp(2rem,8vw,4.75rem)] leading-[1.05] sm:leading-[0.98]">
          Have a vision? Let&apos;s make it unforgettable.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ivory/75">
          Share your project details and we&apos;ll craft a custom approach
          shaped around your brand, timeline, and goals.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
          <Link
            href="/booking"
            className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gold px-8 text-sm font-semibold uppercase tracking-[0.14em] text-ivory transition-transform hover:-translate-y-0.5 sm:w-auto"
          >
            Book a Consultation
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-14 w-full items-center justify-center rounded-full border border-ivory/20 px-8 text-sm font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:border-ivory hover:bg-ivory/5 sm:w-auto"
          >
            Contact ZN Design
          </Link>
        </div>
      </div>
    </section>
  );
}
