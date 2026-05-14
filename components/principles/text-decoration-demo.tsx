"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Mode = "default" | "refined";

const LINK_BASE =
  "text-foreground decoration-foreground/55 hover:decoration-emerald-400 underline transition-colors";

type ToggleChipProps = {
  label: string;
  active: boolean;
  onToggle: () => void;
};

function ToggleChip({ label, active, onToggle }: ToggleChipProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={active}
      onClick={onToggle}
      className={cn(
        "rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
        active
          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
          : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border bg-transparent",
      )}
    >
      {label}
    </button>
  );
}

export function TextDecorationDemo() {
  const [mode, setMode] = React.useState<Mode>("default");
  const [offset, setOffset] = React.useState(false);
  const [thickness, setThickness] = React.useState(false);
  const [dashed, setDashed] = React.useState(false);
  const [skipInk, setSkipInk] = React.useState(false);

  const isRefined = mode === "refined";

  const setModeAndReset = (m: Mode) => {
    setMode(m);
    setOffset(false);
    setThickness(false);
    setDashed(false);
    setSkipInk(false);
  };

  const linkStyle: React.CSSProperties = {
    textDecorationThickness: isRefined && thickness ? "1px" : "2px",
    textUnderlineOffset: isRefined && offset ? "0.22em" : "0",
    textDecorationStyle: isRefined && dashed ? "dashed" : "solid",
    textDecorationSkipInk: isRefined && skipInk ? "auto" : "none",
  };

  const link = (text: React.ReactNode) => (
    <a href="#" style={linkStyle} className={LINK_BASE}>
      {text}
    </a>
  );

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-8 py-9">
      <span
        role="img"
        aria-label={isRefined ? "Refined underline" : "Default underline"}
        className={cn(
          "absolute top-4 right-4 size-2 rounded-full transition-colors duration-200",
          isRefined ? "bg-emerald-400" : "bg-red-400",
        )}
      />

      <div
        role="radiogroup"
        aria-label="Underline mode"
        className="mb-3 flex flex-wrap gap-2"
      >
        <button
          type="button"
          role="radio"
          aria-checked={!isRefined}
          onClick={() => setModeAndReset("default")}
          className={cn(
            "rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
            !isRefined
              ? "border-red-400/40 bg-red-400/10 text-red-300"
              : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border bg-transparent",
          )}
        >
          Default
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={isRefined}
          onClick={() => setModeAndReset("refined")}
          className={cn(
            "rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
            isRefined
              ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
              : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border bg-transparent",
          )}
        >
          Refined
        </button>
      </div>

      {isRefined ? (
        <div
          role="group"
          aria-label="Refinement options"
          className="mb-7 flex flex-wrap gap-2"
        >
          <ToggleChip
            label="+ offset"
            active={offset}
            onToggle={() => setOffset((v) => !v)}
          />
          <ToggleChip
            label="+ thickness"
            active={thickness}
            onToggle={() => setThickness((v) => !v)}
          />
          <ToggleChip
            label="+ dashed"
            active={dashed}
            onToggle={() => setDashed((v) => !v)}
          />
          <ToggleChip
            label="+ skip-ink"
            active={skipInk}
            onToggle={() => setSkipInk((v) => !v)}
          />
        </div>
      ) : (
        <div className="mb-7" />
      )}

      <p className="text-foreground/85 text-base leading-7">
        A paragraph about {link("jumping foxes")},{" "}
        {link("quirky typography")}, and {link("paragraph rhythm")} — notice
        how the underline cuts straight through the descenders of <em>j</em>,{" "}
        <em>p</em>, <em>q</em>, <em>g</em>, and <em>y</em>. The same issue
        spreads across{" "}
        {link(
          "any link long enough to wrap across multiple lines, dragging its underline through every g and y in its path",
        )}{" "}
        — every dropped tail, every angled descender picks up a horizontal
        slash.
      </p>
    </figure>
  );
}
