const values = [
  {
    title: "Intentional",
    description:
      "Every design choice is made with purpose — aligned with your brand story, audience, and goals.",
  },
  {
    title: "Collaborative",
    description:
      "Your input shapes the process. We refine ideas together to arrive at visuals that feel truly yours.",
  },
  {
    title: "Distinctive",
    description:
      "We aim for work that stands apart — polished, memorable, and unmistakably aligned with your brand.",
  },
  {
    title: "Detail-Driven",
    description:
      "From typography to spacing to color, the details are what make a brand feel refined and complete.",
  },
];

export function AboutValues() {
  return (
    <section className="mt-16">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-taupe">
        Studio Values
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {values.map((value, index) => (
          <article
            key={value.title}
            className="rounded-[1.5rem] border border-taupe/15 bg-cream/40 p-6"
          >
            <span className="font-display text-3xl text-gold/80">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 font-display text-2xl text-ink">{value.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-soft-black/75">
              {value.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
