import { BrandNetwork } from "./brand-network";

// Standalone card pairing the multi-brand callout copy with the
// kernelTheme → brands network diagram. Used by BrandCallout in the
// intro and again inline in the Halo UI chapter to remind the reader
// of brand scale before the Backgrounds vs. Surfaces deep-dive.
export function BrandNetworkCard() {
  return (
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
  );
}
