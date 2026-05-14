"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Cell = {
  cursor: React.CSSProperties["cursor"];
  label: string;
  hint: string;
  render: () => React.ReactNode;
};

function GripIcon() {
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
      <circle cx="9" cy="6" r="1" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="9" cy="18" r="1" />
      <circle cx="15" cy="6" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="15" cy="18" r="1" />
    </svg>
  );
}

function HelpIcon() {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function ResizeIcon() {
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
      <polyline points="9 18 3 12 9 6" />
      <polyline points="15 6 21 12 15 18" />
    </svg>
  );
}

const INHERIT: React.CSSProperties = { cursor: "inherit" };

const CELLS: Cell[] = [
  {
    cursor: "pointer",
    label: "pointer",
    hint: "Clickable button",
    render: () => (
      <button
        type="button"
        style={INHERIT}
        className="bg-secondary text-foreground border-border inline-flex items-center justify-center rounded-lg border px-3.5 py-1.5 text-sm font-medium"
      >
        Confirm
      </button>
    ),
  },
  {
    cursor: "text",
    label: "text",
    hint: "Editable input",
    render: () => (
      <span
        style={INHERIT}
        className="border-border/70 bg-background/60 text-muted-foreground inline-flex h-9 w-32 items-center rounded-md border px-3 text-sm"
      >
        Email…
      </span>
    ),
  },
  {
    cursor: "grab",
    label: "grab",
    hint: "Drag handle",
    render: () => (
      <span
        style={INHERIT}
        className="border-border/60 bg-secondary/40 text-muted-foreground/80 inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
      >
        <GripIcon />
        Reorder
      </span>
    ),
  },
  {
    cursor: "not-allowed",
    label: "not-allowed",
    hint: "Disabled action",
    render: () => (
      <button
        type="button"
        disabled
        style={INHERIT}
        className="border-border/40 text-muted-foreground/50 inline-flex items-center justify-center rounded-lg border bg-transparent px-3.5 py-1.5 text-sm font-medium"
      >
        Submit
      </button>
    ),
  },
  {
    cursor: "ew-resize",
    label: "ew-resize",
    hint: "Resize handle",
    render: () => (
      <span
        style={INHERIT}
        className="border-border/55 bg-secondary/30 text-muted-foreground/80 inline-flex h-9 items-center justify-center rounded-md border px-3"
      >
        <ResizeIcon />
      </span>
    ),
  },
  {
    cursor: "help",
    label: "help",
    hint: "Help tooltip",
    render: () => (
      <span
        style={INHERIT}
        className="border-border/55 text-muted-foreground/80 inline-flex size-9 items-center justify-center rounded-full border bg-transparent"
      >
        <HelpIcon />
      </span>
    ),
  },
];

export function CursorAffordanceDemo() {
  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-8 py-9">
      <span
        role="img"
        aria-label="Cursor affordance grid"
        className="bg-emerald-500 dark:bg-emerald-400 absolute top-4 right-4 size-2 rounded-full"
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {CELLS.map((c) => (
          <div
            key={c.label}
            className="border-border/60 bg-muted/15 flex flex-col items-center gap-3 rounded-xl border px-4 py-6 transition-colors hover:bg-muted/25"
            style={{ cursor: c.cursor }}
          >
            <div className="flex h-12 items-center justify-center">{c.render()}</div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-foreground font-mono text-xs">{c.label}</span>
              <span className="text-muted-foreground/65 text-2xs uppercase tracking-mini font-mono">
                {c.hint}
              </span>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}
