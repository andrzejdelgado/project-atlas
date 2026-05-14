"use client";

import * as React from "react";

const DURATION = 1800;

export function MotionContrastDemo() {
  const [runKey, setRunKey] = React.useState(0);

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-6 py-7 sm:px-8 sm:py-9">
      <span
        role="img"
        aria-label="Motion contrast"
        className="bg-emerald-500 dark:bg-emerald-400 absolute top-4 right-4 size-2 rounded-full"
      />

      <p className="text-muted-foreground mb-5 max-w-[58ch] text-sm leading-relaxed">
        Same distance, same duration. The low-contrast disc reads as slower —
        an effect first described by Anstis & Cavanagh (perceived velocity
        decreases with luminance contrast).
      </p>

      <style>{`
        @keyframes mc-slide {
          from { left: 8px; }
          to   { left: calc(100% - 36px); }
        }
        .mc-runner {
          animation: mc-slide ${DURATION}ms cubic-bezier(0.42, 0, 0.58, 1) forwards;
        }
      `}</style>

      <div className="border-border/60 bg-muted/15 flex flex-col gap-5 rounded-xl border px-5 py-7">
        <Lane label="High contrast" key={`hi-${runKey}`} color="bg-foreground" />
        <Lane label="Low contrast" key={`lo-${runKey}`} color="bg-muted-foreground/35" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini">
          identical distance, identical duration · perceived velocities differ
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

function Lane({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-muted-foreground/70 w-32 shrink-0 font-mono text-2xs uppercase tracking-mini">
        {label}
      </span>
      <div className="border-border/40 bg-secondary/30 relative h-7 flex-1 overflow-hidden rounded-full">
        <span
          aria-hidden="true"
          className={`mc-runner absolute top-1/2 size-5 -translate-y-1/2 rounded-full ${color}`}
          style={{ left: 8 }}
        />
      </div>
    </div>
  );
}
