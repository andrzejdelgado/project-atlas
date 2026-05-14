"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type TechniqueId =
  | "color-space"
  | "color-stop-hint"
  | "banding"
  | "hard-stops"
  | "gradient-text"
  | "conic";

type Technique = {
  id: TechniqueId;
  label: string;
  desc: string;
};

const TECHNIQUES: Technique[] = [
  {
    id: "color-space",
    label: "Color space",
    desc: "sRGB drags through muddy mid-grey at the midpoint, OKLAB stays in pastel territory, and OKLCH longer hue walks the hue wheel itself.",
  },
  {
    id: "color-stop-hint",
    label: "Color-stop hint",
    desc: "A bare percentage between two stops moves the perceptual midpoint without adding a third color.",
  },
  {
    id: "banding",
    label: "Banding",
    desc: "Subtle dark gradients show stepping on 8-bit displays. Insert intermediate stops along the curve to smooth the transition.",
  },
  {
    id: "hard-stops",
    label: "Hard stops",
    desc: "Two stops at the same position make a clean color split painted directly into the background — no extra elements, no SVG.",
  },
  {
    id: "gradient-text",
    label: "Gradient text",
    desc: "Background-clip text turns any element's gradient into the type's fill. Pair with -webkit-text-fill-color: transparent for Safari support.",
  },
  {
    id: "conic",
    label: "Conic",
    desc: "Progress rings, segmented donuts, dials — native CSS, no SVG required.",
  },
];

function Bar({
  label,
  gradient,
  height = "h-12",
  showMidpoint = false,
}: {
  label: string;
  gradient: string;
  height?: string;
  showMidpoint?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-muted-foreground/70 text-xs">{label}</span>
      <div className="relative">
        <span
          aria-hidden="true"
          className={cn("block w-full rounded-md", height)}
          style={{ background: gradient }}
        />
        {showMidpoint && (
          <span
            aria-hidden="true"
            className="bg-foreground/40 pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
          />
        )}
      </div>
    </div>
  );
}

