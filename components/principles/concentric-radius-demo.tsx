"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const OUTER_RADIUS = 16;
const MIN_PAD = 0;
const MAX_PAD = 32;
const DEFAULT_PAD = 8;

type Variant = "concentric" | "incorrect";

const TONE: Record<
  Variant,
  { stroke: string; text: string; label: string }
> = {
  concentric: {
    stroke: "oklch(75% 0.16 165)",
    text: "text-emerald-300",
    label: "Concentric",
  },
  incorrect: {
    stroke: "oklch(72% 0.18 25)",
    text: "text-red-300",
    label: "Equal",
  },
};

type ArcSide = "bl" | "br";

function CornerArc({
  side,
  radius,
  variant,
}: {
  side: ArcSide;
  radius: number;
  variant: Variant;
}) {
  if (radius <= 0) return null;
  const r = radius;
  const stroke = TONE[variant].stroke;
  const path =
    side === "bl"
      ? `M 0 0 A ${r} ${r} 0 0 0 ${r} ${r}`
      : `M 0 ${r} A ${r} ${r} 0 0 0 ${r} 0`;
  const pos: React.CSSProperties =
    side === "bl"
      ? { left: 0, bottom: 0 }
      : { right: 0, bottom: 0 };
  return (
    <svg
      width={r}
      height={r}
      viewBox={`0 0 ${r} ${r}`}
      style={{
        position: "absolute",
        overflow: "visible",
        pointerEvents: "none",
        zIndex: 5,
        ...pos,
      }}
      aria-hidden="true"
    >
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

type PadSliderProps = {
  value: number;
  onChange: (v: number) => void;
};

function PadSlider({ value, onChange }: PadSliderProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const range = MAX_PAD - MIN_PAD;
  const percent = ((value - MIN_PAD) / range) * 100;

  const updateFromX = React.useCallback(
    (clientX: number) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = clientX - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      const next = MIN_PAD + pct * range;
      onChange(Math.round(next));
    },
    [onChange, range],
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
    else if (e.key === "PageDown") next = value - 4;
    else if (e.key === "PageUp") next = value + 4;
    else if (e.key === "Home") next = MIN_PAD;
    else if (e.key === "End") next = MAX_PAD;
    else return;
    e.preventDefault();
    onChange(Math.max(MIN_PAD, Math.min(MAX_PAD, next)));
  };

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-label="Panel padding"
      aria-valuemin={MIN_PAD}
      aria-valuemax={MAX_PAD}
      aria-valuenow={value}
      aria-valuetext={`${value} pixels of padding`}
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
        className={cn(
          "bg-emerald-400 pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-sm transition-transform duration-150",
          isDragging && "scale-110",
        )}
        style={{ left: `${percent}%` }}
      />
    </div>
  );
}

type PanelProps = {
  variant: Variant;
  pad: number;
};

function Panel({ variant, pad }: PanelProps) {
  const isOk = variant === "concentric";
  const innerR = isOk ? Math.max(0, OUTER_RADIUS - pad) : OUTER_RADIUS;
  const tone = TONE[variant];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground/55 font-mono text-2xs tabular-nums">
          inner {innerR}px
        </span>
        <span
          role="img"
          aria-label={tone.label}
          className={cn(
            "size-2 rounded-full",
            isOk ? "bg-emerald-400" : "bg-red-400",
          )}
        />
      </div>

      <div
        className="bg-zinc-200 dark:bg-zinc-800 relative"
        style={{
          borderRadius: `${OUTER_RADIUS}px`,
          padding: `${pad}px`,
        }}
      >
        <div
          className="grid grid-cols-2"
          style={{ gap: `${Math.max(6, pad / 2)}px` }}
        >
          {[0, 1].map((i) => (
            <div
              key={i}
              className="bg-zinc-300 dark:bg-zinc-900 relative aspect-square w-full"
              style={{
                borderRadius: `${innerR}px`,
              }}
            >
              <CornerArc side="bl" radius={innerR} variant={variant} />
              <CornerArc side="br" radius={innerR} variant={variant} />
            </div>
          ))}
        </div>

        <CornerArc side="bl" radius={OUTER_RADIUS} variant={variant} />
        <CornerArc side="br" radius={OUTER_RADIUS} variant={variant} />
      </div>
    </div>
  );
}

export function ConcentricRadiusDemo() {
  const [pad, setPad] = React.useState(DEFAULT_PAD);

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-8 py-9">
      <div className="border-border/60 bg-muted/20 mb-7 rounded-xl border px-5 py-7">
        <div className="grid gap-7 md:grid-cols-2 md:gap-6">
          <Panel variant="concentric" pad={pad} />
          <Panel variant="incorrect" pad={pad} />
        </div>
      </div>

      <div className="border-border/60 bg-muted/30 rounded-xl border px-5 py-6">
        <PadSlider value={pad} onChange={setPad} />
        <div className="mt-5 flex items-baseline justify-between font-mono text-xs">
          <span className="text-muted-foreground/60 tabular-nums">
            {MIN_PAD}px
          </span>
          <span className="tabular-nums">
            <span className="text-foreground">{pad}px</span>
            <span className="text-muted-foreground/40 mx-2">·</span>
            <span className="text-muted-foreground/70">padding</span>
          </span>
          <span className="text-muted-foreground/60 tabular-nums">
            {MAX_PAD}px
          </span>
        </div>
      </div>
    </figure>
  );
}
