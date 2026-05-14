"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Strategy = "cold" | "prefetch";

type Result = { strategy: Strategy; ms: number };

const PREFETCH_DURATION = 220;
const FETCH_DURATION = 540;

export function PrefetchOnHoverDemo() {
  const [hovering, setHovering] = React.useState<Strategy | null>(null);
  const [prefetched, setPrefetched] = React.useState(false);
  const [loading, setLoading] = React.useState<Strategy | null>(null);
  const [results, setResults] = React.useState<Result[]>([]);
  const prefetchTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (prefetchTimer.current) clearTimeout(prefetchTimer.current);
      if (fetchTimer.current) clearTimeout(fetchTimer.current);
    },
    [],
  );

  const onEnter = (s: Strategy) => () => {
    setHovering(s);
    if (s === "prefetch" && !prefetched) {
      prefetchTimer.current = setTimeout(() => setPrefetched(true), PREFETCH_DURATION);
    }
  };

  const onLeave = (s: Strategy) => () => {
    if (hovering === s) setHovering(null);
  };

  const onClick = (s: Strategy) => () => {
    const start = performance.now();
    setLoading(s);
    const wait = s === "prefetch" && prefetched ? 60 : FETCH_DURATION;
    fetchTimer.current = setTimeout(() => {
      setLoading(null);
      setResults((r) =>
        [{ strategy: s, ms: Math.round(performance.now() - start) }, ...r].slice(0, 6),
      );
    }, wait);
  };

  const reset = () => {
    setHovering(null);
    setPrefetched(false);
    setLoading(null);
    setResults([]);
  };

  const lastCold = results.find((r) => r.strategy === "cold");
  const lastPrefetch = results.find((r) => r.strategy === "prefetch");

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-6 py-7 sm:px-8 sm:py-9">
      <span
        role="img"
        aria-label="Prefetch on hover"
        className="bg-emerald-500 dark:bg-emerald-400 absolute top-4 right-4 size-2 rounded-full"
      />

      <p className="text-muted-foreground mb-5 max-w-[58ch] text-sm leading-relaxed">
        Hover the right link — the prefetch starts on hover-in and resolves
        before most users click. The cost is one extra request; the payoff
        is a click that registers as Instant rather than Responsive.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onPointerEnter={onEnter("cold")}
          onPointerLeave={onLeave("cold")}
          onClick={onClick("cold")}
          className="border-red-500/40 bg-red-500/8 dark:border-red-400/45 dark:bg-red-400/10 flex flex-col items-start gap-2 rounded-xl border px-4 py-4 text-left"
        >
          <span className="text-red-700 dark:text-red-300 font-mono text-2xs uppercase tracking-mini">
            cold · no prefetch
          </span>
          <span className="text-foreground text-sm font-semibold">
            /dashboard
          </span>
          <span className="text-muted-foreground/70 font-mono text-2xs">
            {loading === "cold" ? "loading…" : "click to fetch"}
          </span>
        </button>

        <button
          type="button"
          onPointerEnter={onEnter("prefetch")}
          onPointerLeave={onLeave("prefetch")}
          onClick={onClick("prefetch")}
          className="border-emerald-500/40 bg-emerald-500/8 dark:border-emerald-400/45 dark:bg-emerald-400/10 flex flex-col items-start gap-2 rounded-xl border px-4 py-4 text-left"
        >
          <span className="text-emerald-700 dark:text-emerald-300 font-mono text-2xs uppercase tracking-mini">
            prefetch on hover
          </span>
          <span className="text-foreground text-sm font-semibold">
            /dashboard
          </span>
          <span className="text-muted-foreground/70 font-mono text-2xs">
            {prefetched
              ? "ready"
              : hovering === "prefetch"
                ? "prefetching…"
                : loading === "prefetch"
                  ? "loading…"
                  : "hover, then click"}
          </span>
        </button>
      </div>

      <div className="border-border/60 bg-muted/15 mt-5 grid gap-3 rounded-xl border px-5 py-4 sm:grid-cols-2">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-red-700 dark:text-red-300 font-mono text-2xs uppercase tracking-mini">
            cold click
          </span>
          <span className="text-foreground font-mono text-sm tabular-nums">
            {lastCold ? `${lastCold.ms} ms` : "—"}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-emerald-700 dark:text-emerald-300 font-mono text-2xs uppercase tracking-mini">
            prefetched click
          </span>
          <span className="text-foreground font-mono text-sm tabular-nums">
            {lastPrefetch ? `${lastPrefetch.ms} ms` : "—"}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini">
          pick spots; don't preload everything
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
