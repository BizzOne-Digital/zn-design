import Link from "next/link";
import { Star } from "lucide-react";
import type { SerializedTestimonial } from "@/lib/data";
import { cn } from "@/lib/utils";

export interface TestimonialsSectionProps {
  testimonials: SerializedTestimonial[];
}

export function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  return (
    <section className="section-padding overflow-hidden">
      <div className="container-editorial">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-taupe">
              Testimonials
            </p>
            <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.5rem)] leading-tight text-ink">
              Kind words from clients
            </h2>
          </div>
          <Link
            href="/testimonials"
            className="text-sm font-semibold uppercase tracking-[0.14em] text-ink underline-gold"
          >
            Read all testimonials
          </Link>
        </div>

        {testimonials.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-taupe/30 bg-cream/40 px-8 py-14 text-center">
            <p className="font-display text-2xl text-ink">Testimonials coming soon</p>
            <p className="mt-3 text-sm text-soft-black/70">
              Client testimonials will appear here once published.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <figure
                key={testimonial._id}
                className={cn(
                  "rounded-[1.5rem] border border-taupe/15 bg-cream/50 p-8",
                  index === 0 && "md:col-span-2 xl:col-span-2",
                )}
              >
                <blockquote className="font-display text-2xl leading-snug text-ink md:text-3xl">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-ink">
                      {testimonial.clientName}
                    </p>
                    {testimonial.businessRole ? (
                      <p className="text-sm text-soft-black/70">
                        {testimonial.businessRole}
                      </p>
                    ) : null}
                  </div>
                  {testimonial.showRating && testimonial.rating ? (
                    <div
                      className="flex items-center gap-1 text-gold"
                      aria-label={`${testimonial.rating} out of 5 stars`}
                    >
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-current"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  ) : null}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
