"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const LANES: { ms: number; label: string; tone: "ok" | "edge" | "bad" }[] = [
  { ms: 100, label: "instant", tone: "ok" },
  { ms: 200, label: "snappy", tone: "ok" },
  { ms: 300, label: "smooth", tone: "ok" },
  { ms: 400, label: "limit", tone: "edge" },
  { ms: 800, label: "sluggish", tone: "bad" },
];

const TONE_CLASS: Record<
  "ok" | "edge" | "bad",
  { dot: string; text: string; track: string }
> = {
  ok: {
    dot: "bg-emerald-500 dark:bg-emerald-400",
    text: "text-emerald-700 dark:text-emerald-300",
    track: "bg-emerald-400/30",
  },
  edge: {
    dot: "bg-amber-500 dark:bg-amber-400",
    text: "text-amber-700 dark:text-amber-400",
    track: "bg-amber-400/30",
  },
  bad: {
    dot: "bg-red-500 dark:bg-red-400",
    text: "text-red-700 dark:text-red-300",
    track: "bg-red-400/30",
  },
};

function ReplayIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}

export function AnimationDurationDemo() {
  const [runKey, setRunKey] = React.useState(0);
  const replay = () => setRunKey((k) => k + 1);

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-8 py-9">
      <span
        role="img"
        aria-label="Animation duration scale"
        className="bg-emerald-500 dark:bg-emerald-400 absolute top-4 right-4 size-2 rounded-full"
      />

      <style>{`
        @keyframes anim-dur-run {
          from { left: 0; }
          to { left: calc(100% - 16px); }
        }
        .anim-dur-runner {
          animation-name: anim-dur-run;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          animation-fill-mode: forwards;
        }
      `}</style>

      <div className="border-border/60 bg-muted/15 mb-5 flex flex-col gap-4 rounded-xl border px-5 py-6">
        {LANES.map((lane) => {
          const tone = TONE_CLASS[lane.tone];
          return (
            <div key={lane.ms} className="flex items-center gap-4">
              <div className="flex w-20 shrink-0 items-baseline gap-1.5 font-mono">
                <span className="text-foreground text-xs tabular-nums">
                  {lane.ms}
                </span>
                <span className="text-muted-foreground/55 text-2xs">ms</span>
              </div>
              <div
                key={`${lane.ms}-${runKey}`}
                className="border-border/40 bg-secondary/40 relative h-4 flex-1 overflow-hidden rounded-full"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "anim-dur-runner absolute top-1/2 left-0 size-4 -translate-y-1/2 rounded-full",
                    tone.dot,
                  )}
                  style={{ animationDuration: `${lane.ms}ms` }}
                />
              </div>
              <span
                className={cn(
                  "w-20 shrink-0 font-mono text-2xs uppercase tracking-mini",
                  tone.text,
                )}
              >
                {lane.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini">
          past 400ms reads as waiting
        </span>
        <button
          type="button"
          onClick={replay}
          className="border-emerald-400/40 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-400/15 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors"
        >
          <ReplayIcon />
          Replay
        </button>
      </div>
    </figure>
  );
}
