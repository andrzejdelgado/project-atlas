"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Variant = "loud" | "refined";

function HeartIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function LikeButton({ variant }: { variant: Variant }) {
  const [hover, setHover] = React.useState(false);
  const isOk = variant === "refined";

  // Loud: every property wobbles (size, padding, radius, font-size)
  // Refined: only colors transition; geometry never changes on hover.
  const style: React.CSSProperties = isOk
    ? {
        transition:
          "background-color 200ms ease-out, border-color 200ms ease-out, color 200ms ease-out",
        height: 48,
        paddingInline: 20,
        borderRadius: 12,
        fontSize: "0.9375rem",
      }
    : {
        transition: "all 380ms ease-out",
        height: hover ? 56 : 48,
        paddingInline: hover ? 32 : 20,
        borderRadius: hover ? 28 : 12,
        fontSize: hover ? "1.0625rem" : "0.9375rem",
      };

  return (
    <button
      type="button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        "inline-flex items-center gap-2.5 border font-medium select-none",
        hover
          ? "border-red-500/55 bg-red-500/12 text-red-700 dark:border-red-400/55 dark:bg-red-400/15 dark:text-red-300"
          : "bg-secondary text-foreground border-border",
      )}
      style={style}
    >
      <HeartIcon />
      Like
      <span
        className={cn(
          "rounded-full px-2 py-0.5 font-mono text-2xs tabular-nums tracking-mini",
          hover
            ? "bg-red-500/15 text-red-700 dark:bg-red-400/15 dark:text-red-300"
            : "bg-muted text-muted-foreground",
        )}
        style={
          isOk
            ? { transition: "background-color 200ms ease-out, color 200ms ease-out" }
            : { transition: "inherit" }
        }
      >
        142
      </span>
    </button>
  );
}

function Card({ variant }: { variant: Variant }) {
  const isOk = variant === "refined";
  return (
    <div className="border-border bg-card/40 relative flex h-56 flex-col items-center justify-center gap-7 rounded-2xl border px-7 py-9">
      <span
        role="img"
        aria-label={isOk ? "Targeted transition" : "transition: all"}
        className={cn(
          "absolute top-4 right-4 size-2 rounded-full",
          isOk
            ? "bg-emerald-500 dark:bg-emerald-400"
            : "bg-red-500 dark:bg-red-400",
        )}
      />
      <span
        className={cn(
          "absolute top-5 left-5 font-mono text-2xs uppercase tracking-mini",
          isOk
            ? "text-emerald-700 dark:text-emerald-300"
            : "text-red-700 dark:text-red-300",
        )}
      >
        {isOk ? "transition: bg, border, color" : "transition: all"}
      </span>
      <LikeButton variant={variant} />
      <span className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini text-center">
        {isOk
          ? "hover · only colors transition"
          : "hover · padding, radius, font wobble"}
      </span>
    </div>
  );
}

export function TransitionAllDemo() {
  return (
    <figure className="mt-6 grid gap-4 sm:grid-cols-2">
      <Card variant="loud" />
      <Card variant="refined" />
    </figure>
  );
}
