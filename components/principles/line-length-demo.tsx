"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const MIN_CH = 30;
const MAX_CH = 100;
const OPTIMAL_MIN = 45;
const OPTIMAL_MAX = 90;
const DEFAULT_CH = 95;

const PARAGRAPH =
  "Good interfaces rarely come from a single thing. It is usually a collection of small, compounding details — typography that breathes, shadows that follow the light, color that holds together across themes. Each detail is invisible in isolation, but together they create an experience that feels effortless and considered. When a line stretches this wide, the eye has to travel so far right that finding the start of the next line becomes a small but real cognitive task.";

function getStatus(ch: number): { label: string; isOptimal: boolean } {
  if (ch < OPTIMAL_MIN) return { label: "too narrow", isOptimal: false };
  if (ch > OPTIMAL_MAX) return { label: "too wide", isOptimal: false };
  return { label: "optimal", isOptimal: true };
}

const range = MAX_CH - MIN_CH;
const optimalLeftPct = ((OPTIMAL_MIN - MIN_CH) / range) * 100;
const optimalRightPct = ((OPTIMAL_MAX - MIN_CH) / range) * 100;
const optimalWidthPct = optimalRightPct - optimalLeftPct;

type SliderProps = {
  value: number;
  onChange: (v: number) => void;
  status: { label: string; isOptimal: boolean };
};

function Slider({ value, onChange, status }: SliderProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const percent = ((value - MIN_CH) / range) * 100;

  const updateFromX = React.useCallback(
    (clientX: number) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = clientX - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      const next = Math.round(MIN_CH + pct * range);
      onChange(next);
    },
    [onChange],
  );

  React.useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: PointerEvent) => updateFromX(e.clientX);
    const onUp = () => setIsDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [isDragging, updateFromX]);

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateFromX(e.clientX);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    let next = value;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = value - 1;
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") next = value + 1;
    else if (e.key === "PageDown") next = value - 5;
    else if (e.key === "PageUp") next = value + 5;
    else if (e.key === "Home") next = MIN_CH;
    else if (e.key === "End") next = MAX_CH;
    else return;
    e.preventDefault();
    onChange(Math.max(MIN_CH, Math.min(MAX_CH, next)));
  };

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-label="Line length in characters"
      aria-valuemin={MIN_CH}
      aria-valuemax={MAX_CH}
      aria-valuenow={value}
      aria-valuetext={`${value} characters · ${status.label}`}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      className={cn(
        "relative h-6 touch-none rounded-full",
        "focus-visible:ring-emerald-400/40 focus-visible:ring-2 focus-visible:outline-none",
        isDragging ? "cursor-grabbing" : "cursor-pointer",
      )}
    >
      <div className="bg-border pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full" />
      <div
        className="bg-emerald-400/25 pointer-events-none absolute top-1/2 h-1 -translate-y-1/2 rounded-full"
        style={{
          left: `${optimalLeftPct}%`,
          width: `${optimalWidthPct}%`,
        }}
      />
      <div
        className="bg-muted-foreground/50 pointer-events-none absolute top-1/2 h-3 w-px -translate-y-1/2"
        style={{ left: `${optimalLeftPct}%` }}
      />
      <div
        className="bg-muted-foreground/50 pointer-events-none absolute top-1/2 h-3 w-px -translate-y-1/2"
        style={{ left: `${optimalRightPct}%` }}
      />
      <div
        className={cn(
          "bg-emerald-400 pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-sm transition-transform duration-150",
          isDragging && "scale-110",
        )}
        style={{ left: `${percent}%` }}
      />
    </div>
  );
}

export function LineLengthDemo() {
  const [ch, setCh] = React.useState(DEFAULT_CH);
  const status = getStatus(ch);

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-10 py-12">
      <span
        role="img"
        aria-label={`Line length: ${status.label}`}
        className={cn(
          "absolute top-4 right-4 size-2 rounded-full transition-colors duration-200",
          status.isOptimal ? "bg-emerald-400" : "bg-red-400",
        )}
      />

      <p className="text-muted-foreground mb-7 text-sm">
        Drag the slider — the optimal range is highlighted on the track.
      </p>

      <div className="border-border/60 bg-muted/30 mb-9 rounded-xl border px-5 py-6">
        <Slider value={ch} onChange={setCh} status={status} />

        <div className="mt-5 flex items-baseline justify-between font-mono text-xs">
          <span className="text-muted-foreground/60 tabular-nums">
            {MIN_CH}ch
          </span>
          <span
            className={cn(
              "tabular-nums transition-colors",
              status.isOptimal ? "text-emerald-400" : "text-red-400",
            )}
          >
            {ch}ch · {status.label}
          </span>
          <span className="text-muted-foreground/60 tabular-nums">
            {MAX_CH}ch
          </span>
        </div>
      </div>

      <p
        className="text-foreground/85 mx-auto"
        style={{
          fontSize: "0.6875rem",
          lineHeight: 1.7,
          letterSpacing: "0",
          fontWeight: 400,
          maxWidth: `${ch}ch`,
        }}
      >
        {PARAGRAPH}
      </p>
    </figure>
  );
}
