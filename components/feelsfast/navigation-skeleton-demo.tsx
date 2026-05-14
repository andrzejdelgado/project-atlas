"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Strategy = "progressbar" | "skeleton";
type State = "idle" | "navigating" | "done";

const DURATION = 2200;

export function NavigationSkeletonDemo() {
  const [strategy, setStrategy] = React.useState<Strategy>("skeleton");
  const [state, setState] = React.useState<State>("idle");
  const [progress, setProgress] = React.useState(0);
  const raf = React.useRef<number | null>(null);

  React.useEffect(() => () => {
    if (raf.current) cancelAnimationFrame(raf.current);
  }, []);

  const navigate = () => {
    setState("navigating");
    setProgress(0);
    const start = performance.now();
    const tick = (t: number) => {
      const pct = Math.min(1, (t - start) / DURATION);
      setProgress(pct);
      if (pct < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setState("done");
      }
    };
    raf.current = requestAnimationFrame(tick);
  };

  const reset = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    setState("idle");
    setProgress(0);
  };

  const showProgress = strategy === "progressbar";
  const showSkeleton = strategy === "skeleton" && state === "navigating";
  const showContent = state === "done";

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-6 py-7 sm:px-8 sm:py-9">
      <span
        role="img"
        aria-label="Navigation skeleton"
        className="bg-emerald-500 dark:bg-emerald-400 absolute top-4 right-4 size-2 rounded-full"
      />

      <div
        role="radiogroup"
        aria-label="Loading strategy"
        className="mb-5 flex flex-wrap gap-2"
      >
        <button
          type="button"
          role="radio"
          aria-checked={strategy === "progressbar"}
          onClick={() => {
            setStrategy("progressbar");
            reset();
          }}
          className={cn(
            "rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
            strategy === "progressbar"
              ? "border-red-500/40 bg-red-500/10 text-red-700 dark:border-red-400/45 dark:bg-red-400/12 dark:text-red-300"
              : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border bg-transparent",
          )}
        >
          Top-edge progress bar
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={strategy === "skeleton"}
          onClick={() => {
            setStrategy("skeleton");
            reset();
          }}
          className={cn(
            "rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
            strategy === "skeleton"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/45 dark:bg-emerald-400/12 dark:text-emerald-300"
              : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border bg-transparent",
          )}
        >
          In-component skeleton
        </button>
      </div>

      <div className="border-border/60 bg-secondary/15 relative overflow-hidden rounded-xl border">
        {/* Top-edge progress */}
        {showProgress && state !== "idle" && (
          <div
            aria-hidden="true"
            className="bg-secondary/30 absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden"
          >
            <div
              className="h-full bg-gradient-to-r from-transparent via-red-500/80 to-red-500 dark:via-red-400/80 dark:to-red-400"
              style={{ width: `${progress * 100}%`, transition: "width 60ms linear" }}
            />
          </div>
        )}

        {/* Window chrome */}
        <div className="border-border/60 flex items-center gap-2 border-b px-4 py-2">
          <span className="size-2 rounded-full bg-red-400/70" />
          <span className="size-2 rounded-full bg-amber-400/70" />
          <span className="size-2 rounded-full bg-emerald-400/70" />
          <span className="text-muted-foreground/55 ml-3 font-mono text-2xs">
            atlas.app/players
          </span>
        </div>

        <div className="p-5">
          {state === "idle" ? (
            <PlayerCards />
          ) : showSkeleton ? (
            <PlayerCardsSkeleton />
          ) : showContent ? (
            <PlayerCards />
          ) : (
            // strategy === progressbar + navigating: show prev content frozen
            <PlayerCards muted />
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini">
          {strategy === "skeleton"
            ? "skeleton matches final layout · wait feels filled"
            : "progress hangs at the top · content sits frozen"}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={navigate}
            disabled={state === "navigating"}
            className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/45 dark:bg-emerald-400/12 dark:text-emerald-300 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors disabled:opacity-50"
          >
            Navigate
          </button>
          <button
            type="button"
            onClick={reset}
            className="border-border/60 text-muted-foreground hover:text-foreground inline-flex items-center gap-2 rounded-full border bg-transparent px-3 py-1.5 font-mono text-xs transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </figure>
  );
}

function PlayerCards({ muted = false }: { muted?: boolean }) {
  return (
    <div className={cn("space-y-2.5", muted && "opacity-55")}>
      {[
        { name: "Player A1842", meta: "Active · Lithuania", balance: "€312.40" },
        { name: "Player C0593", meta: "Active · Spain", balance: "€78.10" },
        { name: "Player F2208", meta: "VIP · Italy", balance: "€1,840.00" },
      ].map((p) => (
        <div
          key={p.name}
          className="border-border/60 bg-card/70 flex items-center justify-between rounded-md border px-3.5 py-2.5"
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-foreground text-sm font-medium">
              {p.name}
            </span>
            <span className="text-muted-foreground/70 font-mono text-2xs uppercase tracking-mini">
              {p.meta}
            </span>
          </div>
          <span className="text-foreground/85 font-mono text-xs tabular-nums">
            {p.balance}
          </span>
        </div>
      ))}
    </div>
  );
}

function PlayerCardsSkeleton() {
  return (
    <div className="space-y-2.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="border-border/60 bg-card/60 flex items-center justify-between rounded-md border px-3.5 py-2.5"
        >
          <div className="flex flex-col gap-1.5">
            <div className="bg-secondary/60 h-3 w-24 animate-pulse rounded" />
            <div className="bg-secondary/50 h-2.5 w-32 animate-pulse rounded" />
          </div>
          <div className="bg-secondary/60 h-3 w-14 animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}
