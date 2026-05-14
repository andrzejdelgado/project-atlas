"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Variant = "flat" | "natural";

const SHADOWS: Record<
  Variant,
  { rest: string; hover: string; label: string; eyebrow: string }
> = {
  flat: {
    rest: "0 4px 4px rgba(0,0,0,0.32)",
    hover: "0 6px 6px rgba(0,0,0,0.36)",
    label: "Single layer · blur = offset",
    eyebrow: "flat",
  },
  natural: {
    rest:
      "0 2px 4px rgba(0,0,0,0.24), 0 8px 16px rgba(0,0,0,0.20)",
    hover:
      "0 4px 8px rgba(0,0,0,0.28), 0 14px 28px rgba(0,0,0,0.22)",
    label: "Stacked layers · blur = 2× offset",
    eyebrow: "natural",
  },
};

function RevenueCard({
  variant,
  hovered,
}: {
  variant: Variant;
  hovered: boolean;
}) {
  const meta = SHADOWS[variant];
  const isOk = variant === "natural";
  return (
    <div
      className="bg-card relative w-full max-w-[260px] rounded-xl px-5 py-5 transition-all duration-300 ease-out"
      style={{
        boxShadow: hovered ? meta.hover : meta.rest,
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-muted-foreground/80 font-mono text-2xs uppercase tracking-mini">
          Revenue
        </span>
        <span
          className={cn(
            "font-mono text-2xs tabular-nums",
            isOk ? "text-emerald-300" : "text-red-300",
          )}
        >
          ↑ 8.2%
        </span>
      </div>
      <div className="text-foreground mb-2 text-2xl font-semibold tabular-nums">
        $12,486.00
      </div>
      <p className="text-muted-foreground text-xs leading-relaxed">
        Up from $11,540 last month — driven by enterprise renewals.
      </p>
    </div>
  );
}

type CardWrapperProps = {
  variant: Variant;
  forced: boolean;
};

function CardWrapper({ variant, forced }: CardWrapperProps) {
  const [hover, setHover] = React.useState(false);
  const isOk = variant === "natural";
  const lifted = hover || forced;
  return (
    <div className="border-border bg-card/40 relative flex flex-col items-center gap-5 rounded-2xl border px-7 py-10">
      <span
        role="img"
        aria-label={SHADOWS[variant].label}
        className={cn(
          "absolute top-4 right-4 size-2 rounded-full",
          isOk ? "bg-emerald-400" : "bg-red-400",
        )}
      />
      <span
        className={cn(
          "font-mono text-xs",
          isOk ? "text-emerald-300" : "text-red-300",
        )}
      >
        {SHADOWS[variant].label}
      </span>
      <div
        className="bg-muted/30 border-border/60 flex w-full items-center justify-center rounded-xl border px-6 py-12"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <RevenueCard variant={variant} hovered={lifted} />
      </div>
    </div>
  );
}

export function ElevationShadowDemo() {
  const [forced, setForced] = React.useState(false);
  return (
    <figure className="mt-6 flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <CardWrapper variant="flat" forced={forced} />
        <CardWrapper variant="natural" forced={forced} />
      </div>
      <label className="text-muted-foreground flex cursor-pointer items-center gap-2.5 self-center text-sm select-none">
        <input
          type="checkbox"
          checked={forced}
          onChange={(e) => setForced(e.target.checked)}
          className="accent-emerald-400 size-4 cursor-pointer"
        />
        Force hover state
      </label>
    </figure>
  );
}
