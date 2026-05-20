import { BrandNetwork } from "./brand-network";

export function BrandCallout() {
  return (
    <section
      aria-label="Brands managed under Saturn Heavy"
      className="mt-10"
    >
      <p className="text-muted-foreground/70 font-mono text-2xs uppercase tracking-mini">
        Multi-brand design system
      </p>
      <h2 className="text-foreground mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
        One system, twelve brands
      </h2>
      <p className="text-muted-foreground mt-4 text-sm leading-relaxed sm:text-base">
        Saturn Heavy is more than a component library, a set of token or
        collection of guidelines or patterns, it&apos;s well-thought
        through, meticulously designed and developed design system that
        allows brand configuration with kernelTheme as a base that saves
        tons of headaches, and allows creating brands with differentiation,
        while keeping core architecture exactly the same.
      </p>
      <div className="border-border bg-card/40 mt-5 rounded-2xl border p-5 sm:p-7">
        <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
          Saturn Heavy allows configuration of{" "}
          <strong className="text-foreground">12 brands</strong> so far, but
          was built to host{" "}
          <strong className="text-foreground">100+ brands</strong>, that
          would be build{" "}
          <strong className="text-foreground">in weeks</strong> instead of
          months.
        </p>
        <BrandNetwork />
      </div>
    </section>
  );
}
