"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export function PreActionFeedbackDemo() {
  const [coldPressed, setColdPressed] = React.useState(false);
  const [warmPressed, setWarmPressed] = React.useState(false);

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-6 py-7 sm:px-8 sm:py-9">
      <span
        role="img"
        aria-label="Pre-action feedback"
        className="bg-emerald-500 dark:bg-emerald-400 absolute top-4 right-4 size-2 rounded-full"
      />

      <p className="text-muted-foreground mb-5 max-w-[58ch] text-sm leading-relaxed">
        Press both buttons. The right one extends the perceived
        responsiveness by acknowledging the press within ~50 ms — the user
        holds the button longer because the system already told them it
        was listening.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onPointerDown={() => setColdPressed(true)}
          onPointerUp={() => setColdPressed(false)}
          onPointerLeave={() => setColdPressed(false)}
          className="border-red-500/40 bg-red-500/8 dark:border-red-400/45 dark:bg-red-400/10 flex flex-col items-start gap-1 rounded-xl border px-4 py-4 text-left"
        >
          <span className="text-red-700 dark:text-red-300 font-mono text-2xs uppercase tracking-mini">
            no feedback
          </span>
          <span
            className={cn(
              "text-foreground inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-none",
              "border-border bg-secondary/40",
            )}
          >
            {coldPressed ? "(still nothing)" : "Press me"}
          </span>
          <span className="text-muted-foreground/70 font-mono text-2xs">
            no visual response on press
          </span>
        </button>

        <button
          type="button"
          onPointerDown={() => setWarmPressed(true)}
          onPointerUp={() => setWarmPressed(false)}
          onPointerLeave={() => setWarmPressed(false)}
          className="border-emerald-500/40 bg-emerald-500/8 dark:border-emerald-400/45 dark:bg-emerald-400/10 flex flex-col items-start gap-1 rounded-xl border px-4 py-4 text-left"
        >
          <span className="text-emerald-700 dark:text-emerald-300 font-mono text-2xs uppercase tracking-mini">
            :active feedback
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-150",
              warmPressed
                ? "border-emerald-500/55 bg-emerald-500/15 text-emerald-700 dark:border-emerald-400/55 dark:bg-emerald-400/18 dark:text-emerald-200 scale-[0.97]"
                : "border-border bg-secondary/40 text-foreground",
            )}
          >
            {warmPressed ? "Acknowledged" : "Press me"}
          </span>
          <span className="text-muted-foreground/70 font-mono text-2xs">
            scale + colour shift within ~50 ms
          </span>
        </button>
      </div>

      <p className="text-muted-foreground/65 mt-4 font-mono text-2xs uppercase tracking-mini">
        feedback within ~50 ms · adds ~50 ms of perceived budget
      </p>
    </figure>
  );
}
