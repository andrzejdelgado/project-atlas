"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Mode = "geometric" | "optical";
type ButtonStyle = "filled" | "outline" | "pill";

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="border-foreground/25 border-t-foreground inline-block size-4 shrink-0 animate-spin rounded-full border-2"
    />
  );
}

function TrashIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-3.5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

type Spec = {
  label: string;
  icon: React.ReactNode;
  style: ButtonStyle;
  geomPad: { l: number; r: number };
  optPad: { l: number; r: number };
};

const SPECS: Spec[] = [
  {
    label: "Submit",
    icon: <Spinner />,
    style: "filled",
    geomPad: { l: 24, r: 24 },
    optPad: { l: 20, r: 24 },
  },
  {
    label: "Delete",
    icon: <TrashIcon />,
    style: "outline",
    geomPad: { l: 24, r: 24 },
    optPad: { l: 20, r: 24 },
  },
  {
    label: "Verified",
    icon: <ShieldIcon />,
    style: "pill",
    geomPad: { l: 16, r: 16 },
    optPad: { l: 12, r: 16 },
  },
];

const BUTTON_STYLE: Record<
  ButtonStyle,
  {
    height: number;
    fontSize: string;
    borderRadius: number;
    gap: number;
    className: string;
  }
> = {
  filled: {
    height: 48,
    fontSize: "1rem",
    borderRadius: 12,
    gap: 8,
    className: "bg-secondary text-foreground border border-border",
  },
  outline: {
    height: 48,
    fontSize: "1rem",
    borderRadius: 12,
    gap: 8,
    className:
      "bg-transparent text-red-600 dark:text-red-400 border border-red-500/45 dark:border-red-400/45",
  },
  pill: {
    height: 32,
    fontSize: "0.875rem",
    borderRadius: 9999,
    gap: 6,
    className:
      "bg-blue-500/12 dark:bg-blue-400/15 text-blue-700 dark:text-blue-300",
  },
};

const STRIPE_CLASS: Record<Mode, string> = {
  geometric: "bg-red-500/35 dark:bg-red-400/35",
  optical: "bg-emerald-500/35 dark:bg-emerald-400/35",
};

const TONE_CLASS: Record<Mode, { text: string; dot: string }> = {
  geometric: {
    text: "text-red-700 dark:text-red-300",
    dot: "bg-red-500 dark:bg-red-400",
  },
  optical: {
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500 dark:bg-emerald-400",
  },
};

type RowProps = {
  spec: Spec;
  mode: Mode;
  viz: boolean;
};

function Row({ spec, mode, viz }: RowProps) {
  const pad = mode === "geometric" ? spec.geomPad : spec.optPad;
  const style = BUTTON_STYLE[spec.style];
  const tone = TONE_CLASS[mode];
  const stripeClass = STRIPE_CLASS[mode];

  return (
    <div className="flex items-center justify-center gap-3">
      <span
        className={cn(
          "text-muted-foreground/60 w-7 shrink-0 text-right font-mono text-2xs tabular-nums transition-opacity duration-150",
          viz ? "opacity-100" : "opacity-0",
        )}
      >
        {pad.l}
      </span>
      <button
        type="button"
        className={cn(
          "relative inline-flex items-center overflow-hidden font-medium select-none",
          style.className,
        )}
        style={{
          paddingLeft: pad.l,
          paddingRight: pad.r,
          height: style.height,
          fontSize: style.fontSize,
          borderRadius: style.borderRadius,
          gap: style.gap,
        }}
      >
        {viz && (
          <>
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute top-0 bottom-0 left-0",
                stripeClass,
              )}
              style={{ width: pad.l }}
            />
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute top-0 right-0 bottom-0",
                stripeClass,
              )}
              style={{ width: pad.r }}
            />
          </>
        )}
        <span
          className="relative z-[1] inline-flex items-center"
          style={{ gap: style.gap }}
        >
          {spec.icon}
          {spec.label}
        </span>
      </button>
      <span
        className={cn(
          "text-muted-foreground/60 w-7 shrink-0 font-mono text-2xs tabular-nums transition-opacity duration-150",
          viz ? "opacity-100" : "opacity-0",
        )}
      >
        {pad.r}
      </span>
      <span
        className={cn(
          "w-7 shrink-0 font-mono text-2xs tabular-nums transition-opacity duration-150",
          tone.text,
          viz ? "opacity-100" : "opacity-0",
        )}
      >
        {pad.r - pad.l > 0 ? `+${pad.r - pad.l}` : "·"}
      </span>
    </div>
  );
}

function Card({ mode, viz }: { mode: Mode; viz: boolean }) {
  const isOk = mode === "optical";
  const tone = TONE_CLASS[mode];
  return (
    <div className="border-border bg-card/40 relative rounded-2xl border px-7 py-8">
      <span
        role="img"
        aria-label={isOk ? "Optical alignment" : "Geometric alignment"}
        className={cn(
          "absolute top-4 right-4 size-2 rounded-full",
          tone.dot,
        )}
      />
      <span className={cn("mb-7 block font-mono text-xs", tone.text)}>
        {isOk ? "Optical" : "Geometric"}
      </span>
      <div className="flex flex-col gap-5">
        {SPECS.map((s) => (
          <Row key={s.label} spec={s} mode={mode} viz={viz} />
        ))}
      </div>
    </div>
  );
}

export function OpticalAlignmentDemo() {
  const [viz, setViz] = React.useState(false);
  return (
    <figure className="mt-6 flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card mode="geometric" viz={viz} />
        <Card mode="optical" viz={viz} />
      </div>
      <label className="text-muted-foreground flex cursor-pointer items-center gap-2.5 self-center text-sm select-none">
        <input
          type="checkbox"
          checked={viz}
          onChange={(e) => setViz(e.target.checked)}
          className="accent-emerald-400 size-4 cursor-pointer"
        />
        Show padding
      </label>
    </figure>
  );
}
