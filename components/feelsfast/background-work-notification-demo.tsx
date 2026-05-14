"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type State = "idle" | "queued" | "navigated" | "ready";

const TASK_DURATION = 3200;

export function BackgroundWorkNotificationDemo() {
  const [state, setState] = React.useState<State>("idle");
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = React.useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  React.useEffect(() => () => clear(), [clear]);

  const start = () => {
    clear();
    setState("queued");
    timers.current.push(
      setTimeout(() => setState("navigated"), 900),
    );
    timers.current.push(
      setTimeout(() => setState("ready"), TASK_DURATION),
    );
  };

  const dismiss = () => {
    setState("idle");
  };

  const reset = () => {
    clear();
    setState("idle");
  };

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-6 py-7 sm:px-8 sm:py-9">
      <span
        role="img"
        aria-label="Background work notification"
        className="bg-emerald-500 dark:bg-emerald-400 absolute top-4 right-4 size-2 rounded-full"
      />

      <p className="text-muted-foreground mb-5 max-w-[58ch] text-sm leading-relaxed">
        Above ten seconds, the user doesn't need to sit still. Acknowledge,
        let them navigate, then notify when it's done.
      </p>

      <div className="border-border/60 bg-muted/15 relative overflow-hidden rounded-xl border">
        <div className="border-border/60 flex items-center gap-2 border-b px-4 py-2">
          <span className="size-2 rounded-full bg-red-400/70" />
          <span className="size-2 rounded-full bg-amber-400/70" />
          <span className="size-2 rounded-full bg-emerald-400/70" />
          <span className="text-muted-foreground/55 ml-3 font-mono text-2xs">
            atlas.app/exports
          </span>
        </div>

        <div className="p-5">
          {state === "idle" || state === "queued" ? (
            <div className="space-y-3">
              <h3 className="text-foreground text-base font-semibold">
                Export · December players report
              </h3>
              <p className="text-muted-foreground text-sm">
                12,408 rows · CSV · estimated ~3 seconds.
              </p>
              <button
                type="button"
                onClick={start}
                disabled={state === "queued"}
                className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/45 dark:bg-emerald-400/12 dark:text-emerald-300 inline-flex items-center gap-2 rounded-md border px-3 py-2 font-mono text-xs uppercase tracking-mini transition-colors disabled:opacity-50"
              >
                {state === "queued" ? "Queued…" : "Start export"}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-foreground text-base font-semibold">
                Player overview
              </h3>
              <p className="text-muted-foreground text-sm">
                You navigated away. The export keeps running in the background.
              </p>
              <div className="border-border/55 bg-card/70 rounded-md border px-3.5 py-2.5">
                <p className="text-muted-foreground/70 font-mono text-2xs uppercase tracking-mini">
                  Today
                </p>
                <p className="text-foreground text-lg font-semibold tabular-nums">
                  €312,440
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {state === "queued" && (
        <div
          role="status"
          aria-live="polite"
          className="border-border/70 bg-background/70 mt-3 flex items-center gap-3 rounded-lg border px-3 py-2.5 shadow-sm"
        >
          <span
            aria-hidden="true"
            className="border-muted-foreground/40 border-t-foreground inline-block size-3.5 animate-spin rounded-full border-2"
          />
          <span className="text-foreground text-xs">
            Export started. Carry on — we'll notify you when it's ready.
          </span>
        </div>
      )}

      {state === "ready" && (
        <div
          role="status"
          aria-live="polite"
          className="mt-3 flex items-center gap-3 rounded-lg border border-emerald-500/45 bg-emerald-500/10 px-3 py-2.5 shadow-sm dark:border-emerald-400/45 dark:bg-emerald-400/12"
        >
          <span
            aria-hidden="true"
            className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-500 text-white dark:bg-emerald-400"
          >
            <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <div className="flex-1">
            <p className="text-foreground text-xs font-semibold">
              Export ready · December-players.csv
            </p>
            <p className="text-muted-foreground/70 font-mono text-2xs">
              12,408 rows · 2.4 MB
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="text-muted-foreground hover:text-foreground font-mono text-2xs uppercase tracking-mini"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <p className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini">
          long waits should not pin the user in place
        </p>
        <button
          type="button"
          onClick={reset}
          className="border-border/60 text-muted-foreground hover:text-foreground inline-flex items-center gap-2 rounded-full border bg-transparent px-3 py-1.5 font-mono text-xs transition-colors"
        >
          Reset
        </button>
      </div>
    </figure>
  );
}
