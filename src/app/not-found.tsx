import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = buildPageMetadata({
  title: "Page Not Found",
  description: "The page you are looking for could not be found.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-taupe">
        404
      </p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4rem)] leading-tight text-ink">
        This page drifted off the canvas
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-soft-black/75">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
        Let&apos;s get you back to {siteConfig.businessName}.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold uppercase tracking-[0.14em] text-ivory"
        >
          Back to Home
        </Link>
        <Link
          href="/work"
          className="inline-flex h-12 items-center rounded-full border border-ink/20 px-6 text-sm font-semibold uppercase tracking-[0.14em] text-ink"
        >
          View Portfolio
        </Link>
      </div>
    </div>
  );
}
