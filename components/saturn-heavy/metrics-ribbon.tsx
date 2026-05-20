"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type Mode = "mobile" | "desktop";

type MetricRow = {
  key: "lcp" | "fcp" | "ttfb";
  abbr: string;
  full: string;
  legacy: string;
  next: string;
  delta: string;
};

// Desktop values are placeholders; swap with the real CrUX desktop deltas
// when you have them.
const DATA: Record<Mode, MetricRow[]> = {
  mobile: [
    { key: "lcp", abbr: "LCP", full: "Largest Contentful Paint", legacy: "3.9 s", next: "1.8 s", delta: "−54%" },
    { key: "fcp", abbr: "FCP", full: "First Contentful Paint", legacy: "3.4 s", next: "1.0 s", delta: "−71%" },
    { key: "ttfb", abbr: "TTFB", full: "Time to First Byte", legacy: "3.3 s", next: "0.7 s", delta: "−79%" },
  ],
  desktop: [
    { key: "lcp", abbr: "LCP", full: "Largest Contentful Paint", legacy: "2.4 s", next: "1.5 s", delta: "−38%" },
    { key: "fcp", abbr: "FCP", full: "First Contentful Paint", legacy: "1.6 s", next: "1.1 s", delta: "−31%" },
    { key: "ttfb", abbr: "TTFB", full: "Time to First Byte", legacy: "1.6 s", next: "0.7 s", delta: "−56%" },
  ],
};

function parseSeconds(s: string): number {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

export function MetricsRibbon() {
  const [mode, setMode] = React.useState<Mode>("mobile");
  const rows = DATA[mode];

  return (
    <figure className="border-border bg-card/40 relative mt-6 overflow-hidden rounded-2xl border p-6 sm:p-8">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-muted-foreground/70 font-mono text-2xs uppercase tracking-mini">
          Real-user performance · CrUX field data
        </span>
      </div>

      <h2 className="text-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-2xl font-semibold tracking-tight sm:text-3xl">
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            className="bg-emerald-500 dark:bg-emerald-400 size-2.5 shrink-0 rounded-full"
          />
          Saturn Heavy
        </span>
        <span className="text-muted-foreground/60">vs</span>
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            className="bg-red-500 dark:bg-red-400 size-2.5 shrink-0 rounded-full"
          />
          Gargantua
        </span>
      </h2>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        Two equivalently-sized brands measured side by side.
      </p>

      <div
        role="tablist"
        aria-label="Form factor"
        className="border-border/60 bg-secondary/15 mt-7 flex h-10 overflow-hidden rounded-xl border"
      >
        {(["mobile", "desktop"] as Mode[]).map((m) => {
          const active = m === mode;
          return (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setMode(m)}
              className={cn(
                "group relative flex flex-1 items-center justify-center transition-colors duration-200",
                active
                  ? "bg-emerald-500/12 dark:bg-emerald-400/12"
                  : "hover:bg-secondary/40",
              )}
            >
              <span
                className={cn(
                  "font-mono text-2xs uppercase tracking-mini transition-colors",
                  active
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-muted-foreground/65 group-hover:text-foreground",
                )}
              >
                {m}
              </span>
              {active && (
                <span
                  aria-hidden="true"
                  className="bg-emerald-500 dark:bg-emerald-400 pointer-events-none absolute inset-x-0 bottom-0 h-0.5"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {rows.map((m) => {
          const gainPct = Math.min(
            100,
            Math.max(
              0,
              Math.abs(parseInt(m.delta.replace(/[^0-9-]/g, ""), 10) || 0),
            ),
          );
          return (
            <article
              key={m.key}
              aria-label={`${m.full} reduced ${m.delta} from ${m.legacy} to ${m.next}`}
              className="border-border/60 bg-background/40 flex flex-col gap-3 rounded-xl border p-4 sm:p-5"
            >
              <p className="text-foreground/95 min-w-0 truncate text-sm font-medium tracking-tight">
                {m.full}
                <span className="text-muted-foreground ml-2 font-mono uppercase tracking-mini">
                  {m.abbr}
                </span>
              </p>
              <div className="flex items-center justify-between gap-3">
                <p className="inline-flex items-center gap-2 font-mono text-sm font-semibold tabular-nums tracking-tight">
                  <span className="text-red-600 dark:text-red-400">
                    {m.legacy}
                  </span>
                  <ArrowRight
                    className="text-muted-foreground/55 size-3.5"
                    aria-hidden="true"
                  />
                  <span className="text-emerald-700 dark:text-emerald-300">
                    {m.next}
                  </span>
                </p>
                <p
                  aria-hidden="true"
                  className="text-foreground shrink-0 text-sm font-semibold"
                  style={{ fontFeatureSettings: '"tnum", "ss02"' }}
                >
                  {m.delta}
                </p>
              </div>
              <div
                className="bg-foreground/[0.06] relative h-1 w-full overflow-hidden rounded-full"
                role="presentation"
                aria-hidden="true"
              >
                <div
                  className="bg-emerald-500 dark:bg-emerald-400 absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 ease-out"
                  style={{ width: `${gainPct}%` }}
                />
              </div>
            </article>
          );
        })}
      </div>
    </figure>
  );
}
