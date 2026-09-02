import { buildPageMetadata } from "@/lib/seo";
import { getServices } from "@/lib/data";
import { ServiceList } from "@/components/site/ServiceSection";
import { FinalCTA } from "@/components/site/FinalCTA";
import { PageShell } from "@/components/site/PageShell";

export const metadata = buildPageMetadata({
  title: "Services",
  description:
    "Logo and brand identity, social media design, print, packaging, banners, visual design, and custom graphic design services from ZN Design.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageShell>
          <div className="mb-12 max-w-3xl sm:mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-taupe">
              Services
            </p>
            <h1 className="mt-3 font-display text-[clamp(2.5rem,5vw,4rem)] leading-tight text-ink">
              Design services tailored to your brand
            </h1>
            <p className="mt-4 text-base leading-relaxed text-soft-black/75">
              From foundational brand identity to campaign visuals and custom
              creative support — each service is shaped around your goals,
              audience, and timeline.
            </p>
          </div>

          <ServiceList services={services} />
      </PageShell>
      <FinalCTA />
    </>
  );
}
