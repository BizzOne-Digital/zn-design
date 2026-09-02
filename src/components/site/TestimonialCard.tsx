import { Star } from "lucide-react";
import Image from "next/image";
import type { SerializedTestimonial } from "@/lib/data";
import { cn } from "@/lib/utils";

export interface TestimonialCardProps {
  testimonial: SerializedTestimonial;
  variant?: "default" | "featured";
}

export function TestimonialCard({
  testimonial,
  variant = "default",
}: TestimonialCardProps) {
  return (
    <figure
      className={cn(
        "rounded-[1.5rem] border border-taupe/15 bg-cream/40 p-8",
        variant === "featured" && "bg-ink text-ivory",
      )}
    >
      <blockquote
        className={cn(
          "font-display leading-snug",
          variant === "featured" ? "text-3xl md:text-4xl" : "text-2xl",
        )}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-4">
        {testimonial.clientImage ? (
          <div className="relative h-12 w-12 overflow-hidden rounded-full bg-cream">
            <Image
              src={testimonial.clientImage.url}
              alt={testimonial.clientImage.alt || testimonial.clientName}
              fill
              className="object-cover"
            />
          </div>
        ) : null}
        <div className="flex-1">
          <p className="font-semibold">{testimonial.clientName}</p>
          {testimonial.businessRole ? (
            <p
              className={cn(
                "text-sm",
                variant === "featured" ? "text-ivory/70" : "text-soft-black/70",
              )}
            >
              {testimonial.businessRole}
            </p>
          ) : null}
        </div>
        {testimonial.showRating && testimonial.rating ? (
          <div
            className="flex items-center gap-1 text-gold"
            aria-label={`${testimonial.rating} out of 5 stars`}
          >
            {Array.from({ length: testimonial.rating }).map((_, index) => (
              <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />
            ))}
          </div>
        ) : null}
      </figcaption>
    </figure>
  );
}
