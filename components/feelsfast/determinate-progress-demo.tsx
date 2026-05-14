"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const DURATION = 3000;

type LaneKey = "plain" | "decelerating" | "shimmer";

const LANES: { id: LaneKey; label: string; note: string; tone: "ok" | "edge" | "bad" }[] = [
  {
    id: "plain",
    label: "Linear bar",
    note: "Baseline. Honest, but the wait feels long.",
    tone: "edge",
  },
  {
    id: "decelerating",
    label: "Decelerating bar",
    note: "Same duration, eased — perceived ~12% faster.",
    tone: "ok",
  },
  {
    id: "shimmer",
    label: "Backwards-shimmer bar",
    note: "Bands moving backwards. Harrison et al. 2010.",
    tone: "ok",
  },
];

const TONE: Record<"ok" | "edge" | "bad", { fill: string; text: string }> = {
  ok: { fill: "bg-emerald-500 dark:bg-emerald-400", text: "text-emerald-700 dark:text-emerald-300" },
  edge: { fill: "bg-amber-500 dark:bg-amber-400", text: "text-amber-700 dark:text-amber-300" },
  bad: { fill: "bg-red-500 dark:bg-red-400", text: "text-red-700 dark:text-red-300" },
};

export function DeterminateProgressDemo() {
  const [runKey, setRunKey] = React.useState(0);

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-6 py-7 sm:px-8 sm:py-9">
      <span
        role="img"
        aria-label="Determinate progress"
        className="bg-emerald-500 dark:bg-emerald-400 absolute top-4 right-4 size-2 rounded-full"
      />

      <p className="text-muted-foreground mb-5 max-w-[58ch] text-sm leading-relaxed">
        Three bars, same {DURATION / 1000} s duration. Harrison et al. (2010)
        showed bars with backwards-shimmer or eased deceleration are
        perceived ~12% faster than a plain linear bar.
      </p>

      <style>{`
        @keyframes ff-fill {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes ff-shimmer-bg {
          from { background-position: 0 0; }
          to   { background-position: -36px 0; }
        }
        .ff-bar-plain {
          animation: ff-fill ${DURATION}ms linear forwards;
        }
        .ff-bar-decelerating {
          animation: ff-fill ${DURATION}ms cubic-bezier(0.1, 0.6, 0.25, 1) forwards;
        }
        .ff-bar-shimmer {
          animation: ff-fill ${DURATION}ms cubic-bezier(0.18, 0.55, 0.25, 1) forwards;
          background-image:
            linear-gradient(45deg, currentColor 25%, transparent 25%, transparent 50%, currentColor 50%, currentColor 75%, transparent 75%, transparent);
          background-size: 18px 18px;
          background-blend-mode: overlay;
          animation-name: ff-fill, ff-shimmer-bg;
          animation-duration: ${DURATION}ms, 320ms;
          animation-timing-function: cubic-bezier(0.18, 0.55, 0.25, 1), linear;
          animation-iteration-count: 1, infinite;
          animation-fill-mode: forwards, none;
        }
      `}</style>

      <div className="border-border/60 bg-muted/15 flex flex-col gap-5 rounded-xl border px-5 py-6">
        {LANES.map((lane) => {
          const tone = TONE[lane.tone];
          return (
            <div key={lane.id} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <span className={cn("font-mono text-xs", tone.text)}>
                  {lane.label}
                </span>
                <span className="text-muted-foreground/70 font-mono text-2xs">
                  {lane.note}
                </span>
              </div>
              <div className="border-border/40 bg-secondary/40 relative h-3 w-full overflow-hidden rounded-full">
                <div
                  key={`${lane.id}-${runKey}`}
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full",
                    tone.fill,
                    lane.id === "plain" && "ff-bar-plain",
                    lane.id === "decelerating" && "ff-bar-decelerating",
                    lane.id === "shimmer" && "ff-bar-shimmer",
                  )}
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini">
          fake progress bars are worse than no indicator at all
        </p>
        <button
          type="button"
          onClick={() => setRunKey((k) => k + 1)}
          className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/45 dark:bg-emerald-400/12 dark:text-emerald-300 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors"
        >
          Replay
        </button>
      </div>
    </figure>
  );
}
