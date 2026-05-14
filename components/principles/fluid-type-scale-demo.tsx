"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const MIN_WIDTH = 320;

type Sample = {
  label: string;
  text: string;
  splitAt?: string;
  min: string;
  val: string;
  max: string;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: string;
};

const SAMPLES: Sample[] = [
  {
    label: "display",
    text: "Type scale",
    min: "1.25rem",
    val: "5cqw + 0.25rem",
    max: "2.5rem",
    fontWeight: 700,
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
  },
  {
    label: "heading",
    text: "Section heading",
    min: "1rem",
    val: "3cqw + 0.2rem",
    max: "1.5rem",
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
  },
  {
    label: "subhead",
    text: "Subheading",
    min: "0.9rem",
    val: "2cqw + 0.15rem",
    max: "1.25rem",
    fontWeight: 500,
    lineHeight: 1.3,
    letterSpacing: "-0.01em",
  },
  {
    label: "body",
    text: "Body text reads comfortably at 1.7 line-height with no tracking adjustment. The generous space between lines lets the eye move from the end of one line to the beginning of the next without effort. Tighter line-height — 1.3 or 1.4 — works for single-line labels but causes lines to feel stacked and compressed in paragraph form.",
    splitAt: "Body text",
    min: "0.875rem",
    val: "1.5cqw + 0.1rem",
    max: "1rem",
    fontWeight: 400,
    lineHeight: 1.7,
    letterSpacing: "0",
  },
  {
    label: "label",
    text: "Label / caption context",
    min: "0.75rem",
    val: "1cqw + 0.05rem",
    max: "0.8125rem",
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: "0.04em",
  },
];

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="border-border/50 bg-muted/40 text-muted-foreground tracking-mini mx-1.5 inline-block rounded-full border px-2 py-0.5 align-middle font-mono text-2xs font-medium uppercase whitespace-nowrap">
      {children}
    </span>
  );
}

export function FluidTypeScaleDemo() {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState<number | null>(null);
  const [maxWidth, setMaxWidth] = React.useState<number | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  React.useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    const w = wrapperRef.current.offsetWidth;
    setMaxWidth(w);
    setWidth(w);
  }, []);

  const updateFromX = React.useCallback((clientX: number) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const next = Math.max(MIN_WIDTH, Math.min(rect.width, x));
    setWidth(next);
  }, []);

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
    e.preventDefault();
    setIsDragging(true);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    let next = width ?? 0;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next -= 10;
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") next += 10;
    else if (e.key === "PageDown") next -= 50;
    else if (e.key === "PageUp") next += 50;
    else if (e.key === "Home") next = MIN_WIDTH;
    else if (e.key === "End") next = maxWidth ?? next;
    else return;
    e.preventDefault();
    setWidth(Math.max(MIN_WIDTH, Math.min(maxWidth ?? Infinity, next)));
  };

  const showWidth = width ?? 0;
  const showMax = maxWidth ?? 0;

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-10 py-12">
      <span
        role="img"
        aria-label="Fluid scaling applied"
        className="bg-emerald-400 absolute top-4 right-4 size-2 rounded-full"
      />

      <p className="text-muted-foreground mb-7 text-sm">
        Drag the handle — every sample scales smoothly with the container width.
      </p>

      <div
        ref={wrapperRef}
        className={cn("relative", isDragging && "select-none")}
      >
        <div
          className="border-border/60 bg-muted/20 relative rounded-xl border"
          style={{
            width: width !== null ? `${width}px` : "100%",
            containerType: "inline-size",
          }}
        >
          <div className="flex flex-col gap-6 px-6 py-7">
            {SAMPLES.map((s) => (
              <p
                key={s.label}
                className="text-foreground"
                style={{
                  fontSize: `clamp(${s.min}, ${s.val}, ${s.max})`,
                  lineHeight: s.lineHeight,
                  letterSpacing: s.letterSpacing,
                  fontWeight: s.fontWeight,
                }}
              >
                {s.splitAt ? (
                  <>
                    {s.splitAt}
                    <Badge>{s.label}</Badge>
                    {s.text.slice(s.splitAt.length)}
                  </>
                ) : (
                  <>
                    {s.text}
                    <Badge>{s.label}</Badge>
                  </>
                )}
              </p>
            ))}
          </div>

          <button
            type="button"
            onPointerDown={onPointerDown}
            onKeyDown={onKeyDown}
            role="slider"
            aria-label="Resize container width"
            aria-orientation="horizontal"
            aria-valuemin={MIN_WIDTH}
            aria-valuemax={maxWidth ?? undefined}
            aria-valuenow={Math.round(showWidth)}
            aria-valuetext={`${Math.round(showWidth)} pixels`}
            className={cn(
              "border-border bg-card text-muted-foreground hover:border-emerald-400/60 hover:text-foreground focus-visible:ring-emerald-400/40 absolute top-1/2 right-0 flex h-12 w-3.5 -translate-y-1/2 translate-x-1/2 cursor-ew-resize items-center justify-center rounded-md border shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
              isDragging && "border-emerald-400/80 text-foreground",
            )}
          >
            <svg
              width="6"
              height="14"
              viewBox="0 0 6 14"
              fill="none"
              aria-hidden="true"
            >
              <line
                x1="1.5"
                y1="2"
                x2="1.5"
                y2="12"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
              />
              <line
                x1="4.5"
                y1="2"
                x2="4.5"
                y2="12"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="text-muted-foreground/60 mt-4 flex items-baseline justify-between font-mono text-xs">
          <span className="tabular-nums">{MIN_WIDTH}px</span>
          <span className="text-foreground/70 tabular-nums">
            {Math.round(showWidth)}px
          </span>
          <span className="tabular-nums">{Math.round(showMax)}px</span>
        </div>
      </div>
    </figure>
  );
}
