"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const LANES: {
  label: string;
  timing: string;
  tone: "ok" | "edge" | "bad";
}[] = [
  { label: "linear", timing: "linear", tone: "bad" },
  { label: "ease-in", timing: "ease-in", tone: "bad" },
  { label: "ease", timing: "ease", tone: "edge" },
  { label: "ease-out", timing: "ease-out", tone: "ok" },
  {
    label: "cubic-bezier(0, 0, 0.3, 1)",
    timing: "cubic-bezier(0, 0, 0.3, 1)",
    tone: "ok",
  },
];

const TONE_CLASS: Record<
  "ok" | "edge" | "bad",
  { dot: string; text: string }
> = {
  ok: {
    dot: "bg-emerald-500 dark:bg-emerald-400",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  edge: {
    dot: "bg-amber-500 dark:bg-amber-400",
    text: "text-amber-700 dark:text-amber-400",
  },
  bad: {
    dot: "bg-red-500 dark:bg-red-400",
    text: "text-red-700 dark:text-red-300",
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

export function EaseOutDemo() {
  const [runKey, setRunKey] = React.useState(0);
  const replay = () => setRunKey((k) => k + 1);

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-8 py-9">
      <span
        role="img"
        aria-label="Easing comparison"
        className="bg-emerald-500 dark:bg-emerald-400 absolute top-4 right-4 size-2 rounded-full"
      />

      <style>{`
        @keyframes ease-out-run {
          from { left: 0; }
          to { left: calc(100% - 16px); }
        }
        .ease-out-runner {
          animation-name: ease-out-run;
          animation-duration: 700ms;
          animation-fill-mode: forwards;
        }
      `}</style>

      <div className="border-border/60 bg-muted/15 mb-5 flex flex-col gap-4 rounded-xl border px-5 py-6">
        {LANES.map((lane) => {
          const tone = TONE_CLASS[lane.tone];
          return (
            <div key={lane.label} className="flex items-center gap-4">
              <span
                className={cn(
                  "w-44 shrink-0 truncate font-mono text-xs",
                  tone.text,
                )}
              >
                {lane.label}
              </span>
              <div
                key={`${lane.label}-${runKey}`}
                className="border-border/40 bg-secondary/40 relative h-4 flex-1 overflow-hidden rounded-full"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "ease-out-runner absolute top-1/2 left-0 size-4 -translate-y-1/2 rounded-full",
                    tone.dot,
                  )}
                  style={{ animationTimingFunction: lane.timing }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini">
          ease-out feels instant; ease-in feels late
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
