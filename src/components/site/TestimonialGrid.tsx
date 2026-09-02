import type { SerializedTestimonial } from "@/lib/data";
import { TestimonialCard } from "./TestimonialCard";

export interface TestimonialGridProps {
  testimonials: SerializedTestimonial[];
}

export function TestimonialGrid({ testimonials }: TestimonialGridProps) {
  if (testimonials.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-taupe/30 bg-cream/40 px-8 py-16 text-center">
        <p className="font-display text-2xl text-ink">Testimonials coming soon</p>
        <p className="mt-3 text-sm text-soft-black/70">
          Published client testimonials will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {testimonials.map((testimonial, index) => (
        <TestimonialCard
          key={testimonial._id}
          testimonial={testimonial}
          variant={index === 0 ? "featured" : "default"}
        />
      ))}
    </div>
  );
}
