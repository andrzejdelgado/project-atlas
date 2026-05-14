"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const HUES = [
  { label: "Blue", value: 264 },
  { label: "Violet", value: 290 },
  { label: "Mint", value: 165 },
  { label: "Coral", value: 30 },
] as const;

const MIN_CHROMA = 0;
const MAX_CHROMA = 0.06;
const DEFAULT_CHROMA = 0.018;
const OPTIMAL_MIN = 0.01;
const OPTIMAL_MAX = 0.05;

const NEUTRALS = [
  { label: "200", L: 0.85, mobile: true },
  { label: "300", L: 0.77, mobile: false },
  { label: "400", L: 0.7, mobile: true },
  { label: "500", L: 0.55, mobile: false },
  { label: "600", L: 0.4, mobile: true },
  { label: "700", L: 0.28, mobile: false },
  { label: "800", L: 0.18, mobile: false },
] as const;

const BRAND_L = 0.55;
const BRAND_C = 0.22;

type Status = {
  label: string;
  isOptimal: boolean;
};

function getStatus(chroma: number): Status {
  if (chroma < 0.005) return { label: "pure gray", isOptimal: false };
  if (chroma < OPTIMAL_MIN) return { label: "bare hint", isOptimal: false };
  if (chroma <= OPTIMAL_MAX) return { label: "cohesive", isOptimal: true };
  if (chroma <= 0.08) return { label: "tinted", isOptimal: false };
  return { label: "colored", isOptimal: false };
}

const range = MAX_CHROMA - MIN_CHROMA;
const optimalLeftPct = ((OPTIMAL_MIN - MIN_CHROMA) / range) * 100;
const optimalRightPct = ((OPTIMAL_MAX - MIN_CHROMA) / range) * 100;
const optimalWidthPct = optimalRightPct - optimalLeftPct;

type ChromaSliderProps = {
  value: number;
  onChange: (v: number) => void;
  status: Status;
};

function ChromaSlider({ value, onChange, status }: ChromaSliderProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const percent = ((value - MIN_CHROMA) / range) * 100;

  const updateFromX = React.useCallback(
    (clientX: number) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = clientX - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      const next = MIN_CHROMA + pct * range;
      onChange(Math.round(next * 1000) / 1000);
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
    const step = 0.005;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = value - step;
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") next = value + step;
    else if (e.key === "PageDown") next = value - step * 4;
    else if (e.key === "PageUp") next = value + step * 4;
    else if (e.key === "Home") next = MIN_CHROMA;
    else if (e.key === "End") next = MAX_CHROMA;
    else return;
    e.preventDefault();
    onChange(
      Math.round(Math.max(MIN_CHROMA, Math.min(MAX_CHROMA, next)) * 1000) /
        1000,
    );
  };

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-label="Chroma amount"
      aria-valuemin={0}
      aria-valuemax={MAX_CHROMA * 100}
      aria-valuenow={Math.round(value * 1000) / 10}
      aria-valuetext={`${(value * 100).toFixed(1)} percent chroma · ${status.label}`}
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

export function SaturatedNeutralsDemo() {
  const [hue, setHue] = React.useState<number>(264);
  const [chroma, setChroma] = React.useState(DEFAULT_CHROMA);
  const status = getStatus(chroma);

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-8 py-9">
      <span
        role="img"
        aria-label={`${(chroma * 100).toFixed(1)} percent chroma — ${status.label}`}
        className={cn(
          "absolute top-4 right-4 size-2 rounded-full transition-colors duration-200",
          status.isOptimal ? "bg-emerald-400" : "bg-red-400",
        )}
      />

      <div
        role="radiogroup"
        aria-label="Brand hue"
        className="mb-7 flex flex-wrap gap-2"
      >
        {HUES.map((h) => {
          const active = h.value === hue;
          return (
            <button
              key={h.label}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setHue(h.value)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
                active
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border bg-transparent",
              )}
            >
              <span
                aria-hidden="true"
                className="block size-2 rounded-full"
                style={{
                  backgroundColor: `oklch(${BRAND_L} ${BRAND_C} ${h.value})`,
                }}
              />
              {h.label}
            </button>
          );
        })}
      </div>

      <div className="border-border/60 bg-muted/20 mb-7 flex items-end gap-3 rounded-xl border px-5 py-7 sm:gap-3.5">
        {NEUTRALS.map((n) => (
          <div
            key={n.label}
            className={cn(
              "flex-col items-center gap-2",
              n.mobile ? "flex" : "hidden sm:flex",
            )}
          >
            <span
              aria-hidden="true"
              className="border-border/40 size-14 rounded-xl border transition-colors duration-150 sm:size-12"
              style={{
                backgroundColor: `oklch(${n.L} ${chroma} ${hue})`,
              }}
            />
            <span className="text-muted-foreground/70 font-mono text-2xs tracking-mini lowercase">
              {n.label}
            </span>
          </div>
        ))}
        <div className="ml-auto flex flex-col items-center gap-2">
          <span
            aria-hidden="true"
            className="border-border/40 size-14 rounded-xl border transition-colors duration-150 sm:size-12"
            style={{
              backgroundColor: `oklch(${BRAND_L} ${BRAND_C} ${hue})`,
            }}
          />
          <span className="text-muted-foreground/70 font-mono text-2xs tracking-mini lowercase">
            brand
          </span>
        </div>
      </div>

      <div className="border-border/60 bg-muted/30 rounded-xl border px-5 py-6">
        <ChromaSlider value={chroma} onChange={setChroma} status={status} />
        <div className="mt-5 flex items-baseline justify-between font-mono text-xs">
          <span className="text-muted-foreground/60 tabular-nums">0%</span>
          <span
            className={cn(
              "tabular-nums transition-colors",
              status.isOptimal ? "text-emerald-400" : "text-red-400",
            )}
          >
            {(chroma * 100).toFixed(1)}% · {status.label}
          </span>
          <span className="text-muted-foreground/60 tabular-nums">
            {(MAX_CHROMA * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </figure>
  );
}
