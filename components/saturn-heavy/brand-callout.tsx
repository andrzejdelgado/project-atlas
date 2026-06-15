import { BrandNetworkCard } from "./brand-network-card";

export function BrandCallout() {
  return (
    <section
      aria-label="Brands managed under Saturn Heavy"
      className="mt-10"
    >
      <p className="text-muted-foreground/70 font-mono text-2xs uppercase tracking-mini">
        Multi-brand design system
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">
        One system, twelve brands
      </h2>
      <p className="text-foreground/85 mt-4 leading-7">
        Saturn Heavy is more than a component library, a set of token or
        collection of guidelines or patterns, it&apos;s well-thought
        through, meticulously designed and developed design system that
        allows brand configuration with kernelTheme as a base that saves
        tons of headaches, and allows creating brands with differentiation,
        while keeping core architecture exactly the same.
      </p>
      <BrandNetworkCard />
    </section>
  );
}
