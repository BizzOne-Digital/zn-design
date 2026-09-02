export function TransformationShowcase() {
  return (
    <section className="section-padding bg-ink text-ivory">
      <div className="container-editorial">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pale-gold/80">
              Transformation
            </p>
            <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.25rem)] leading-tight">
              Before clarity, after confidence
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-ivory/75">
              Strong design transforms how a brand feels — from scattered visuals
              to a cohesive identity that communicates with purpose and polish.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-ivory/10 bg-soft-black p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-taupe">
                Before
              </p>
              <p className="mt-4 font-display text-2xl">Inconsistent visuals</p>
              <p className="mt-3 text-sm text-ivory/70">
                Mixed styles, unclear messaging, and visuals that don&apos;t
                reflect the quality of the business.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-gold/30 bg-gradient-to-br from-soft-black to-ink p-6 shadow-[0_20px_60px_-30px_rgba(197,139,50,0.45)]">
              <p className="text-xs uppercase tracking-[0.18em] text-pale-gold">
                After
              </p>
              <p className="mt-4 font-display text-2xl text-gradient-gold">
                Cohesive brand presence
              </p>
              <p className="mt-3 text-sm text-ivory/80">
                A refined identity system that feels distinctive, professional,
                and ready to grow with you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
