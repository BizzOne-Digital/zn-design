import { buildPageMetadata } from "@/lib/seo";
import { getMergedSettings, getServices } from "@/lib/data";
import { BookingForm } from "@/components/site/BookingForm";
import { PageShell } from "@/components/site/PageShell";

export const metadata = buildPageMetadata({
  title: "Book a Consultation",
  description:
    "Book a consultation with ZN Design. Select a service, choose an available time, and share your project details.",
  path: "/booking",
});

interface BookingPageProps {
  searchParams: Promise<{ service?: string }>;
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const [settings, services, params] = await Promise.all([
    getMergedSettings(),
    getServices(),
    searchParams,
  ]);

  return (
    <PageShell>
        <div className="mb-8 max-w-3xl sm:mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-taupe">
            Booking
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,5vw,4rem)] leading-tight text-ink">
            Book a consultation
          </h1>
          <p className="mt-4 text-base leading-relaxed text-soft-black/75">
            Choose a service, select an available time, and share your project
            details. You&apos;ll receive a booking reference once your request
            is submitted.
          </p>
        </div>

        <div className="max-w-3xl rounded-2xl border border-taupe/15 bg-cream/30 p-5 sm:rounded-[1.5rem] sm:p-6 md:p-10">
          <BookingForm
            services={services}
            preselectedServiceSlug={params.service}
            timezone={settings.bookingTimezone}
          />
        </div>
    </PageShell>
  );
}
