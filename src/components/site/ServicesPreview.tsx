import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { SerializedService } from "@/lib/data";

export interface ServicesPreviewProps {
  services: SerializedService[];
}

export function ServicesPreview({ services }: ServicesPreviewProps) {
  return (
    <section className="section-padding bg-cream/40">
      <div className="container-editorial">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-taupe">
            Services
          </p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.5rem)] leading-tight text-ink">
            Design support across your brand journey
          </h2>
        </div>

        {services.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-taupe/30 bg-ivory px-8 py-14 text-center">
            <p className="font-display text-2xl text-ink">Services coming soon</p>
            <p className="mt-3 text-sm text-soft-black/70">
              Service offerings will appear here once added in the admin portal.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-taupe/20 border-y border-taupe/20">
            {services.map((service, index) => (
              <li key={service._id}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group grid gap-4 py-8 transition-colors hover:bg-ivory/60 md:grid-cols-[4rem_1fr_auto] md:items-center md:gap-8 md:px-4"
                >
                  <span className="font-display text-3xl text-gold/80">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="break-words font-display text-xl text-ink transition-transform group-hover:translate-x-1 sm:text-2xl md:text-3xl">
                      {service.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-soft-black/75">
                      {service.shortDescription}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="h-5 w-5 text-taupe transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-gold"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink underline-gold"
          >
            Explore all services
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
