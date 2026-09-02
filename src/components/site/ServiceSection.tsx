import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { resolveServiceFeaturedImage } from "@/config/media";
import type { SerializedService } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";

export interface ServiceSectionProps {
  service: SerializedService;
  showInquireCta?: boolean;
}

export function ServiceSection({
  service,
  showInquireCta = true,
}: ServiceSectionProps) {
  const featuredImage = resolveServiceFeaturedImage(service);

  return (
    <article className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div>
        <Badge variant="gold">Service</Badge>
        <h2 className="mt-4 break-words font-display text-[clamp(1.75rem,6vw,3.5rem)] leading-tight text-ink">
          {service.title}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-soft-black/80">
          {service.shortDescription}
        </p>
        {service.fullDescription ? (
          <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-soft-black/75">
            {service.fullDescription}
          </p>
        ) : null}

        {service.deliverables.length > 0 ? (
          <div className="mt-8">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-taupe">
              Deliverables
            </h3>
            <ul className="mt-4 space-y-3">
              {service.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {service.processNotes ? (
          <div className="mt-8 rounded-[1.25rem] border border-taupe/15 bg-cream/50 p-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-taupe">
              Process Notes
            </h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-soft-black/80">
              {service.processNotes}
            </p>
          </div>
        ) : null}

        {showInquireCta ? (
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={`/contact?service=${encodeURIComponent(service.title)}`}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold uppercase tracking-[0.14em] text-ivory sm:w-auto"
            >
              Inquire About This Service
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href={`/booking?service=${encodeURIComponent(service.slug)}`}
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-ink/20 px-6 text-sm font-semibold uppercase tracking-[0.14em] text-ink sm:w-auto"
            >
              Book a Consultation
            </Link>
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        {featuredImage ? (
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-cream">
            <Image
              src={featuredImage.url}
              alt={featuredImage.alt || service.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        ) : null}
        {service.gallery.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {service.gallery.map((image) => (
              <div
                key={image.publicId}
                className="relative aspect-square overflow-hidden rounded-2xl bg-cream"
              >
                <Image
                  src={image.url}
                  alt={image.alt || service.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 20vw"
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export interface ServiceListProps {
  services: SerializedService[];
}

export function ServiceList({ services }: ServiceListProps) {
  if (services.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-taupe/30 bg-cream/40 px-8 py-16 text-center">
        <p className="font-display text-2xl text-ink">Services coming soon</p>
        <p className="mt-3 text-sm text-soft-black/70">
          Service offerings will appear here once added in the admin portal.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-24">
      {services.map((service) => (
        <ServiceSection key={service._id} service={service} />
      ))}
    </div>
  );
}
