"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Entry = {
  id: string;
  word: string;
  meta: string;
  definition: string;
  aliases: string[];
};

const ENTRIES: Entry[] = [
  {
    id: "drawer",
    word: "drawer",
    meta: "n. · containment · side-anchored",
    definition:
      "A panel that slides into view from a viewport edge to host secondary content.",
    aliases: ["sheet", "side panel", "slide-over", "slideout", "right rail"],
  },
  {
    id: "tooltip",
    word: "tooltip",
    meta: "n. · annotation · ephemeral",
    definition:
      "A short, hover- or focus-triggered label that names or explains the element under the pointer.",
    aliases: ["hint", "bubble", "annotation", "label hover"],
  },
  {
    id: "modal",
    word: "modal",
    meta: "n. · interruption · blocking",
    definition:
      "A focused surface that suspends the rest of the UI until the user resolves it.",
    aliases: ["dialog", "overlay", "lightbox", "popup window"],
  },
  {
    id: "toast",
    word: "toast",
    meta: "n. · transient · non-blocking",
    definition:
      "A non-blocking notification that fades in, lingers briefly, then dismisses itself.",
    aliases: ["snackbar", "flash message", "notification", "growl"],
  },
  {
    id: "popover",
    word: "popover",
    meta: "n. · contextual · anchored",
    definition:
      "An anchored surface that opens next to a trigger to host short, contextual interactions.",
    aliases: ["dropdown", "flyout", "menu", "context panel"],
  },
];

export function UicruxHero() {
  const [index, setIndex] = React.useState(0);
  const entry = ENTRIES[index];
  const total = ENTRIES.length;

  return (
    <figure className="border-border bg-card/40 relative mt-6 overflow-hidden rounded-2xl border">
      {/* Top meta row */}
      <div className="border-border/50 flex items-center justify-between border-b px-6 py-3 sm:px-8">
        <span className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini">
          The Crux Glossary
        </span>
        <span className="text-muted-foreground/55 font-mono text-2xs uppercase tracking-mini tabular-nums">
          {String(index + 1).padStart(2, "0")} <span className="text-muted-foreground/35">/</span> {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* Main editorial slab */}
      <div className="px-6 py-8 sm:px-8 sm:py-10">
        <h2 className="text-foreground text-[2.75rem] font-semibold leading-[0.95] tracking-tight sm:text-6xl">
          {entry.word}
        </h2>
        <p className="text-muted-foreground/75 mt-3 font-mono text-2xs uppercase tracking-mini">
          {entry.meta}
        </p>
        <p className="text-foreground/85 mt-5 text-sm leading-relaxed sm:text-base">
          {entry.definition}
        </p>
      </div>

      {/* Aliases row */}
      <div className="border-border/50 border-t px-6 py-5 sm:px-8">
        <p className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini">
          Also called — and replaced by the crux above
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {entry.aliases.map((alias) => (
            <span
              key={alias}
              className="border-border/70 text-muted-foreground/55 inline-flex items-center rounded-md border bg-transparent px-2 py-0.5 font-mono text-2xs uppercase tracking-mini line-through decoration-muted-foreground/40"
            >
              {alias}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom entry rail */}
      <div
        role="tablist"
        aria-label="Glossary entry"
        className="border-border/50 bg-secondary/15 flex border-t"
      >
        {ENTRIES.map((e, i) => {
          const isActive = i === index;
          return (
            <button
              key={e.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setIndex(i)}
              className={cn(
                "border-border/50 group relative flex h-12 flex-1 items-center justify-center gap-2 border-r transition-colors duration-200 last:border-r-0",
                isActive
                  ? "bg-violet-500/12 text-violet-700 dark:bg-violet-400/12 dark:text-violet-300"
                  : "hover:bg-secondary/40 text-muted-foreground/65 hover:text-foreground",
              )}
            >
              <span className="font-mono text-2xs uppercase tracking-mini tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="hidden font-mono text-2xs uppercase tracking-mini sm:inline">
                {e.word}
              </span>
              {isActive && (
                <span
                  aria-hidden="true"
                  className="bg-violet-500 dark:bg-violet-400 pointer-events-none absolute inset-x-0 bottom-0 h-0.5"
                />
              )}
            </button>
          );
        })}
      </div>
    </figure>
  );
}
