import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface IntroOfferProps {
  text: string;
}

export function IntroOffer({ text }: IntroOfferProps) {
  return (
    <section className="section-padding">
      <div className="container-editorial">
        <div className="relative overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-br from-cream via-ivory to-pale-gold/20 px-5 py-8 sm:rounded-[2rem] sm:px-8 sm:py-12 md:px-12 md:py-16">
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blush/20 blur-2xl"
            aria-hidden="true"
          />
          <div className="relative max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-taupe">
              Introductory Offer
            </p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-ink">
              New to ZN Design?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-soft-black/80">
              {text}
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-ivory transition-transform hover:-translate-y-0.5 sm:w-auto sm:px-8"
            >
              Request a Custom Quote
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
