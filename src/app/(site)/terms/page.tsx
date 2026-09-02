import { buildPageMetadata } from "@/lib/seo";
import { getMergedSettings } from "@/lib/data";
import { PageShell } from "@/components/site/PageShell";

export const metadata = buildPageMetadata({
  title: "Terms of Service",
  description: "Terms of service for ZN Design website visitors and clients.",
  path: "/terms",
});

const defaultTermsContent = `Terms of Service

Last updated: ${new Date().getFullYear()}

Welcome to ZN Design. By using this website and engaging our services, you agree to the following terms.

Services
ZN Design provides graphic design, branding, and related creative services. Project scope, deliverables, timelines, and fees are defined in custom quotes and project agreements.

Bookings & Inquiries
Consultation bookings and contact form submissions do not constitute a binding contract until a formal quote or agreement is accepted by both parties.

Intellectual Property
Unless otherwise agreed in writing, intellectual property rights for final paid deliverables are transferred upon full payment. ZN Design may display completed work in its portfolio unless otherwise requested in writing.

Client Responsibilities
Clients agree to provide timely feedback, necessary materials, and accurate project information to support the design process.

Payment
Payment terms are outlined in individual project quotes. Work may be paused if agreed payments are not received.

Limitation of Liability
ZN Design is not liable for indirect, incidental, or consequential damages arising from use of this website or our services, to the fullest extent permitted by law.

Changes
We may update these terms from time to time. Continued use of the website constitutes acceptance of the revised terms.

Contact
Questions about these terms may be directed to ZN Design via the contact page.

Note: This is starter legal content and should be reviewed by the business owner before launch.`;

export default async function TermsPage() {
  const settings = await getMergedSettings();
  const content = settings.termsContent?.trim() || defaultTermsContent;

  return (
    <PageShell narrow>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-taupe">
          Legal
        </p>
        <h1 className="mt-3 font-display text-[clamp(2.5rem,5vw,4rem)] leading-tight text-ink">
          Terms of Service
        </h1>
        <div className="prose-safe prose prose-sm mt-10 max-w-none whitespace-pre-line text-base leading-relaxed text-soft-black/80">
          {content}
        </div>
    </PageShell>
  );
}
