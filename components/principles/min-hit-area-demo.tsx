"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

type CardProps = {
  variant: "bad" | "good";
};

function Card({ variant }: CardProps) {
  const isOk = variant === "good";
  const [touch, setTouch] = React.useState<{ x: number; y: number } | null>(
    null,
  );
  const stageRef = React.useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTouch({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="border-border bg-card/40 relative flex flex-col gap-5 rounded-2xl border px-7 py-8">
      <span
        role="img"
        aria-label={isOk ? "40 by 40 hit area" : "24 by 24 hit area"}
        className={cn(
          "absolute top-4 right-4 size-2 rounded-full",
          isOk
            ? "bg-emerald-500 dark:bg-emerald-400"
            : "bg-red-500 dark:bg-red-400",
        )}
      />
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "font-mono text-xs",
            isOk
              ? "text-emerald-700 dark:text-emerald-300"
              : "text-red-700 dark:text-red-300",
          )}
        >
          {isOk ? "40 × 40 hit area" : "24 × 24 hit area"}
        </span>
        <span className="text-muted-foreground/70 font-mono text-2xs tracking-mini lowercase">
          hover near the icon
        </span>
      </div>
      <div
        ref={stageRef}
        className="bg-muted/20 border-border/60 relative flex h-44 items-center justify-center rounded-xl border"
        onMouseMove={onMove}
        onMouseLeave={() => setTouch(null)}
      >
        <button
          type="button"
          aria-label="Close"
          className={cn(
            "group relative grid place-items-center transition-colors",
            isOk ? "size-10" : "size-6",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset opacity-0 transition-opacity duration-150 group-hover:opacity-100",
              isOk
                ? "ring-emerald-500/55 dark:ring-emerald-400/55"
                : "ring-red-500/55 dark:ring-red-400/55",
            )}
          />
          <span
            aria-hidden="true"
            className={cn(
              "bg-card text-foreground/80 relative grid size-6 place-items-center rounded transition-colors duration-150",
              isOk
                ? "group-hover:bg-emerald-500/15 group-hover:text-emerald-700 dark:group-hover:bg-emerald-400/18 dark:group-hover:text-emerald-300"
                : "group-hover:bg-red-500/15 group-hover:text-red-700 dark:group-hover:bg-red-400/18 dark:group-hover:text-red-300",
            )}
          >
            <CloseIcon />
          </span>
        </button>
        {touch && (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
              isOk
                ? "bg-emerald-500 dark:bg-emerald-400"
                : "bg-red-500 dark:bg-red-400",
            )}
            style={{ left: touch.x, top: touch.y }}
          />
        )}
      </div>
      <span className="text-muted-foreground/70 text-xs leading-relaxed">
        {isOk
          ? "::before pseudo-element pads the click target out to a 40px square — visible icon stays 24px."
          : "Click target collapses to the visible 24×24 — fingers and small cursors miss often."}
      </span>
    </div>
  );
}

export function MinHitAreaDemo() {
  return (
    <figure className="mt-6 grid gap-4 sm:grid-cols-2">
      <Card variant="bad" />
      <Card variant="good" />
    </figure>
  );
}
