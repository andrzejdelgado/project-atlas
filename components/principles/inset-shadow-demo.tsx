"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const REST_SHADOW =
  "0 2px 4px rgba(0,0,0,0.20), 0 10px 24px rgba(0,0,0,0.18)";
const PRESSED_SHADOW =
  "inset 0 3px 6px rgba(0,0,0,0.40), inset 0 1px 2px rgba(0,0,0,0.25)";

function HandIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 11V6a2 2 0 0 0-4 0" />
      <path d="M14 10V4a2 2 0 0 0-4 0v2" />
      <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-1.4-5.5-3.5L1.5 14c-.5-1 0-2.4 1.5-2.5 1 0 2 1 2.5 1.5" />
    </svg>
  );
}

export function InsetShadowDemo() {
  const [pressed, setPressed] = React.useState(false);

  const onDown = () => setPressed(true);
  const onUp = () => setPressed(false);

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-8 py-9">
      <span
        role="img"
        aria-label={pressed ? "Pressed state" : "Resting state"}
        className={cn(
          "absolute top-4 right-4 size-2 rounded-full transition-colors duration-200",
          pressed
            ? "bg-emerald-500 dark:bg-emerald-400"
            : "bg-emerald-500/40 dark:bg-emerald-400/40",
        )}
      />

      <div className="border-border/60 bg-muted/20 flex flex-col items-center justify-center gap-4 rounded-xl border px-6 py-16">
        <button
          type="button"
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          onPointerCancel={onUp}
          className={cn(
            "bg-secondary text-foreground border-border inline-flex items-center gap-2.5 rounded-full border text-base font-medium transition-all duration-100 ease-out select-none",
          )}
          style={{
            boxShadow: pressed ? PRESSED_SHADOW : REST_SHADOW,
            transform: pressed ? "scale(0.985) translateY(1px)" : "scale(1)",
            paddingInline: 28,
            paddingBlock: 14,
          }}
        >
          <span aria-hidden="true" className="inline-flex opacity-85">
            <HandIcon />
          </span>
          Check Shadows
        </button>
        <span className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini">
          {pressed
            ? "inset shadow · scale 0.985 · settled"
            : "rest · stacked outer shadow"}
        </span>
      </div>
    </figure>
  );
}
