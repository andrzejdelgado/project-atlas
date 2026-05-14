"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Preset = {
  id: string;
  label: string;
  timing: string;
  duration: number;
  desc: string;
};

const PRESETS: Preset[] = [
  {
    id: "ease-out",
    label: "ease-out",
    timing: "cubic-bezier(0.22, 1, 0.36, 1)",
    duration: 300,
    desc: "Standard cubic-bezier — fast start, settles smoothly. No overshoot.",
  },
  {
    id: "smooth",
    label: "linear() smooth",
    timing:
      "linear(0, 0.2, 0.5, 0.78, 0.92, 0.99, 1)",
    duration: 360,
    desc: "Spring with high damping — softens the curve without bouncing.",
  },
  {
    id: "spring",
    label: "linear() spring",
    timing:
      "linear(0, 0.18, 0.52, 0.84, 1.04, 1.08, 1.04, 1.01, 1)",
    duration: 520,
    desc: "Light overshoot then settles. Best for popovers, chips, sheets.",
  },
  {
    id: "bounce",
    label: "linear() bounce",
    timing:
      "linear(0, 0.22, 0.6, 0.96, 1.14, 1.22, 1.16, 1.05, 0.97, 1.02, 1)",
    duration: 700,
    desc: "Aggressive overshoot. Reserve for playful UI, never for productivity.",
  },
];

export function SpringDemo() {
  const [preset, setPreset] = React.useState<Preset>(PRESETS[0]);
  const [animKey, setAnimKey] = React.useState(0);

  const selectPreset = (p: Preset) => {
    setPreset(p);
    setAnimKey((k) => k + 1);
  };

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-8 py-9">
      <span
        role="img"
        aria-label="Spring physics easing"
        className="bg-emerald-500 dark:bg-emerald-400 absolute top-4 right-4 size-2 rounded-full"
      />

      <div
        role="radiogroup"
        aria-label="Easing preset"
        className="mb-6 flex flex-wrap gap-2"
      >
        {PRESETS.map((p) => {
          const active = p.id === preset.id;
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => selectPreset(p)}
              className={cn(
                "rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
                active
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border bg-transparent",
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <p
        aria-live="polite"
        className="text-muted-foreground mb-7 min-h-[3rem] text-sm leading-relaxed"
      >
        {preset.desc}
      </p>

      <div className="border-border/60 bg-muted/15 relative flex h-56 items-center justify-center rounded-xl border">
        <div
          key={animKey}
          className="bg-card border-border/70 flex flex-col gap-2 rounded-2xl border px-5 py-4 shadow-2xl"
          style={{
            animation: `spring-pop ${preset.duration}ms ${preset.timing} both`,
            minWidth: 240,
          }}
        >
          <span className="text-foreground text-sm font-semibold">
            Snapshot saved
          </span>
          <span className="text-muted-foreground/80 text-xs">
            Available in Reports → Archived.
          </span>
        </div>
        <style>{`
          @keyframes spring-pop {
            from { opacity: 0; transform: translateY(20px) scale(0.85); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
      </div>

      <div className="mt-5 flex items-center justify-center">
        <span className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini">
          {preset.duration}ms · {preset.label}
        </span>
      </div>
    </figure>
  );
}
