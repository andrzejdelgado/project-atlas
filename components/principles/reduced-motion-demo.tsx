"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export function ReducedMotionDemo() {
  const [running, setRunning] = React.useState(true);

  return (
    <figure className="mt-6 flex flex-col gap-5">
      <style>{`
        @keyframes rm-full {
          0%   { opacity: 0; transform: translateX(-32px) scale(0.85); }
          25%  { opacity: 1; transform: translateX(0) scale(1); }
          75%  { opacity: 1; transform: translateX(0) scale(1); }
          100% { opacity: 0; transform: translateX(32px) scale(0.85); }
        }
        @keyframes rm-fade {
          0%   { opacity: 0; }
          25%  { opacity: 1; }
          75%  { opacity: 1; }
          100% { opacity: 0; }
        }
        .rm-loop-full { animation: rm-full 3s ease-in-out infinite; }
        .rm-loop-fade { animation: rm-fade 3s ease-in-out infinite; }
        .rm-paused { animation-play-state: paused; }
      `}</style>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border-border bg-card/40 relative flex h-44 flex-col items-center justify-center gap-4 rounded-2xl border px-7">
          <span
            role="img"
            aria-label="Full motion"
            className="bg-red-500 dark:bg-red-400 absolute top-4 right-4 size-2 rounded-full"
          />
          <span
            aria-hidden="true"
            className={cn(
              "rm-loop-full bg-red-500/85 dark:bg-red-400/85 block size-16 rounded-2xl",
              !running && "rm-paused",
            )}
          />
          <span className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini">
            full motion
          </span>
        </div>

        <div className="border-border bg-card/40 relative flex h-44 flex-col items-center justify-center gap-4 rounded-2xl border px-7">
          <span
            role="img"
            aria-label="Opacity-only motion"
            className="bg-emerald-500 dark:bg-emerald-400 absolute top-4 right-4 size-2 rounded-full"
          />
          <span
            aria-hidden="true"
            className={cn(
              "rm-loop-fade bg-emerald-500/85 dark:bg-emerald-400/85 block size-16 rounded-2xl",
              !running && "rm-paused",
            )}
          />
          <span className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini">
            reduced motion
          </span>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="border-border/60 bg-transparent text-muted-foreground hover:text-foreground hover:border-border inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors"
        >
          {running ? "Pause" : "Play"}
        </button>
      </div>
    </figure>
  );
}
