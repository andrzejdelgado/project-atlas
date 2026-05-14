"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Variant = "loud" | "refined";

function Card({ variant }: { variant: Variant }) {
  const isOk = variant === "refined";
  return (
    <div className="border-border bg-card/40 relative flex flex-col gap-4 rounded-2xl border px-7 py-8">
      <span
        role="img"
        aria-label={isOk ? "contain: paint" : "no containment"}
        className={cn(
          "absolute top-4 right-4 size-2 rounded-full",
          isOk
            ? "bg-emerald-500 dark:bg-emerald-400"
            : "bg-red-500 dark:bg-red-400",
        )}
      />

      <div
        className={cn(
          "border-border/60 bg-secondary/40 relative h-32 rounded-xl border",
          isOk && "[contain:paint]",
        )}
        style={{ overflow: isOk ? "hidden" : "visible" }}
      >
        <div className="flex h-full flex-col justify-center gap-2 px-4">
          <span className="text-muted-foreground/70 font-mono text-2xs uppercase tracking-mini">
            Activity
          </span>
          <span className="text-foreground text-base font-semibold tabular-nums">
            218 events · 1h
          </span>
          <span className="text-muted-foreground/70 text-xs">
            Live span — rerenders every frame.
          </span>
        </div>

        <span
          aria-hidden="true"
          className={cn(
            "containment-blob pointer-events-none absolute size-24 rounded-full opacity-90",
            isOk ? "bg-emerald-400" : "bg-red-400",
          )}
          style={{
            top: "50%",
            right: "-32px",
            marginTop: -48,
          }}
        />

        <style>{`
          @keyframes containment-pulse {
            0%, 100% { transform: translateX(0) scale(1); filter: blur(20px); opacity: 0.55; }
            50%      { transform: translateX(-44px) scale(1.18); filter: blur(28px); opacity: 0.85; }
          }
          .containment-blob { animation: containment-pulse 2.6s ease-in-out infinite; }
        `}</style>
      </div>

      <span className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini">
        {isOk
          ? "Paint is sealed inside the card boundary. Sibling regions skip repaint."
          : "Blob bleeds beyond the card edge — siblings repaint every frame."}
      </span>
    </div>
  );
}

export function CssContainmentDemo() {
  return (
    <figure className="mt-6 grid gap-4 sm:grid-cols-2">
      <Card variant="loud" />
      <Card variant="refined" />
    </figure>
  );
}