function StopBar({
  label,
  gradient,
  stops,
}: {
  label: string;
  gradient: string;
  stops: number[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-muted-foreground/70 text-xs">{label}</span>
      <div className="relative">
        <span
          aria-hidden="true"
          className="block h-12 w-full rounded-md"
          style={{ background: gradient }}
        />
        {stops.map((s) => (
          <span
            key={s}
            aria-hidden="true"
            className="bg-foreground/55 pointer-events-none absolute -bottom-2 h-2 w-px"
            style={{ left: `${s}%`, transform: "translateX(-0.5px)" }}
          />
        ))}
      </div>
    </div>
  );
}

function Preview({ id }: { id: TechniqueId }) {
  if (id === "color-space") {
    return (
      <div className="flex flex-col gap-4">
        <Bar
          label="default sRGB · muddy at the midpoint"
          gradient="linear-gradient(to right, oklch(70% 0.30 330), oklch(85% 0.30 130))"
          showMidpoint
        />
        <Bar
          label="in oklab · pastel-clean midpoint"
          gradient="linear-gradient(in oklab to right, oklch(70% 0.30 330), oklch(85% 0.30 130))"
          showMidpoint
        />
        <Bar
          label="in oklch longer hue · walks the wheel"
          gradient="linear-gradient(in oklch longer hue to right, oklch(70% 0.30 330), oklch(85% 0.30 130))"
          showMidpoint
        />
      </div>
    );
  }
  if (id === "color-stop-hint") {
    return (
      <div className="flex flex-col gap-6">
        <StopBar
          label="even — implicit midpoint at 50%"
          gradient="linear-gradient(in oklch to right, oklch(60% 0.20 30), oklch(60% 0.20 264))"
          stops={[0, 50, 100]}
        />
        <StopBar
          label="hint at 25% — perceptual midpoint shifts toward red"
          gradient="linear-gradient(in oklch to right, oklch(60% 0.20 30), 30%, oklch(60% 0.20 264))"
          stops={[0, 25, 100]}
        />
      </div>
    );
  }
  if (id === "banding") {
    return (
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-muted-foreground/70 text-xs">
            2 stops · banding visible
          </span>
          <span
            aria-hidden="true"
            className="block h-40 w-full rounded-md"
            style={{
              background:
                "linear-gradient(to bottom, oklch(78% 0.12 264), oklch(42% 0.10 264))",
            }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-muted-foreground/70 text-xs">
            5 stops · smoothed curve
          </span>
          <span
            aria-hidden="true"
            className="block h-40 w-full rounded-md"
            style={{
              background:
                "linear-gradient(in oklch to bottom, oklch(78% 0.12 264) 0%, oklch(70% 0.12 264) 25%, oklch(60% 0.11 264) 55%, oklch(50% 0.105 264) 80%, oklch(42% 0.10 264) 100%)",
            }}
          />
        </div>
      </div>
    );
  }
  if (id === "hard-stops") {
    return (
      <div className="flex flex-col gap-3">
        <Bar
          label="50 / 50 split"
          gradient="linear-gradient(to right, oklch(55% 0.18 264) 50%, oklch(60% 0.20 25) 50%)"
          height="h-10"
        />
        <Bar
          label="three-way split · 33 / 66"
          gradient="linear-gradient(to right, oklch(58% 0.18 145) 33.33%, oklch(60% 0.20 25) 33.33% 66.66%, oklch(55% 0.18 264) 66.66%)"
          height="h-10"
        />
        <Bar
          label="asymmetric · 70 / 30"
          gradient="linear-gradient(to right, oklch(50% 0.20 290) 70%, oklch(70% 0.18 75) 70%)"
          height="h-10"
        />
      </div>
    );
  }
  if (id === "gradient-text") {
    return (
      <div className="flex flex-col items-center justify-center gap-3">
        <span
          className="bg-clip-text text-7xl font-semibold tracking-tight text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(in oklch to right, oklch(72% 0.22 264), oklch(70% 0.22 320), oklch(75% 0.20 30))",
          }}
        >
          Refined
        </span>
        <span
          className="bg-clip-text text-sm font-medium tracking-wide text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(in oklch to right, oklch(72% 0.18 165), oklch(72% 0.18 264))",
          }}
        >
          background-clip: text · -webkit-text-fill-color: transparent
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <div
          aria-hidden="true"
          className="relative flex size-24 items-center justify-center rounded-full"
          style={{
            background:
              "conic-gradient(from -90deg, oklch(70% 0.20 264) 0% 72%, oklch(28% 0.005 264) 72% 100%)",
          }}
        >
          <span className="bg-card text-foreground flex size-16 items-center justify-center rounded-full text-sm font-semibold tabular-nums">
            72%
          </span>
        </div>
        <span className="text-muted-foreground/70 text-xs">progress</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div
          aria-hidden="true"
          className="relative flex size-24 items-center justify-center rounded-full"
          style={{
            background:
              "conic-gradient(from -90deg, oklch(70% 0.18 264) 0% 25%, oklch(72% 0.18 165) 25% 50%, oklch(72% 0.20 30) 50% 75%, oklch(72% 0.22 290) 75% 100%)",
          }}
        >
          <span className="bg-card flex size-16 rounded-full" />
        </div>
        <span className="text-muted-foreground/70 text-xs">segmented</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div
          aria-hidden="true"
          className="relative flex size-24 items-center justify-center rounded-full"
          style={{
            background:
              "conic-gradient(from 180deg at 50% 50%, oklch(72% 0.20 30) 0deg, oklch(72% 0.20 165) 90deg, oklch(72% 0.20 264) 180deg, oklch(72% 0.20 30) 360deg)",
          }}
        >
          <span className="bg-card flex size-16 rounded-full" />
        </div>
        <span className="text-muted-foreground/70 text-xs">dial</span>
      </div>
    </div>
  );
}

export function GradientRefinementDemo() {
  const [idx, setIdx] = React.useState(0);
  const selected = TECHNIQUES[idx];

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-8 py-9">
      <span
        role="img"
        aria-label="Gradient techniques applied"
        className="bg-emerald-400 absolute top-4 right-4 size-2 rounded-full"
      />

      <div
        role="radiogroup"
        aria-label="Gradient technique"
        className="mb-6 flex flex-wrap gap-2"
      >
        {TECHNIQUES.map((t, i) => {
          const active = i === idx;
          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setIdx(i)}
              className={cn(
                "rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
                active
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border bg-transparent",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <p
        aria-live="polite"
        className="text-muted-foreground mb-7 min-h-[3.5rem] text-sm leading-relaxed"
      >
        {selected.desc}
      </p>

      <div className="border-border/60 bg-muted/20 flex min-h-[260px] flex-col justify-center rounded-xl border px-6 py-7">
        <Preview id={selected.id} />
      </div>
    </figure>
  );
}
