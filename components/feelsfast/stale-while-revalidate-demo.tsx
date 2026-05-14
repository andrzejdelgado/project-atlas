"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Strategy = "cold" | "swr";

type Snapshot = { label: string; value: string };

const SNAPSHOTS: Snapshot[] = [
  { label: "Revenue · today", value: "$48,210" },
  { label: "Revenue · today", value: "$52,840" },
  { label: "Revenue · today", value: "$57,193" },
  { label: "Revenue · today", value: "$61,427" },
];

export function StaleWhileRevalidateDemo() {
  const [step, setStep] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [strategy, setStrategy] = React.useState<Strategy>("swr");
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const refresh = () => {
    setRefreshing(true);
    timer.current = setTimeout(() => {
      setStep((s) => (s + 1) % SNAPSHOTS.length);
      setRefreshing(false);
    }, 720);
  };

  const current = SNAPSHOTS[step];
  const showStale = strategy === "swr" && refreshing;
  const showSkeleton = strategy === "cold" && refreshing;

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-6 py-7 sm:px-8 sm:py-9">
      <span
        role="img"
        aria-label="Stale-while-revalidate"
        className="bg-emerald-500 dark:bg-emerald-400 absolute top-4 right-4 size-2 rounded-full"
      />

      <div
        role="radiogroup"
        aria-label="Refresh strategy"
        className="mb-6 flex flex-wrap gap-2"
      >
        <button
          type="button"
          role="radio"
          aria-checked={strategy === "cold"}
          onClick={() => setStrategy("cold")}
          className={cn(
            "rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
            strategy === "cold"
              ? "border-red-500/40 bg-red-500/10 text-red-700 dark:border-red-400/45 dark:bg-red-400/12 dark:text-red-300"
              : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border bg-transparent",
          )}
        >
          Cold reload
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={strategy === "swr"}
          onClick={() => setStrategy("swr")}
          className={cn(
            "rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
            strategy === "swr"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/45 dark:bg-emerald-400/12 dark:text-emerald-300"
              : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border bg-transparent",
          )}
        >
          Stale-while-revalidate
        </button>
      </div>

      <div className="border-border/60 bg-muted/15 relative rounded-xl border px-5 py-7">
        {showSkeleton ? (
          <div className="space-y-2">
            <div className="bg-secondary/50 h-3 w-32 animate-pulse rounded" />
            <div className="bg-secondary/50 h-7 w-44 animate-pulse rounded" />
            <div className="bg-secondary/50 h-2.5 w-52 animate-pulse rounded" />
          </div>
        ) : (
          <div className={cn("transition-opacity", showStale && "opacity-90")}>
            <span className="text-muted-foreground/70 font-mono text-2xs uppercase tracking-mini">
              {current.label}
            </span>
            <div className="text-foreground mt-1 text-2xl font-semibold tabular-nums">
              {current.value}
            </div>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
              Updated continuously from the revenue ledger.
            </p>
          </div>
        )}

        {showStale && (
          <div
            aria-live="polite"
            className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 font-mono text-2xs uppercase tracking-mini text-emerald-700 dark:border-emerald-400/45 dark:bg-emerald-400/12 dark:text-emerald-300"
          >
            <span
              aria-hidden="true"
              className="size-1.5 animate-pulse rounded-full bg-emerald-500 dark:bg-emerald-400"
            />
            refreshing
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini">
          {strategy === "swr"
            ? "stale data stays visible · subtle indicator says it's refreshing"
            : "data disappears · skeleton replaces it · attention is forced"}
        </p>
        <button
          type="button"
          onClick={refresh}
          disabled={refreshing}
          className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/45 dark:bg-emerald-400/12 dark:text-emerald-300 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors disabled:opacity-50"
        >
          Refresh
        </button>
      </div>
    </figure>
  );
}
