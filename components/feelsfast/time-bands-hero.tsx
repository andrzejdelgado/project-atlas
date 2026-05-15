"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Band = {
  id: "instant" | "responsive" | "engaged" | "long";
  label: string;
  range: string;
  pattern: string;
  tone: "violet" | "blue" | "amber" | "coral";
  /** Visual share of the bar — visually skewed for readability, not real-scale. */
  weight: number;
};

const BANDS: Band[] = [
  {
    id: "instant",
    label: "Instant",
    range: "0–100ms",
    pattern: "Pre-action feedback. No spinner.",
    tone: "violet",
    weight: 18,
  },
  {
    id: "responsive",
    label: "Responsive",
    range: "100ms–1s",
    pattern: "Stale-while-revalidate. Cancellation.",
    tone: "blue",
    weight: 24,
  },
  {
    id: "engaged",
    label: "Engaged",
    range: "1–10s",
    pattern: "Skeleton. Determinate progress. Pacing.",
    tone: "amber",
    weight: 30,
  },
  {
    id: "long",
    label: "Long",
    range: "10s+",
    pattern: "Background work. Tool-call transparency.",
    tone: "coral",
    weight: 28,
  },
];

const TONE: Record<
  Band["tone"],
  { bg: string; ring: string; text: string; chip: string; dot: string }
> = {
  violet: {
    bg: "bg-violet-500/15 dark:bg-violet-400/20",
    ring: "ring-violet-500/30 dark:ring-violet-400/35",
    text: "text-violet-700 dark:text-violet-300",
    chip: "bg-violet-500/15 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300 border-violet-500/35 dark:border-violet-400/40",
    dot: "bg-violet-500 dark:bg-violet-400",
  },
  blue: {
    bg: "bg-blue-500/15 dark:bg-blue-400/20",
    ring: "ring-blue-500/30 dark:ring-blue-400/35",
    text: "text-blue-700 dark:text-blue-300",
    chip: "bg-blue-500/15 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300 border-blue-500/35 dark:border-blue-400/40",
    dot: "bg-blue-500 dark:bg-blue-400",
  },
  amber: {
    bg: "bg-amber-500/15 dark:bg-amber-400/20",
    ring: "ring-amber-500/30 dark:ring-amber-400/35",
    text: "text-amber-700 dark:text-amber-300",
    chip: "bg-amber-500/15 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300 border-amber-500/35 dark:border-amber-400/40",
    dot: "bg-amber-500 dark:bg-amber-400",
  },
  coral: {
    bg: "bg-red-500/15 dark:bg-red-400/20",
    ring: "ring-red-500/30 dark:ring-red-400/35",
    text: "text-red-700 dark:text-red-300",
    chip: "bg-red-500/15 text-red-700 dark:bg-red-400/15 dark:text-red-300 border-red-500/35 dark:border-red-400/40",
    dot: "bg-red-500 dark:bg-red-400",
  },
};

export function TimeBandsHero() {
  const [active, setActive] = React.useState<Band["id"]>("engaged");
  const current = BANDS.find((b) => b.id === active) ?? BANDS[2];
  const totalWeight = BANDS.reduce((s, b) => s + b.weight, 0);

  return (
    <figure className="border-border bg-card/40 relative mt-6 overflow-hidden rounded-2xl border p-6 sm:p-8">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-muted-foreground/70 font-mono text-2xs uppercase tracking-mini">
          Perceived performance · four time bands
        </span>
      </div>

      <h2 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
        Pick the right pattern for the right wait.
      </h2>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        Miller 1968, Card et al. 1991, Doherty 1982, Nielsen 1993. Four
        bands that have been settled for decades — and the patterns that
        actually fit each one.
      </p>

      <div
        role="tablist"
        aria-label="Time band"
        className="border-border/60 bg-secondary/15 mt-7 flex h-12 overflow-hidden rounded-xl border"
      >
        {BANDS.map((b) => {
          const tone = TONE[b.tone];
          const isActive = b.id === active;
          return (
            <button
              key={b.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(b.id)}
              className={cn(
                "group relative flex items-center justify-center transition-all duration-200",
                isActive ? tone.bg : "hover:bg-secondary/40",
              )}
              style={{ flex: b.weight }}
            >
              <span
                className={cn(
                  "font-mono text-2xs uppercase tracking-mini transition-colors",
                  isActive
                    ? tone.text
                    : "text-muted-foreground/65 group-hover:text-foreground",
                )}
              >
                {b.label}
              </span>
              {isActive && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute inset-x-0 bottom-0 h-0.5",
                    tone.dot,
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-2 grid grid-cols-4 gap-0 px-0">
        {BANDS.map((b) => (
          <div
            key={b.id}
            className="text-muted-foreground/55 px-0.5 text-center font-mono text-2xs tabular-nums whitespace-nowrap"
          >
            {b.range}
          </div>
        ))}
      </div>

      <div
        aria-live="polite"
        className={cn(
          "mt-5 flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors duration-200",
          TONE[current.tone].chip,
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "size-2 shrink-0 rounded-full",
            TONE[current.tone].dot,
          )}
        />
        <p className="font-mono text-2xs uppercase tracking-mini">
          {current.label} · {current.pattern}
        </p>
      </div>
    </figure>
  );
}
