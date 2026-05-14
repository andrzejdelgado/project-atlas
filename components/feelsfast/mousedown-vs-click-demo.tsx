"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Variant = "click" | "mousedown";

type Sample = { variant: Variant; ms: number };

export function MousedownVsClickDemo() {
  const [samples, setSamples] = React.useState<Sample[]>([]);
  const pressDown = React.useRef<Record<Variant, number | null>>({
    click: null,
    mousedown: null,
  });

  const onPointerDown = (variant: Variant) => () => {
    pressDown.current[variant] = performance.now();
    if (variant === "mousedown") {
      const t = performance.now();
      // mousedown registers immediately
      setSamples((s) => [{ variant, ms: 0 }, ...s].slice(0, 8));
      pressDown.current[variant] = t;
    }
  };

  const onPointerUp = (variant: Variant) => () => {
    if (variant !== "click") return;
    const down = pressDown.current[variant];
    if (down == null) return;
    const elapsed = performance.now() - down;
    setSamples((s) => [{ variant, ms: Math.round(elapsed) }, ...s].slice(0, 8));
    pressDown.current[variant] = null;
  };

  const reset = () => setSamples([]);

  const lastClick = samples.find((s) => s.variant === "click");
  const lastDown = samples.find((s) => s.variant === "mousedown");

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-6 py-7 sm:px-8 sm:py-9">
      <span
        role="img"
        aria-label="mousedown vs click latency"
        className="bg-emerald-500 dark:bg-emerald-400 absolute top-4 right-4 size-2 rounded-full"
      />

      <p className="text-muted-foreground mb-5 max-w-[58ch] text-sm leading-relaxed">
        Press and release each button. The latency budget you reclaim is
        the time the user holds the button between press and release — free,
        if you bind to <code className="font-mono text-xs">pointerdown</code> instead
        of <code className="font-mono text-xs">click</code>.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onPointerDown={onPointerDown("click")}
          onPointerUp={onPointerUp("click")}
          className="border-red-500/40 bg-red-500/8 hover:bg-red-500/12 dark:border-red-400/45 dark:bg-red-400/10 dark:hover:bg-red-400/15 flex flex-col items-start gap-1 rounded-xl border px-4 py-4 text-left transition-colors"
        >
          <span className="text-red-700 dark:text-red-300 font-mono text-2xs uppercase tracking-mini">
            onClick · default
          </span>
          <span className="text-foreground text-base font-semibold">
            Press and release
          </span>
          <span className="text-muted-foreground/70 font-mono text-2xs">
            registers on release
          </span>
        </button>

        <button
          type="button"
          onPointerDown={onPointerDown("mousedown")}
          className="border-emerald-500/40 bg-emerald-500/8 hover:bg-emerald-500/12 dark:border-emerald-400/45 dark:bg-emerald-400/10 dark:hover:bg-emerald-400/15 flex flex-col items-start gap-1 rounded-xl border px-4 py-4 text-left transition-colors"
        >
          <span className="text-emerald-700 dark:text-emerald-300 font-mono text-2xs uppercase tracking-mini">
            onPointerDown
          </span>
          <span className="text-foreground text-base font-semibold">
            Press to fire
          </span>
          <span className="text-muted-foreground/70 font-mono text-2xs">
            registers on press
          </span>
        </button>
      </div>

      <div className="border-border/60 bg-muted/15 mt-5 grid gap-3 rounded-xl border px-5 py-4 sm:grid-cols-2">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-red-700 dark:text-red-300 font-mono text-2xs uppercase tracking-mini">
            click latency
          </span>
          <span className="text-foreground font-mono text-sm tabular-nums">
            {lastClick ? `${lastClick.ms} ms` : "—"}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-emerald-700 dark:text-emerald-300 font-mono text-2xs uppercase tracking-mini">
            mousedown latency
          </span>
          <span className="text-foreground font-mono text-sm tabular-nums">
            {lastDown ? `${lastDown.ms} ms` : "—"}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini">
          most users hold ~100–150 ms before release
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
