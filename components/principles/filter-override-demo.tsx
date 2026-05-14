"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Mode = "source" | "filter" | "native";

type StatusKind = "info" | "success" | "warning" | "danger";

type Notif = {
  kind: StatusKind;
  title: string;
  desc: string;
  time: string;
};

const NOTIFS: Notif[] = [
  {
    kind: "info",
    title: "File sync complete",
    desc: "design-system.fig synced to Cloud — 2.4 MB",
    time: "2m ago",
  },
  {
    kind: "success",
    title: "Build deployed",
    desc: "build-prod-2486 promoted to production",
    time: "just now",
  },
  {
    kind: "warning",
    title: "Storage almost full",
    desc: "92% of 50 GB used — consider archiving older projects",
    time: "5m ago",
  },
  {
    kind: "danger",
    title: "Sign-in from new device",
    desc: "macOS · Tucson, AZ — wasn't you?",
    time: "23m ago",
  },
];

const NATIVE_COLORS: Record<StatusKind, string> = {
  info: "oklch(72% 0.16 230)",
  success: "oklch(72% 0.15 165)",
  warning: "oklch(78% 0.16 75)",
  danger: "oklch(70% 0.18 25)",
};

const FILTER_CHAINS: Record<StatusKind, string> = {
  info:
    "brightness(0) saturate(100%) invert(58%) sepia(46%) saturate(800%) hue-rotate(170deg) brightness(96%) contrast(95%)",
  success:
    "brightness(0) saturate(100%) invert(72%) sepia(60%) saturate(420%) hue-rotate(110deg) brightness(95%) contrast(92%)",
  warning:
    "brightness(0) saturate(100%) invert(78%) sepia(78%) saturate(640%) hue-rotate(360deg) brightness(102%) contrast(95%)",
  danger:
    "brightness(0) saturate(100%) invert(56%) sepia(78%) saturate(540%) hue-rotate(330deg) brightness(96%) contrast(96%)",
};

const CHIPS: { mode: Mode; label: string; tone: "red" | "amber" | "emerald" }[] = [
  { mode: "source", label: "No color", tone: "red" },
  { mode: "filter", label: "Filter", tone: "emerald" },
  { mode: "native", label: "Color", tone: "emerald" },
];

function Glyph({ kind }: { kind: StatusKind }) {
  if (kind === "info") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-full"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    );
  }
  if (kind === "success") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-full"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    );
  }
  if (kind === "warning") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-full"
      >
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-full"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" />
      <line x1="9.5" y1="9.5" x2="14.5" y2="14.5" />
      <line x1="14.5" y1="9.5" x2="9.5" y2="14.5" />
    </svg>
  );
}

function IconCell({ kind, mode }: { kind: StatusKind; mode: Mode }) {
  const wrap = "size-4";
  if (mode === "source") {
    return (
      <span className={cn(wrap, "text-foreground/95")}>
        <Glyph kind={kind} />
      </span>
    );
  }
  if (mode === "native") {
    return (
      <span className={wrap} style={{ color: NATIVE_COLORS[kind] }}>
        <Glyph kind={kind} />
      </span>
    );
  }
  return (
    <span
      className={cn(wrap, "text-foreground/95")}
      style={{ filter: FILTER_CHAINS[kind] }}
    >
      <Glyph kind={kind} />
    </span>
  );
}

export function FilterOverrideDemo() {
  const [mode, setMode] = React.useState<Mode>("filter");
  const isOk = mode !== "source";
  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-8 py-9">
      <span
        role="img"
        aria-label={isOk ? "Recoloring applied" : "No recoloring"}
        className={cn(
          "absolute top-4 right-4 size-2 rounded-full transition-colors duration-200",
          isOk ? "bg-emerald-400" : "bg-red-400",
        )}
      />

      <div
        role="radiogroup"
        aria-label="Icon coloring strategy"
        className="mb-7 flex flex-wrap gap-2"
      >
        {CHIPS.map((c) => {
          const active = c.mode === mode;
          return (
            <button
              key={c.mode}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setMode(c.mode)}
              className={cn(
                "rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
                active && c.tone === "red" &&
                  "border-red-400/40 bg-red-400/10 text-red-300",
                active && c.tone === "emerald" &&
                  "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
                !active &&
                  "border-border/60 text-muted-foreground hover:text-foreground hover:border-border bg-transparent",
              )}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="border-border/60 bg-muted/20 rounded-xl border">
        <div className="border-border/60 flex items-center justify-between border-b px-5 py-3.5">
          <span className="text-foreground text-sm font-medium">
            Notifications
          </span>
          <span className="bg-emerald-400/15 text-emerald-300 rounded-full px-2 py-0.5 font-mono text-2xs tracking-mini lowercase">
            5 new
          </span>
        </div>
        <ul className="divide-border/40 divide-y">
          {NOTIFS.map((n) => (
            <li key={n.title} className="flex items-start gap-3 px-5 py-3">
              <span
                className={cn(
                  "border-border/40 grid size-7 shrink-0 place-items-center rounded-md border",
                  mode === "source" ? "bg-card/60" : "bg-card/80",
                )}
              >
                <IconCell kind={n.kind} mode={mode} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm">{n.title}</p>
                <p className="text-muted-foreground/80 truncate text-xs">
                  {n.desc}
                </p>
              </div>
              <span className="text-muted-foreground/60 shrink-0 font-mono text-2xs tabular-nums">
                {n.time}
              </span>
            </li>
          ))}
        </ul>
        <div className="border-border/60 flex items-center justify-between border-t px-5 py-3">
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground font-mono text-2xs uppercase tracking-mini transition-colors"
          >
            Mark all as read
          </button>
          <button
            type="button"
            className="text-emerald-300 hover:text-emerald-200 font-mono text-2xs uppercase tracking-mini transition-colors"
          >
            View all →
          </button>
        </div>
      </div>
    </figure>
  );
}
