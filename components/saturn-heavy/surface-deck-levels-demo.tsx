"use client";

import * as React from "react";
import Image from "next/image";
import { Minus, Moon, Plus, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

// Each level only knows the level directly below it. Surface lightness and
// shadow depth are computed from that local relationship, not from an
// absolute elevation value. Below is a small playground that demonstrates
// the cascade: add or remove levels, switch modes, and watch every surface
// re-resolve. The innermost deck always carries the same Saturn promo as
// the Backgrounds-vs-Surfaces demo so the two can be read together.

const MIN = 1;
const MAX = 5;

type Mode = "light" | "dark";

// Light theme: surfaces step gently darker as the stack deepens (deck 1
// lifts off the page, then each child recesses slightly into its parent so
// the local delta stays readable without turning into a papier-mâché
// diorama).
const LIGHTNESS_LIGHT = [
  null,
  0.965,
  0.94,
  0.915,
  0.89,
  0.865,
];

// Dark theme: the page is the darkest surface; every deeper deck lifts off
// its parent by stepping lighter — a clean monotonic cascade.
const LIGHTNESS_DARK = [
  null,
  0.22,
  0.26,
  0.3,
  0.34,
  0.38,
];

const SURFACE_LIGHT = (l: number) => `oklch(${l} 0.005 85)`;
const SURFACE_DARK = (l: number) => `oklch(${l} 0 0)`;

const PAGE_LIGHT = "#f0eee6";
const PAGE_DARK = "oklch(0.18 0 0)";
const FG_LIGHT = "oklch(0.18 0.02 264)";
const FG_DARK = "oklch(0.95 0.005 264)";
const MUTED_LIGHT = "oklch(0.18 0.02 264 / 0.55)";
const MUTED_DARK = "oklch(0.95 0.005 264 / 0.55)";

// Slight border on every deck so adjacent levels separate even when the
// lightness step between them is small. Dark mode lifts off a lighter
// stroke; light mode recesses with a darker one.
const DECK_BORDER_LIGHT = "oklch(0 0 0 / 0.08)";
const DECK_BORDER_DARK = "oklch(1 0 0 / 0.1)";

// MER accent — keeps this demo visually coherent with the Backgrounds vs
// Surfaces demo above, which is also anchored on MER by default.
const ACCENT_LIGHT = "oklch(0.58 0.14 155)";
const ACCENT_DARK = "oklch(0.83 0.18 160)";

const SHADOW_LIGHT = [
  "",
  "0 2px 4px oklch(0 0 0 / 0.06)",
  "0 1.5px 3px oklch(0 0 0 / 0.05)",
  "0 1px 2px oklch(0 0 0 / 0.04)",
  "0 0.5px 1.5px oklch(0 0 0 / 0.03)",
  "0 0.5px 1px oklch(0 0 0 / 0.02)",
];
const SHADOW_DARK = [
  "",
  "0 2px 4px oklch(0 0 0 / 0.45)",
  "0 1.5px 3px oklch(0 0 0 / 0.36)",
  "0 1px 2px oklch(0 0 0 / 0.28)",
  "0 0.5px 1.5px oklch(0 0 0 / 0.22)",
  "0 0.5px 1px oklch(0 0 0 / 0.18)",
];

export function SurfaceDeckLevelsDemo() {
  const { resolvedTheme } = useTheme();
  const [count, setCount] = React.useState<number>(3);
  const [mode, setMode] = React.useState<Mode>("dark");
  const userOverrodeRef = React.useRef(false);

  React.useEffect(() => {
    if (userOverrodeRef.current) return;
    if (resolvedTheme === "light" || resolvedTheme === "dark") {
      setMode(resolvedTheme);
    }
  }, [resolvedTheme]);

  const pickMode = (m: Mode) => {
    userOverrodeRef.current = true;
    setMode(m);
  };

  const isDark = mode === "dark";
  const lightness = isDark ? LIGHTNESS_DARK : LIGHTNESS_LIGHT;
  const surface = isDark ? SURFACE_DARK : SURFACE_LIGHT;
  const shadow = isDark ? SHADOW_DARK : SHADOW_LIGHT;
  const pageBg = isDark ? PAGE_DARK : PAGE_LIGHT;
  const fg = isDark ? FG_DARK : FG_LIGHT;
  const mutedFg = isDark ? MUTED_DARK : MUTED_LIGHT;
  const accent = isDark ? ACCENT_DARK : ACCENT_LIGHT;
  const deckBorder = isDark ? DECK_BORDER_DARK : DECK_BORDER_LIGHT;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            role="group"
            aria-label="Deck level count"
            className="border-border/60 bg-background/40 inline-flex shrink-0 rounded-md border p-0.5"
          >
            <button
              type="button"
              onClick={() => setCount((c) => Math.max(MIN, c - 1))}
              disabled={count <= MIN}
              aria-label="Remove a deck level"
              className="text-muted-foreground hover:text-foreground inline-flex items-center justify-center rounded-sm px-2 py-1 transition-colors disabled:opacity-30"
            >
              <Minus className="size-3" />
            </button>
            <button
              type="button"
              onClick={() => setCount((c) => Math.min(MAX, c + 1))}
              disabled={count >= MAX}
              aria-label="Add a deck level"
              className="text-muted-foreground hover:text-foreground inline-flex items-center justify-center rounded-sm px-2 py-1 transition-colors disabled:opacity-30"
            >
              <Plus className="size-3" />
            </button>
          </div>
          <span
            aria-live="polite"
            aria-label={`${count} deck level${count === 1 ? "" : "s"}`}
            className="border-border/60 bg-background/40 text-foreground/85 inline-flex h-[26px] min-w-[28px] items-center justify-center rounded-md border px-2 font-mono text-2xs tabular-nums"
          >
            {count}
          </span>
        </div>

        <div
          role="tablist"
          aria-label="Mode"
          className="border-border/60 bg-background/40 inline-flex shrink-0 rounded-md border p-0.5"
        >
          {(["light", "dark"] as Mode[]).map((m) => {
            const Icon = m === "light" ? Sun : Moon;
            const active = m === mode;
            return (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={m}
                onClick={() => pickMode(m)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 font-mono text-2xs uppercase tracking-mini transition-colors",
                  active
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-3" aria-hidden="true" />
                <span className="hidden sm:inline">{m}</span>
              </button>
            );
          })}
        </div>
      </div>

      <SurfaceNest
        depth={count}
        lightness={lightness}
        surface={surface}
        shadow={shadow}
        pageBg={pageBg}
        fg={fg}
        mutedFg={mutedFg}
        accent={accent}
        deckBorder={deckBorder}
        mode={mode}
      />
    </div>
  );
}

type SurfaceNestProps = {
  depth: number;
  lightness: (number | null)[];
  surface: (l: number) => string;
  shadow: string[];
  pageBg: string;
  fg: string;
  mutedFg: string;
  accent: string;
  deckBorder: string;
  mode: Mode;
};

function SurfaceNest({
  depth,
  lightness,
  surface,
  shadow,
  pageBg,
  fg,
  mutedFg,
  accent,
  deckBorder,
  mode,
}: SurfaceNestProps) {
  let inner: React.ReactNode = (
    <div className="px-3 pt-3 pb-1">
      <h4
        className="inline-block text-base font-semibold"
        style={{ color: fg }}
      >
        Saturn Heavy in production
      </h4>
      <p
        className="mt-1 text-sm leading-relaxed"
        style={{ color: fg, opacity: 0.75 }}
      >
        12 brand themes shipped from a single token spine — zero one-off
        overrides.
      </p>
      <button
        type="button"
        className={cn(
          "mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-md py-1.5 pr-3.5 pl-1.5 transition-[background-color,transform,box-shadow] duration-150 ease-out",
          "bg-[var(--accent-current)] hover:bg-[oklch(from_var(--accent-current)_calc(l_-_0.05)_c_h)] active:bg-[oklch(from_var(--accent-current)_calc(l_-_0.1)_c_h)] active:scale-[0.98]",
          "focus-visible:ring-2 focus-visible:ring-[oklch(from_var(--accent-current)_l_c_h_/_0.6)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] focus-visible:outline-none",
          "motion-reduce:transition-none motion-reduce:active:scale-100",
          "sm:w-auto sm:justify-start",
          mode === "light" ? "text-white" : "text-black",
        )}
        style={
          { ["--accent-current" as string]: accent } as React.CSSProperties
        }
      >
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-sm",
            mode === "light" ? "bg-white/15" : "bg-black/15",
          )}
        >
          <Image
            src="/case-studies/saturn-heavy.svg"
            alt=""
            width={20}
            height={20}
            aria-hidden="true"
          />
        </span>
        <span className="text-sm">
          <span className="sm:hidden">Launch Saturn</span>
          <span className="hidden sm:inline">Launch Saturn Heavy</span>
        </span>
      </button>
    </div>
  );

  for (let level = depth; level >= 1; level--) {
    const l = lightness[level] ?? 0.92;
    const sh = shadow[level] ?? shadow[1];
    inner = (
      <div
        key={level}
        className="rounded-lg border p-3 transition-[background-color,border-color,box-shadow] duration-300"
        style={{
          backgroundColor: surface(l),
          borderColor: deckBorder,
          boxShadow: sh,
          color: fg,
        }}
      >
        <p
          className="font-mono text-2xs uppercase tracking-mini"
          style={{ color: mutedFg }}
        >
          surface · deck {level}
        </p>
        <div className="mt-2">{inner}</div>
      </div>
    );
  }

  return (
    <div
      className="border-border/70 rounded-xl border p-4 transition-colors duration-300"
      style={{ backgroundColor: pageBg, color: fg }}
    >
      <p
        className="font-mono text-2xs uppercase tracking-mini"
        style={{ color: mutedFg }}
      >
        surface · deck 0 (page)
      </p>
      <div className="mt-3">{inner}</div>
    </div>
  );
}
