"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Band = {
  id: "instant" | "responsive" | "engaged" | "long";
  label: string;
  range: string;
  examples: string[];
  tone: "violet" | "blue" | "amber" | "coral";
};

const BANDS: Band[] = [
  {
    id: "instant",
    label: "Instant",
    range: "0 – 100 ms",
    examples: ["Button press", "Tab focus", "Hover state"],
    tone: "violet",
  },
  {
    id: "responsive",
    label: "Responsive",
    range: "100 ms – 1 s",
    examples: ["Search filter", "Inline edit save", "Form validation"],
    tone: "blue",
  },
  {
    id: "engaged",
    label: "Engaged",
    range: "1 – 10 s",
    examples: ["Page transition", "Image upload", "Streaming response"],
    tone: "amber",
  },
  {
    id: "long",
    label: "Long",
    range: "10 s+",
    examples: ["Export to PDF", "Bulk import", "Agent tool call"],
    tone: "coral",
  },
];

const TONE: Record<Band["tone"], { dot: string; text: string; chip: string }> = {
  violet: {
    dot: "bg-violet-500 dark:bg-violet-400",
    text: "text-violet-700 dark:text-violet-300",
    chip: "border-violet-500/40 bg-violet-500/10 text-violet-700 dark:border-violet-400/45 dark:bg-violet-400/12 dark:text-violet-300",
  },
  blue: {
    dot: "bg-blue-500 dark:bg-blue-400",
    text: "text-blue-700 dark:text-blue-300",
    chip: "border-blue-500/40 bg-blue-500/10 text-blue-700 dark:border-blue-400/45 dark:bg-blue-400/12 dark:text-blue-300",
  },
  amber: {
    dot: "bg-amber-500 dark:bg-amber-400",
    text: "text-amber-700 dark:text-amber-300",
    chip: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:border-amber-400/45 dark:bg-amber-400/12 dark:text-amber-300",
  },
  coral: {
    dot: "bg-red-500 dark:bg-red-400",
    text: "text-red-700 dark:text-red-300",
    chip: "border-red-500/40 bg-red-500/10 text-red-700 dark:border-red-400/45 dark:bg-red-400/12 dark:text-red-300",
  },
};

export function TimeBandsDemo() {
  const [active, setActive] = React.useState<Band["id"]>("instant");
  const current = BANDS.find((b) => b.id === active) ?? BANDS[0];
  const tone = TONE[current.tone];

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-6 py-7 sm:px-8 sm:py-9">
      <span
        role="img"
        aria-label="Time bands"
        className="bg-emerald-500 dark:bg-emerald-400 absolute top-4 right-4 size-2 rounded-full"
      />

      <div
        role="radiogroup"
        aria-label="Time band"
        className="mb-6 flex flex-wrap gap-2"
      >
        {BANDS.map((b) => {
          const isActive = b.id === active;
          const t = TONE[b.tone];
          return (
            <button
              key={b.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setActive(b.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
                isActive
                  ? t.chip
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border bg-transparent",
              )}
            >
              {b.label}
            </button>
          );
        })}
      </div>

      <div className="border-border/60 bg-muted/15 rounded-xl border px-5 py-6">
        <div className="flex items-baseline justify-between gap-3">
          <span className={cn("font-mono text-xs uppercase tracking-mini", tone.text)}>
            {current.label}
          </span>
          <span className="text-muted-foreground/70 font-mono text-2xs tabular-nums">
            {current.range}
          </span>
        </div>
        <p className="text-foreground/85 mt-3 text-sm leading-relaxed">
          Typical interactions that fall in this band:
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {current.examples.map((ex) => (
            <li
              key={ex}
              className="border-border/55 bg-secondary/40 text-foreground/85 rounded-md border px-2.5 py-1 font-mono text-2xs"
            >
              {ex}
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
