import { listTestimonials } from "@/actions/admin/testimonials";
import {
  TestimonialsManager,
  type TestimonialRow,
} from "@/components/admin/TestimonialsManager";
import type { MediaImage } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonials | ZN Design Admin",
  robots: { index: false, follow: false },
};

function serializeTestimonials(
  data: Record<string, unknown>[],
): TestimonialRow[] {
  return data.map((t) => ({
    id: String(t.id),
    clientName: String(t.clientName),
    businessRole: t.businessRole ? String(t.businessRole) : undefined,
    quote: String(t.quote),
    clientImage: t.clientImage as MediaImage | undefined,
    showRating: Boolean(t.showRating),
    rating: t.rating ? Number(t.rating) : undefined,
    featured: Boolean(t.featured),
    published: Boolean(t.published),
    displayOrder: Number(t.displayOrder ?? 0),
  }));
}

export default async function TestimonialsPage() {
  const result = await listTestimonials();

  if (!result.success) {
    return (
      <div className="rounded-xl border border-dusty-rose/30 bg-red-50 px-6 py-8 text-sm text-dusty-rose">
        {result.error}
      </div>
    );
  }

  return (
    <TestimonialsManager testimonials={serializeTestimonials(result.data)} />
  );
}
