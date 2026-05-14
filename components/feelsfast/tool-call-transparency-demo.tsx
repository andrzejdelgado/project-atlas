"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Mode = "opaque" | "transparent";

type Step = { label: string; duration: number };

const STEPS: Step[] = [
  { label: "Reading dataset…", duration: 900 },
  { label: "Filtering 12,408 rows…", duration: 1100 },
  { label: "Running 4 checks…", duration: 1300 },
  { label: "Drafting summary…", duration: 900 },
];

const TOTAL = STEPS.reduce((s, x) => s + x.duration, 0);

export function ToolCallTransparencyDemo() {
  const [mode, setMode] = React.useState<Mode>("transparent");
  const [running, setRunning] = React.useState(false);
  const [stepIdx, setStepIdx] = React.useState(-1);
  const [done, setDone] = React.useState(false);
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = React.useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  React.useEffect(() => () => clear(), [clear]);

  const start = () => {
    clear();
    setRunning(true);
    setDone(false);
    setStepIdx(-1);
    let cursor = 0;
    STEPS.forEach((step, i) => {
      cursor += step.duration;
      const t = setTimeout(() => {
        if (i === STEPS.length - 1) {
          setStepIdx(i);
          const done = setTimeout(() => {
            setDone(true);
            setRunning(false);
          }, 200);
          timers.current.push(done);
        } else {
          setStepIdx(i);
        }
      }, cursor - step.duration);
      timers.current.push(t);
    });
  };

  const reset = () => {
    clear();
    setStepIdx(-1);
    setDone(false);
    setRunning(false);
  };

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-6 py-7 sm:px-8 sm:py-9">
      <span
        role="img"
        aria-label="Tool-call transparency"
        className="bg-emerald-500 dark:bg-emerald-400 absolute top-4 right-4 size-2 rounded-full"
      />

      <div
        role="radiogroup"
        aria-label="Transparency strategy"
        className="mb-5 flex flex-wrap gap-2"
      >
        <button
          type="button"
          role="radio"
          aria-checked={mode === "opaque"}
          onClick={() => {
            setMode("opaque");
            reset();
          }}
          className={cn(
            "rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
            mode === "opaque"
              ? "border-red-500/40 bg-red-500/10 text-red-700 dark:border-red-400/45 dark:bg-red-400/12 dark:text-red-300"
              : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border bg-transparent",
          )}
        >
          Single "Loading…"
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={mode === "transparent"}
          onClick={() => {
            setMode("transparent");
            reset();
          }}
          className={cn(
            "rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
            mode === "transparent"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/45 dark:bg-emerald-400/12 dark:text-emerald-300"
              : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border bg-transparent",
          )}
        >
          Narrate tool calls
        </button>
      </div>

      <div className="border-border/60 bg-muted/15 min-h-[14rem] rounded-xl border px-5 py-5">
        {!running && !done && (
          <p className="text-muted-foreground/70 text-sm">
            Press <strong>Run agent</strong> to start a {Math.round(TOTAL / 1000)} s
            background task.
          </p>
        )}

        {mode === "opaque" && (running || done) && (
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="border-muted-foreground/40 border-t-foreground inline-block size-4 animate-spin rounded-full border-2"
            />
            <span className="text-foreground text-sm">
              {done ? "Done." : "Loading…"}
            </span>
          </div>
        )}

        {mode === "transparent" && (running || done) && (
          <ol className="space-y-1.5">
            {STEPS.map((s, i) => {
              const reached = stepIdx >= i || done;
              const inProgress = stepIdx === i && !done;
              const complete = done || stepIdx > i;
              return (
                <li key={s.label} className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "inline-flex size-4 shrink-0 items-center justify-center rounded-full border text-2xs font-mono",
                      complete &&
                        "border-emerald-500/50 bg-emerald-500/15 text-emerald-700 dark:border-emerald-400/50 dark:bg-emerald-400/15 dark:text-emerald-300",
                      inProgress &&
                        "border-muted-foreground/40 border-t-foreground animate-spin",
                      !reached && "border-border/55 text-muted-foreground/50",
                    )}
                  >
                    {complete ? "✓" : reached ? "" : i + 1}
                  </span>
                  <span
                    className={cn(
                      "text-sm transition-colors",
                      complete && "text-foreground/85",
                      inProgress && "text-foreground",
                      !reached && "text-muted-foreground/55",
                    )}
                  >
                    {s.label}
                  </span>
                </li>
              );
            })}
            {done && (
              <li className="text-muted-foreground/70 mt-3 font-mono text-2xs uppercase tracking-mini">
                Summary ready. Open report.
              </li>
            )}
          </ol>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini">
          narrating tool calls compresses retrospective duration
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={start}
            disabled={running}
            className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/45 dark:bg-emerald-400/12 dark:text-emerald-300 inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-xs transition-colors disabled:opacity-50"
          >
            Run agent
          </button>
          <button
            type="button"
            onClick={reset}
            className="border-border/60 text-muted-foreground hover:text-foreground inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border bg-transparent px-3 py-1.5 font-mono text-xs transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </figure>
  );
}
