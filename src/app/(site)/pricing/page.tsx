import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";
import { getPricingPackages } from "@/lib/data";
import { PricingCards } from "@/components/site/PricingCards";
import { ComparisonTable } from "@/components/site/ComparisonTable";
import { FAQ } from "@/components/site/FAQ";
import { PageShell } from "@/components/site/PageShell";

export const metadata = buildPageMetadata({
  title: "Pricing",
  description:
    "Custom quote pricing for branding and design projects. Explore package frameworks and request a tailored quote from ZN Design.",
  path: "/pricing",
});

const faqItems = [
  {
    question: "Do you offer fixed pricing?",
    answer:
      "Every project is different. Pricing is shaped by scope, complexity, deliverables, and timeline. Share your vision to receive a custom quote designed around what your brand actually needs.",
  },
  {
    question: "What affects the final quote?",
    answer:
      "Factors include the number of deliverables, level of brand development required, rounds of revision, timeline, and any additional assets such as social templates, print files, or packaging design.",
  },
  {
    question: "Can I start with a smaller package?",
    answer:
      "Yes. Introductory package options are available for new clients. We can also build a custom package based on your specific branding and design needs.",
  },
  {
    question: "How do I get started?",
    answer:
      "Book a consultation or send a project inquiry with your goals, timeline, and budget range. We will follow up with a tailored quote and next steps.",
  },
];

export default async function PricingPage() {
  const packages = await getPricingPackages();

  return (
    <PageShell>
      <div className="mb-12 max-w-3xl sm:mb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-taupe">
          Pricing
        </p>
        <h1 className="mt-3 font-display text-[clamp(2.5rem,5vw,4rem)] leading-tight text-ink">
          Custom quotes for every project
        </h1>
        <p className="mt-4 text-base leading-relaxed text-soft-black/75">
          Every project is different. Pricing is shaped by the scope,
          complexity, deliverables, and timeline. Share your vision to receive a
          custom quote designed around what your brand actually needs.
        </p>
      </div>

      <PricingCards packages={packages} />

      <div className="mt-20">
        <h2 className="mb-8 font-display text-3xl text-ink">
          Package comparison
        </h2>
        <ComparisonTable packages={packages} />
      </div>

      <div className="mt-20">
        <h2 className="mb-8 font-display text-3xl text-ink">
          Frequently asked questions
        </h2>
        <FAQ items={faqItems} />
      </div>

      <div className="mt-16 rounded-2xl border border-ink/10 bg-ink px-5 py-8 text-center text-ivory sm:rounded-[1.5rem] sm:px-8 sm:py-10">
        <h2 className="font-display text-2xl sm:text-3xl">
          Ready for a custom quote?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ivory/75">
          Tell us about your project and we&apos;ll recommend the right approach
          and investment level.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
          <Link
            href="/booking"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gold px-6 text-sm font-semibold uppercase tracking-[0.14em] text-ivory sm:w-auto"
          >
            Book a Consultation
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-12 w-full items-center justify-center rounded-full border border-ivory/20 px-6 text-sm font-semibold uppercase tracking-[0.14em] text-ivory sm:w-auto"
          >
            Request a Quote
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
