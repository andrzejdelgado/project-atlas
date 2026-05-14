"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const TEXT =
  "Skeleton screens match the final layout. Below 1 s, no loader at all. Above 10 s, engagement — not skeleton.";

const TOKENS = TEXT.split(/(\s+)/);

type Mode = "instant" | "paced";

export function StreamingPacingDemo() {
  const [runKey, setRunKey] = React.useState(0);
  const [instantTokens, setInstantTokens] = React.useState(0);
  const [pacedTokens, setPacedTokens] = React.useState(0);
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = React.useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  React.useEffect(() => () => clear(), [clear]);

  const play = React.useCallback(() => {
    clear();
    setInstantTokens(0);
    setPacedTokens(0);

    // Instant: blast all tokens within ~600ms (jittery feel)
    TOKENS.forEach((_, i) => {
      const t = setTimeout(() => setInstantTokens(i + 1), 8 + Math.random() * 18);
      timers.current.push(t);
    });

    // Paced: ~70ms per word-token, ~10ms per whitespace, with slight jitter
    let cursor = 0;
    TOKENS.forEach((tok, i) => {
      const dur = /\s/.test(tok) ? 8 : 56 + Math.random() * 36;
      cursor += dur;
      const t = setTimeout(() => setPacedTokens(i + 1), cursor);
      timers.current.push(t);
    });
  }, [clear]);

  React.useEffect(() => {
    play();
  }, [runKey, play]);

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-6 py-7 sm:px-8 sm:py-9">
      <span
        role="img"
        aria-label="Streaming pacing"
        className="bg-emerald-500 dark:bg-emerald-400 absolute top-4 right-4 size-2 rounded-full"
      />

      <p className="text-muted-foreground mb-5 max-w-[58ch] text-sm leading-relaxed">
        Same response, two paces. The left blasts tokens at network speed and
        jitters the eye. The right releases them at a natural reading rhythm.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <StreamLane
          title="Instant per-token"
          tone="bad"
          tokens={TOKENS.slice(0, instantTokens)}
        />
        <StreamLane
          title="Paced reading rhythm"
          tone="ok"
          tokens={TOKENS.slice(0, pacedTokens)}
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini">
          ~70 ms per word · ~10 ms per gap
        </p>
        <button
          type="button"
          onClick={() => setRunKey((k) => k + 1)}
          className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/45 dark:bg-emerald-400/12 dark:text-emerald-300 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors"
        >
          Replay
        </button>
      </div>
    </figure>
  );
}

function StreamLane({
  title,
  tone,
  tokens,
}: {
  title: string;
  tone: "ok" | "bad";
  tokens: string[];
}) {
  return (
    <div
      className={cn(
        "border-border/60 bg-muted/15 rounded-xl border px-4 py-4",
        tone === "bad"
          ? "border-red-500/30 dark:border-red-400/30"
          : "border-emerald-500/30 dark:border-emerald-400/30",
      )}
    >
      <span
        className={cn(
          "font-mono text-2xs uppercase tracking-mini",
          tone === "bad"
            ? "text-red-700 dark:text-red-300"
            : "text-emerald-700 dark:text-emerald-300",
        )}
      >
        {title}
      </span>
      <p className="text-foreground/90 mt-2 min-h-[6rem] text-sm leading-relaxed">
        {tokens.join("")}
        <span aria-hidden="true" className="text-muted-foreground/50">
          {tokens.length === TOKENS.length ? "" : "▍"}
        </span>
      </p>
    </div>
  );
}
