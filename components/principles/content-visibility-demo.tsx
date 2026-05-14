"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Mode = "auto" | "visible";

const TOTAL = 60;
const ITEMS = Array.from({ length: TOTAL }, (_, i) => ({
  id: i,
  title: `Activity ${String(i + 1).padStart(2, "0")}`,
  meta: ["sync", "deploy", "alert", "build", "snapshot"][i % 5],
  amount: `$${(Math.sin(i * 1.7) * 800 + 1200).toFixed(0)}`,
}));

export function ContentVisibilityDemo() {
  const [mode, setMode] = React.useState<Mode>("auto");
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = React.useState(TOTAL);
  const itemRefs = React.useRef<Map<number, HTMLElement>>(new Map());

  const recompute = React.useCallback(() => {
    const root = scrollRef.current;
    if (!root) return;
    const rootRect = root.getBoundingClientRect();
    let count = 0;
    itemRefs.current.forEach((el) => {
      const r = el.getBoundingClientRect();
      // Consider an item "rendered" if any part overlaps the viewport
      // (or near it — within ~600px buffer to mimic content-visibility)
      const buffer = mode === "auto" ? 200 : 4000;
      if (r.bottom > rootRect.top - buffer && r.top < rootRect.bottom + buffer) {
        count += 1;
      }
    });
    setVisibleCount(count);
  }, [mode]);

  React.useEffect(() => {
    recompute();
    const root = scrollRef.current;
    if (!root) return;
    root.addEventListener("scroll", recompute, { passive: true });
    return () => root.removeEventListener("scroll", recompute);
  }, [recompute]);

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-8 py-9">
      <span
        role="img"
        aria-label="content-visibility behavior"
        className={cn(
          "absolute top-4 right-4 size-2 rounded-full",
          mode === "auto"
            ? "bg-emerald-500 dark:bg-emerald-400"
            : "bg-red-500 dark:bg-red-400",
        )}
      />

      <div
        role="radiogroup"
        aria-label="Render strategy"
        className="mb-5 flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex flex-wrap gap-2">
          {(["auto", "visible"] as const).map((m) => {
            const active = m === mode;
            const ok = m === "auto";
            return (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setMode(m)}
                className={cn(
                  "rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
                  active && ok &&
                    "border-emerald-400/40 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300",
                  active && !ok &&
                    "border-red-400/40 bg-red-400/10 text-red-700 dark:text-red-300",
                  !active &&
                    "border-border/60 text-muted-foreground hover:text-foreground hover:border-border bg-transparent",
                )}
              >
                content-visibility: {m}
              </button>
            );
          })}
        </div>
        <span className="text-muted-foreground font-mono text-2xs tabular-nums">
          rendered{" "}
          <span
            className={cn(
              "tabular-nums",
              mode === "auto"
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-red-700 dark:text-red-300",
            )}
          >
            {visibleCount}
          </span>{" "}
          / {TOTAL}
        </span>
      </div>

      <div
        ref={scrollRef}
        className="border-border/60 bg-secondary/15 h-72 overflow-y-auto rounded-xl border px-5 py-4"
      >
        <div className="flex flex-col gap-2">
          {ITEMS.map((item) => (
            <div
              key={item.id}
              ref={(el) => {
                if (el) itemRefs.current.set(item.id, el);
                else itemRefs.current.delete(item.id);
              }}
              className="border-border/55 bg-card/80 flex items-center justify-between rounded-lg border px-4 py-3"
              style={{
                contentVisibility: mode === "auto" ? "auto" : "visible",
                containIntrinsicSize: "0 56px",
              }}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-foreground text-sm font-medium">
                  {item.title}
                </span>
                <span className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini">
                  {item.meta}
                </span>
              </div>
              <span className="text-muted-foreground font-mono text-xs tabular-nums">
                {item.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-muted-foreground/65 mt-3 text-center font-mono text-2xs">
        scroll inside · counter approximates the rendered window
      </p>
    </figure>
  );
}
