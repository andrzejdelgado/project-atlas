"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Variant = "default" | "refined";

const INDICATORS: Record<Variant, { className: string; label: string }> = {
  default: {
    className: "bg-red-400",
    label: "align-items: center",
  },
  refined: {
    className: "bg-emerald-400",
    label: "align-items: baseline",
  },
};

type RowProps = {
  label: string;
  children: React.ReactNode;
  align: "center" | "baseline";
  guide: boolean;
};

function Row({ label, children, align, guide }: RowProps) {
  return (
    <div className="grid grid-cols-[6rem_1fr] items-center gap-5">
      <span className="text-muted-foreground text-sm">{label}</span>
      <div
        className="relative flex min-w-0 flex-wrap gap-x-1.5 gap-y-1"
        style={{ alignItems: align }}
      >
        {children}
        {guide && (
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-x-0 h-px",
              align === "center"
                ? "top-1/2 -translate-y-1/2 bg-red-400/45"
                : "bg-emerald-400/45",
            )}
            style={align === "baseline" ? { bottom: "5px" } : undefined}
          />
        )}
      </div>
    </div>
  );
}

function Card({ variant, guide }: { variant: Variant; guide: boolean }) {
  const align = variant === "default" ? "center" : "baseline";
  const indicator = INDICATORS[variant];
  return (
    <div className="border-border bg-card/40 relative rounded-2xl border px-8 py-9">
      <span
        role="img"
        aria-label={indicator.label}
        className={cn(
          "absolute top-4 right-4 size-2 rounded-full",
          indicator.className,
        )}
      />
      <div className="flex flex-col gap-8">
        <Row label="Pricing" align={align} guide={guide}>
          <span className="text-foreground/70 text-base">$</span>
          <span className="text-foreground text-3xl font-semibold tabular-nums">
            179
          </span>
          <span className="text-foreground/70 text-sm tabular-nums">.99</span>
          <span className="text-muted-foreground/80 text-xs whitespace-nowrap">
            / mo
          </span>
        </Row>
        <Row label="Active users" align={align} guide={guide}>
          <span className="text-foreground text-3xl font-semibold tabular-nums">
            458
          </span>
          <span className="text-muted-foreground/80 text-xs whitespace-nowrap">
            customers
          </span>
        </Row>
        <Row label="Trend" align={align} guide={guide}>
          <span className="text-emerald-400 text-base">↑</span>
          <span className="text-foreground text-3xl font-semibold tabular-nums">
            12.5%
          </span>
          <span className="text-muted-foreground/80 text-xs whitespace-nowrap">
            vs last quarter
          </span>
        </Row>
      </div>
    </div>
  );
}

export function BaselineAlignmentDemo() {
  const [guide, setGuide] = React.useState(false);
  return (
    <figure className="mt-6 flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card variant="default" guide={guide} />
        <Card variant="refined" guide={guide} />
      </div>
      <label className="text-muted-foreground flex cursor-pointer items-center gap-2.5 self-center text-sm select-none">
        <input
          type="checkbox"
          checked={guide}
          onChange={(e) => setGuide(e.target.checked)}
          className="accent-emerald-400 size-4 cursor-pointer"
        />
        Show alignment guide
      </label>
    </figure>
  );
}
