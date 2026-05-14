"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Stage = "layout" | "paint" | "composite";

type Technique = {
  id: "left" | "bg" | "transform";
  label: string;
  stages: Stage[];
  tone: "ok" | "edge" | "bad";
};

const TECHNIQUES: Technique[] = [
  {
    id: "left",
    label: "left",
    stages: ["layout", "paint", "composite"],
    tone: "bad",
  },
  {
    id: "bg",
    label: "background, box-shadow",
    stages: ["paint", "composite"],
    tone: "edge",
  },
  {
    id: "transform",
    label: "transform: translateX",
    stages: ["composite"],
    tone: "ok",
  },
];

const ALL_STAGES: Stage[] = ["layout", "paint", "composite"];

const TONE: Record<
  "ok" | "edge" | "bad",
  { dot: string; text: string; pill: string; box: string }
> = {
  ok: {
    dot: "bg-emerald-500 dark:bg-emerald-400",
    text: "text-emerald-700 dark:text-emerald-300",
    pill: "border-emerald-500/45 bg-emerald-500/12 text-emerald-700 dark:border-emerald-400/45 dark:bg-emerald-400/15 dark:text-emerald-300",
    box: "bg-emerald-500 dark:bg-emerald-400",
  },
  edge: {
    dot: "bg-amber-500 dark:bg-amber-400",
    text: "text-amber-700 dark:text-amber-400",
    pill: "border-amber-500/45 bg-amber-500/12 text-amber-700 dark:border-amber-400/45 dark:bg-amber-400/15 dark:text-amber-400",
    box: "bg-amber-500 dark:bg-amber-400",
  },
  bad: {
    dot: "bg-red-500 dark:bg-red-400",
    text: "text-red-700 dark:text-red-300",
    pill: "border-red-500/45 bg-red-500/12 text-red-700 dark:border-red-400/45 dark:bg-red-400/15 dark:text-red-300",
    box: "bg-red-500 dark:bg-red-400",
  },
};

function ReplayIcon() {
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
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}

function Lane({ technique }: { technique: Technique }) {
  const tone = TONE[technique.tone];
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            "shrink-0 font-mono text-xs",
            tone.text,
          )}
        >
          {technique.label}
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {ALL_STAGES.map((stage) => {
            const triggered = technique.stages.includes(stage);
            return (
              <span
                key={stage}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-2xs uppercase tracking-mini transition-colors",
                  triggered
                    ? tone.pill
                    : "border-border/55 bg-secondary/30 text-muted-foreground/55",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    triggered ? tone.dot : "bg-muted-foreground/30",
                  )}
                />
                {stage}
              </span>
            );
          })}
        </div>
      </div>
      <div
        className={cn(
          "co-lane border-border/60 bg-secondary/20 relative h-10 rounded-xl border",
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "co-box co-box--" + technique.id,
            technique.id !== "bg" && tone.box,
          )}
        />
      </div>
    </div>
  );
}

export function CompositorOnlyDemo() {
  const [runKey, setRunKey] = React.useState(0);
  const replay = () => setRunKey((k) => k + 1);

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-8 py-9">
      <style>{`
        .co-lane {
          container-type: inline-size;
        }
        .co-box {
          position: absolute;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          top: 50%;
        }
        .co-box--left {
          left: 8px;
          transform: translateY(-50%);
          animation: co-anim-left 1400ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes co-anim-left {
          from { left: 8px; }
          to   { left: calc(100% - 36px); }
        }

        .co-box--bg {
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: oklch(70% 0.18 25);
          animation: co-anim-bg 1400ms ease-in-out forwards;
        }
        @keyframes co-anim-bg {
          0% {
            background-color: oklch(70% 0.18 25);
            box-shadow: 0 0 0 0 oklch(72% 0.18 25 / 0);
          }
          50% {
            background-color: oklch(78% 0.16 75);
            box-shadow: 0 0 22px 4px oklch(78% 0.16 75 / 0.55);
          }
          100% {
            background-color: oklch(72% 0.16 165);
            box-shadow: 0 0 14px 2px oklch(72% 0.16 165 / 0.45);
          }
        }

        .co-box--transform {
          left: 8px;
          transform: translate(0, -50%);
          animation: co-anim-tf 1400ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes co-anim-tf {
          from { transform: translate(0, -50%); }
          to   { transform: translate(calc(100cqw - 44px), -50%); }
        }
      `}</style>

      <p className="text-muted-foreground mb-7 text-sm leading-relaxed">
        Each technique below moves or alters a single 28-pixel box for the
        same 1400 ms. The pills next to each lane mark which pipeline stages
        fire every frame.{" "}
        <span className="text-emerald-700 dark:text-emerald-300">
          transform
        </span>{" "}
        and{" "}
        <span className="text-red-700 dark:text-red-300">left</span>{" "}
        look identical — but transform skips Layout and Paint entirely.
      </p>

      <div key={runKey} className="flex flex-col gap-6">
        {TECHNIQUES.map((t) => (
          <Lane key={t.id} technique={t} />
        ))}
      </div>

      <div className="mt-7 flex items-center justify-between">
        <span className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini">
          same visual — different frame cost
        </span>
        <button
          type="button"
          onClick={replay}
          className="border-emerald-400/40 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-400/15 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors"
        >
          <ReplayIcon />
          Replay
        </button>
      </div>
    </figure>
  );
}
