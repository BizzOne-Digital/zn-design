import { buildPageMetadata } from "@/lib/seo";
import { getMergedSettings, getServices } from "@/lib/data";
import { ContactForm } from "@/components/site/ContactForm";
import { PageShell } from "@/components/site/PageShell";
import { SocialLinks } from "@/components/site/SocialLinks";

export const metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Contact ZN Design for branding, graphic design, and visual identity inquiries. Email, phone, and project inquiry form.",
  path: "/contact",
});

interface ContactPageProps {
  searchParams: Promise<{ service?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const [settings, services, params] = await Promise.all([
    getMergedSettings(),
    getServices(),
    searchParams,
  ]);

  const matchedService = services.find(
    (service) => service.slug === params.service,
  );
  const defaultService = matchedService?.title ?? params.service ?? "";

  return (
    <PageShell>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-taupe">
              Contact
            </p>
            <h1 className="mt-3 font-display text-[clamp(2.5rem,5vw,4rem)] leading-tight text-ink">
              Let&apos;s talk about your project
            </h1>
            <p className="mt-4 text-base leading-relaxed text-soft-black/75">
              Share your vision, timeline, and goals. ZN Design will follow up
              with next steps and a custom quote where appropriate.
            </p>

            <div className="mt-10 space-y-6 text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-taupe">
                  Studio
                </p>
                <p className="mt-1 text-lg text-ink">{settings.businessName}</p>
              </div>
              {settings.contactPerson ? (
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-taupe">
                    Contact person
                  </p>
                  <p className="mt-1 text-lg text-ink">
                    {settings.contactPerson}
                  </p>
                </div>
              ) : null}
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-taupe">
                  Email
                </p>
                <a
                  href={`mailto:${settings.email}`}
                  className="prose-safe mt-1 block text-lg text-ink underline-gold"
                >
                  {settings.email}
                </a>
              </div>
              {settings.phone ? (
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-taupe">
                    Phone
                  </p>
                  <a
                    href={`tel:${settings.phoneLink || settings.phone}`}
                    className="prose-safe mt-1 block text-lg text-ink underline-gold"
                  >
                    {settings.phone}
                  </a>
                </div>
              ) : null}
              {settings.address ? (
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-taupe">
                    Location
                  </p>
                  <p className="mt-1 text-lg text-ink">{settings.address}</p>
                </div>
              ) : null}
            </div>

            <SocialLinks links={settings.socialLinks} className="mt-8" />
          </div>

          <div className="min-w-0 rounded-2xl border border-taupe/15 bg-cream/30 p-5 sm:rounded-[1.5rem] sm:p-6 md:p-10">
            <ContactForm services={services} defaultService={defaultService} />
          </div>
        </div>
    </PageShell>
  );
}
