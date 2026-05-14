import * as React from "react";

import { cn } from "@/lib/utils";

type Variant = "default" | "refined";

const VARIANT_STYLES: Record<Variant, React.CSSProperties> = {
  default: {
    WebkitFontSmoothing: "subpixel-antialiased",
    MozOsxFontSmoothing: "auto",
    textRendering: "auto",
  },
  refined: {
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    textRendering: "optimizeLegibility",
  },
};

const SAMPLES: Record<Variant, { display: string; body: string }> = {
  default: {
    display: "Subpixel rendering",
    body: "Browser default. RGB channel hinting fattens stroke edges, making weight feel heavier than intended against dark backgrounds.",
  },
  refined: {
    display: "Grayscale antialiasing",
    body: "Refined treatment. Thinner, sharper strokes — the same weight reads as more deliberate against dark backgrounds.",
  },
};

const SHARED = {
  small: "The slow river bends past stones at dusk.",
  alphabet: "abcdefghijklmnopqrstuvwxyz · 0123456789",
  meta: "v2.4.1 · $1,249.99 · 0xff0080",
};

const INDICATORS: Record<Variant, { className: string; label: string }> = {
  default: {
    className: "bg-red-400",
    label: "Default rendering",
  },
  refined: {
    className: "bg-emerald-400",
    label: "Refined rendering",
  },
};

function Card({ variant }: { variant: Variant }) {
  const sample = SAMPLES[variant];
  const indicator = INDICATORS[variant];
  return (
    <div className="border-border bg-card/40 relative rounded-2xl border px-8 py-9">
      <span
        role="img"
        aria-label={indicator.label}
        className={cn(
          "absolute top-4 right-4 size-2 rounded-full",
          indicator.className,
        )}
      />
      <div style={VARIANT_STYLES[variant]} className="flex flex-col gap-4">
        <p className="text-foreground text-2xl font-semibold tracking-tight">
          {sample.display}
        </p>
        <p className="text-foreground/85 text-sm leading-relaxed">
          {sample.body}
        </p>
        <p className="text-foreground/65 text-[13px] leading-relaxed">
          {SHARED.small}
        </p>
        <p className="text-foreground/45 text-xs leading-relaxed">
          {SHARED.alphabet}
        </p>
        <p className="text-foreground/30 font-mono text-[11px] leading-relaxed">
          {SHARED.meta}
        </p>
      </div>
    </div>
  );
}

export function FontRenderingDemo() {
  return (
    <figure className="mt-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card variant="default" />
        <Card variant="refined" />
      </div>
    </figure>
  );
}
