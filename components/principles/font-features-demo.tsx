"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const INTER_FONT_STACK = "'InterFull', system-ui, sans-serif";
const INTER_FACE_ID = "inter-full-face";
const INTER_FACE_CSS = `@font-face{font-family:'InterFull';font-style:normal;font-weight:100 900;font-display:swap;src:url('https://cdn.jsdelivr.net/gh/rsms/inter@v4.0/docs/font-files/InterVariable.woff2') format('woff2');}`;

function useInterFullFont() {
  React.useEffect(() => {
    if (document.getElementById(INTER_FACE_ID)) return;
    const style = document.createElement("style");
    style.id = INTER_FACE_ID;
    style.textContent = INTER_FACE_CSS;
    document.head.appendChild(style);
  }, []);
}

const OPTIONS = [
  {
    label: "normal",
    value: "normal",
    desc: "The default rendering. No OpenType features are explicitly toggled, so every glyph appears in the typeface's standard form.",
  },
  {
    label: '"liga" 0',
    value: '"liga" 0',
    desc: "Disables common ligatures, so character pairs like ffi and ffl render as separate glyphs instead of a single combined form.",
  },
  {
    label: '"tnum", "ss02"',
    value: '"tnum", "ss02"',
    desc: "Tabular numerals plus Inter's ss02 disambiguation set — every digit shares the same advance width and the zero gets a slash distinguishing it from O.",
  },
  {
    label: '"smcp", "ss02"',
    value: '"smcp", "ss02"',
    desc: "Enables small capitals for lowercase letters and Inter's ss02 disambiguation set, which substitutes a slashed zero distinct from O.",
  },
];

const SPECIMENS = ["ffi", "ffl", "0O", "3.140", "2.710"];

export function FontFeaturesDemo() {
  useInterFullFont();
  const [idx, setIdx] = React.useState(0);
  const selected = OPTIONS[idx];

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-10 py-12">
      <span
        role="img"
        aria-label="OpenType feature applied"
        className="bg-emerald-400 absolute top-4 right-4 size-2 rounded-full"
      />

      <div
        role="tablist"
        aria-label="Font feature setting"
        className="mb-6 flex flex-wrap gap-2"
      >
        {OPTIONS.map((opt, i) => (
          <button
            key={opt.label}
            type="button"
            role="tab"
            aria-selected={i === idx}
            onClick={() => setIdx(i)}
            className={cn(
              "rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
              i === idx
                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border bg-transparent",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <p
        aria-live="polite"
        className="text-muted-foreground mb-7 min-h-[4.5rem] text-sm leading-relaxed"
      >
        {selected.desc}
      </p>

      <div
        className="border-border/60 bg-muted/20 grid grid-cols-5 items-baseline gap-4 rounded-xl border px-6 py-10"
        style={{
          fontFamily: INTER_FONT_STACK,
          fontFeatureSettings: selected.value,
        }}
      >
        {SPECIMENS.map((s) => (
          <span
            key={s}
            className="text-foreground text-center text-3xl font-medium sm:text-4xl"
          >
            {s}
          </span>
        ))}
      </div>
    </figure>
  );
}
