"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const ROBOTO_FLEX_LINK_ID = "roboto-flex-opsz-link";
const ROBOTO_FLEX_HREF =
  "https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap";

function useRobotoFlex() {
  React.useEffect(() => {
    if (document.getElementById(ROBOTO_FLEX_LINK_ID)) return;
    const link = document.createElement("link");
    link.id = ROBOTO_FLEX_LINK_ID;
    link.rel = "stylesheet";
    link.href = ROBOTO_FLEX_HREF;
    document.head.appendChild(link);
  }, []);
}

const OPTIONS = [
  {
    label: "Disabled",
    isBroken: true,
    style: {
      fontOpticalSizing: "none" as const,
      fontVariationSettings: '"opsz" 14',
    },
    desc: "The optical-size axis is pinned to a single value, so every size renders from the same design — display sizes look slightly stiff, captions slightly fragile.",
  },
  {
    label: "Auto",
    isBroken: false,
    style: {
      fontOpticalSizing: "auto" as const,
      fontVariationSettings: "normal",
    },
    desc: "The browser picks an optical cut per rendered size — display glyphs gain contrast and tighter spacing, captions gain sturdier strokes and looser tracking.",
  },
];

const ROBOTO_FLEX_STACK = "'Roboto Flex', system-ui, sans-serif";

export function OpticalSizingDemo() {
  useRobotoFlex();
  const [idx, setIdx] = React.useState(0);
  const selected = OPTIONS[idx];

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-8 py-9">
      <span
        role="img"
        aria-label={
          selected.isBroken
            ? "Optical sizing disabled"
            : "Optical sizing applied"
        }
        className={cn(
          "absolute top-4 right-4 size-2 rounded-full transition-colors duration-200",
          selected.isBroken ? "bg-red-400" : "bg-emerald-400",
        )}
      />

      <div
        role="radiogroup"
        aria-label="Optical sizing"
        className="mb-6 flex flex-wrap gap-2"
      >
        {OPTIONS.map((opt, i) => {
          const active = i === idx;
          return (
            <button
              key={opt.label}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setIdx(i)}
              className={cn(
                "rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
                active &&
                  opt.isBroken &&
                  "border-red-400/40 bg-red-400/10 text-red-300",
                active &&
                  !opt.isBroken &&
                  "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
                !active &&
                  "border-border/60 text-muted-foreground hover:text-foreground hover:border-border bg-transparent",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <p
        aria-live="polite"
        className="text-muted-foreground mb-7 min-h-[3.5rem] text-sm leading-relaxed"
      >
        {selected.desc}
      </p>

      <div
        className="border-border/60 bg-muted/20 flex flex-col items-center gap-5 rounded-xl border px-6 py-10"
        style={{
          fontFamily: ROBOTO_FLEX_STACK,
          ...selected.style,
        }}
      >
        <span className="text-foreground text-7xl font-medium tracking-tight">
          Aa
        </span>
        <span className="text-foreground/85 max-w-sm text-center text-xs leading-snug">
          The quick brown fox jumps over the lazy dog at 12 px caption size.
        </span>
      </div>
    </figure>
  );
}
