import { buildPageMetadata } from "@/lib/seo";
import { getMergedSettings } from "@/lib/data";
import { PageShell } from "@/components/site/PageShell";

export const metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: "Privacy policy for ZN Design website visitors and clients.",
  path: "/privacy",
});

const defaultPrivacyContent = `Privacy Policy

Last updated: ${new Date().getFullYear()}

ZN Design ("we", "us", or "our") respects your privacy. This policy explains how we collect, use, and protect information submitted through this website.

Information We Collect
We may collect information you provide directly, including your name, email address, phone number, business name, project details, and any messages submitted through our contact or booking forms.

How We Use Information
We use submitted information to respond to inquiries, schedule consultations, provide design services, improve our website, and communicate about your project.

Data Storage
Form submissions are stored securely in our database. We retain information only as long as necessary to fulfill the purposes described in this policy or as required by law.

Third-Party Services
We may use third-party services for hosting, email delivery, image storage, and security. These providers process data according to their own privacy policies.

Your Rights
You may request access to, correction of, or deletion of your personal information by contacting us at the email address listed on our contact page.

Contact
If you have questions about this privacy policy, please contact ZN Design using the details on our contact page.

Note: This is starter legal content and should be reviewed by the business owner before launch.`;

export default async function PrivacyPage() {
  const settings = await getMergedSettings();
  const content = settings.privacyContent?.trim() || defaultPrivacyContent;

  return (
    <PageShell narrow>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-taupe">
          Legal
        </p>
        <h1 className="mt-3 font-display text-[clamp(2.5rem,5vw,4rem)] leading-tight text-ink">
          Privacy Policy
        </h1>
        <div className="prose-safe prose prose-sm mt-10 max-w-none whitespace-pre-line text-base leading-relaxed text-soft-black/80">
          {content}
        </div>
    </PageShell>
  );
}
