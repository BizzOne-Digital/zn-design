import Image from "next/image";
import { manifestoBackgroundImage } from "@/config/media";

const manifestoWords = [
  "Thoughtful",
  "Distinctive",
  "Strategic",
  "Memorable",
  "Collaborative",
];

export function Manifesto() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={manifestoBackgroundImage}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[72%_50%] sm:object-[68%_45%] md:object-[right_40%]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-ink/82 sm:bg-ink/78 md:bg-gradient-to-r md:from-ink/92 md:via-ink/85 md:to-ink/55"
          aria-hidden="true"
        />
      </div>

      <div className="section-padding relative z-10 text-ivory">
        <div className="container-editorial">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pale-gold/80">
              Studio Manifesto
            </p>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-tight">
              ZN Design helps businesses elevate their brand with design that
              feels{" "}
              <span className="italic text-gradient-gold">clear</span>,{" "}
              <span className="italic text-blush">distinctive</span>, and built
              to connect.
            </h2>
          </div>

          <div className="mt-12 flex flex-wrap gap-3 border-t border-ivory/10 pt-8">
            {manifestoWords.map((word) => (
              <span
                key={word}
                className="rounded-full border border-ivory/15 bg-ink/20 px-5 py-2 text-sm uppercase tracking-[0.16em] text-ivory/90 backdrop-blur-sm"
              >
                {word}
              </span>
            ))}
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-ivory/70">
            From logos and branding to social content and packaging — every
            project is shaped around your story, audience, and goals.
          </p>
        </div>
      </div>
    </section>
  );
}
