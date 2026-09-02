const manifestoWords = [
  "Thoughtful",
  "Distinctive",
  "Strategic",
  "Memorable",
  "Collaborative",
];

export function Manifesto() {
  return (
    <section className="section-padding bg-ink text-ivory">
      <div className="container-editorial">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pale-gold/80">
            Studio Manifesto
          </p>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-tight">
            ZN Design helps businesses elevate their brand with design that
            feels{" "}
            <span className="italic text-gradient-gold">clear</span>,{" "}
            <span className="italic text-blush">distinctive</span>, and built to
            connect.
          </h2>
        </div>

        <div className="mt-12 flex flex-wrap gap-3 border-t border-ivory/10 pt-8">
          {manifestoWords.map((word) => (
            <span
              key={word}
              className="rounded-full border border-ivory/15 px-5 py-2 text-sm uppercase tracking-[0.16em] text-ivory/90"
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
    </section>
  );
}
