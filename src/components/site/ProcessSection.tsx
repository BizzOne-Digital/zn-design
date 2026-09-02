const steps = [
  {
    title: "Discover",
    description:
      "We explore your goals, audience, and visual direction to understand what your brand needs to communicate.",
  },
  {
    title: "Define",
    description:
      "Strategy and creative direction take shape — clarifying the story, tone, and design approach.",
  },
  {
    title: "Design",
    description:
      "Concepts evolve into polished visuals across logos, brand systems, social content, print, and more.",
  },
  {
    title: "Refine",
    description:
      "Thoughtful revisions ensure every detail feels intentional, cohesive, and aligned with your vision.",
  },
  {
    title: "Deliver",
    description:
      "Final files and guidance are prepared so you can launch with confidence and consistency.",
  },
];

export function ProcessSection() {
  return (
    <section className="section-padding">
      <div className="container-editorial">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-taupe">
            Process
          </p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.5rem)] leading-tight text-ink">
            From sketch to signature
          </h2>
        </div>

        <ol className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative rounded-[1.5rem] border border-taupe/15 bg-ivory p-6"
            >
              <span className="font-display text-4xl text-gold/70">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-2xl text-ink">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-soft-black/75">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
