"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Row = {
  id: string;
  title: string;
  meta: string;
  pinned: boolean;
};

const INITIAL: Row[] = [
  { id: "a", title: "Atlas Dashboard", meta: "design-eng", pinned: false },
  { id: "b", title: "Pipeline tokens", meta: "infra", pinned: false },
  { id: "c", title: "Type ramp v3", meta: "typography", pinned: false },
  { id: "d", title: "Color audit", meta: "color", pinned: false },
  { id: "e", title: "Motion library", meta: "motion", pinned: false },
];

function PinIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="size-3.5"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
    </svg>
  );
}

function ShuffleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  );
}

function applyFlip(
  refs: Map<string, HTMLElement>,
  prev: Map<string, DOMRect>,
) {
  refs.forEach((el, id) => {
    const before = prev.get(id);
    if (!before) return;
    const after = el.getBoundingClientRect();
    const dy = before.top - after.top;
    const dx = before.left - after.left;
    if (dx === 0 && dy === 0) return;
    el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px)` },
        { transform: "translate(0, 0)" },
      ],
      {
        duration: 360,
        easing: "cubic-bezier(0.32, 0.72, 0, 1)",
        fill: "both",
      },
    );
  });
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function sortByPinned(rows: Row[]): Row[] {
  return [...rows].sort((a, b) => Number(b.pinned) - Number(a.pinned));
}

export function FlipDemo() {
  const [rows, setRows] = React.useState<Row[]>(INITIAL);
  const refs = React.useRef<Map<string, HTMLElement>>(new Map());
  const prev = React.useRef<Map<string, DOMRect>>(new Map());

  const snapshot = React.useCallback(() => {
    const map = new Map<string, DOMRect>();
    refs.current.forEach((el, id) => {
      map.set(id, el.getBoundingClientRect());
    });
    prev.current = map;
  }, []);

  React.useLayoutEffect(() => {
    if (prev.current.size === 0) return;
    applyFlip(refs.current, prev.current);
    prev.current = new Map();
  }, [rows]);

  const togglePin = (id: string) => {
    snapshot();
    setRows((rs) =>
      sortByPinned(
        rs.map((r) => (r.id === id ? { ...r, pinned: !r.pinned } : r)),
      ),
    );
  };

  const handleShuffle = () => {
    snapshot();
    setRows((rs) => shuffle(rs));
  };

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-8 py-9">
      <span
        role="img"
        aria-label="FLIP layout animation"
        className="bg-emerald-500 dark:bg-emerald-400 absolute top-4 right-4 size-2 rounded-full"
      />

      <div className="border-border/60 bg-muted/15 mb-5 flex flex-col gap-2 rounded-xl border p-3">
        {rows.map((row) => (
          <div
            key={row.id}
            ref={(el) => {
              if (el) refs.current.set(row.id, el);
              else refs.current.delete(row.id);
            }}
            className={cn(
              "border-border/55 flex items-center gap-3 rounded-lg border px-3.5 py-2.5",
              row.pinned ? "bg-emerald-400/10" : "bg-card/70",
            )}
          >
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                row.pinned
                  ? "bg-emerald-500 dark:bg-emerald-400"
                  : "bg-muted-foreground/30",
              )}
            />
            <div className="flex flex-1 flex-col gap-0">
              <span className="text-foreground text-sm font-medium">
                {row.title}
              </span>
              <span className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini">
                {row.meta}
              </span>
            </div>
            <button
              type="button"
              onClick={() => togglePin(row.id)}
              aria-label={row.pinned ? "Unpin" : "Pin"}
              className={cn(
                "rounded-md p-1.5 transition-colors",
                row.pinned
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-muted-foreground/65 hover:text-foreground",
              )}
            >
              <PinIcon filled={row.pinned} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini">
          transform-only · WAAPI
        </span>
        <button
          type="button"
          onClick={handleShuffle}
          className="border-emerald-400/40 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-400/15 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors"
        >
          <ShuffleIcon />
          Shuffle
        </button>
      </div>
    </figure>
  );
}
