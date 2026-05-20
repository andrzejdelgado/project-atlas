"use client";

// HueClassificationDemo — interactive demo of how APCA Luminance (L) plus
// alpha-blended sRGB decides which Tone band a colour falls into.
//
// The user can pick a foreground colour, an opacity, and a background. The
// component blends fg over bg with the chosen alpha (newR/newG/newB), computes
// L using the WCAG / APCA luminance coefficients, and renders the band the
// colour lands in on a 0–255 L scale.

import * as React from "react";
import { Sparkles } from "lucide-react";

// Thresholds on the L scale (0–255).
// T_DARK = 64 sits below the WCAG 4.5:1 crossover (~L=46) but above the
// "black text fails for normal copy" point — it's where white text becomes
// the obviously safer call on any branded button while still keeping a
// meaningful evenTone band (64–190) for the brand to decide.
// T_LIGHT ≈ 0.75 · 255: above this, white text fails for normal copy and
// black text auto-wins.
const T_DARK = 64;
const T_LIGHT = 191;
const L_MAX = 255;

type Rgb = { r: number; g: number; b: number };

function parseHex(input: string): Rgb | null {
  const m = input.replace(/^#/, "").match(/^[0-9a-f]{6}$/i);
  if (!m) return null;
  const n = parseInt(m[0], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function clamp(n: number, lo = 0, hi = 255): number {
  return Math.max(lo, Math.min(hi, n));
}

function toHex(rgb: Rgb): string {
  return (
    "#" +
    [rgb.r, rgb.g, rgb.b]
      .map((v) => clamp(Math.round(v)).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

function luminance(rgb: Rgb): number {
  return 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
}

function blend(fg: Rgb, bg: Rgb, alpha: number): Rgb {
  return {
    r: bg.r + alpha * (fg.r - bg.r),
    g: bg.g + alpha * (fg.g - bg.g),
    b: bg.b + alpha * (fg.b - bg.b),
  };
}

type Band = "darkTone" | "evenTone" | "lightTone";

function classify(L: number): Band {
  if (L < T_DARK) return "darkTone";
  if (L >= T_LIGHT) return "lightTone";
  return "evenTone";
}

const BAND_RULE: Record<Band, string> = {
  darkTone: "light fg · auto",
  evenTone: "brand · override",
  lightTone: "dark fg · auto",
};

export function HueClassificationDemo() {
  const [hex, setHex] = React.useState("#29EA9E");
  const [opacityPct, setOpacityPct] = React.useState(100);
  const [bgHex, setBgHex] = React.useState("#FFFFFF");

  const fg = parseHex(hex) ?? { r: 41, g: 234, b: 158 };
  const bg = parseHex(bgHex) ?? { r: 255, g: 255, b: 255 };
  const alpha = opacityPct / 100;
  const blended = blend(fg, bg, alpha);
  const blendedRounded: Rgb = {
    r: Math.round(blended.r),
    g: Math.round(blended.g),
    b: Math.round(blended.b),
  };
  const L = luminance(blended);
  const band = classify(L);
  const indicatorLeft = `${(clamp(L, 0, L_MAX) / L_MAX) * 100}%`;
  const composedHex = toHex(blendedRounded);

  function commitHex(value: string, setter: (v: string) => void) {
    const normalized = value.startsWith("#") ? value : `#${value}`;
    if (/^#[0-9a-f]{6}$/i.test(normalized)) {
      setter(normalized.toUpperCase());
    }
  }

  return (
    <div className="space-y-5">
      <p className="text-muted-foreground font-mono text-2xs uppercase tracking-mini">
        Color Tonality Classification
      </p>

      <div className="space-y-3">
        <ControlRow label="Color">
          <input
            type="color"
            value={hex}
            onChange={(e) => setHex(e.target.value.toUpperCase())}
            className="border-border/60 size-8 shrink-0 cursor-pointer appearance-none rounded-md border bg-transparent p-0.5 [&::-moz-color-swatch]:rounded-[3px] [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-[3px] [&::-webkit-color-swatch]:border-0"
            aria-label="Pick foreground colour"
          />
          <input
            type="text"
            value={hex}
            onChange={(e) => commitHex(e.target.value, setHex)}
            className="border-border/40 bg-background/40 text-foreground/90 w-24 rounded border px-2 py-1 font-mono text-xs uppercase"
            spellCheck={false}
            aria-label="Foreground hex"
          />
        </ControlRow>

        <ControlRow label="Opacity">
          <input
            type="range"
            min={0}
            max={100}
            value={opacityPct}
            onChange={(e) => setOpacityPct(Number(e.target.value))}
            className="accent-foreground/80 h-1 flex-1 cursor-pointer"
            aria-label="Foreground opacity"
          />
          <span className="text-foreground/85 w-12 text-right font-mono text-xs tabular-nums">
            {opacityPct}%
          </span>
        </ControlRow>

        <ControlRow label="Background">
          <input
            type="color"
            value={bgHex}
            onChange={(e) => setBgHex(e.target.value.toUpperCase())}
            className="border-border/60 size-8 shrink-0 cursor-pointer appearance-none rounded-md border bg-transparent p-0.5 [&::-moz-color-swatch]:rounded-[3px] [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-[3px] [&::-webkit-color-swatch]:border-0"
            aria-label="Pick background colour"
          />
          <input
            type="text"
            value={bgHex}
            onChange={(e) => commitHex(e.target.value, setBgHex)}
            className="border-border/40 bg-background/40 text-foreground/90 w-24 rounded border px-2 py-1 font-mono text-xs uppercase"
            spellCheck={false}
            aria-label="Background hex"
          />
        </ControlRow>
      </div>

      {/* Live preview: foreground swatch (with its alpha) sitting on the
          chosen background, plus the equivalent solid composed colour the L
          formula actually sees. */}
      <div className="border-border/40 grid grid-cols-2 gap-3 rounded-md border p-3">
        <div className="space-y-1.5">
          <span className="text-muted-foreground/70 font-mono text-2xs uppercase tracking-mini">
            Rendered
          </span>
          <div
            className="border-border/40 relative flex h-16 items-center justify-center overflow-hidden rounded-md border p-2"
            style={{ backgroundColor: bgHex }}
          >
            {/* The fill is a separate layer so its alpha doesn't leak into
                the icon + label sitting on top. The icon/text colour follows
                the same L>128 contrast flip the composed swatch uses. */}
            <div
              aria-hidden="true"
              className="absolute inset-2 rounded-sm"
              style={{ backgroundColor: hex, opacity: alpha }}
            />
            <span
              className="relative inline-flex items-center gap-1.5 font-medium"
              style={{ color: L > 128 ? "#18181b" : "#fafafa" }}
            >
              <Sparkles className="size-4" aria-hidden="true" />
              <span className="text-sm">Label</span>
            </span>
          </div>
        </div>
        <div className="space-y-1.5">
          <span className="text-muted-foreground/70 font-mono text-2xs uppercase tracking-mini">
            Composed sRGB
          </span>
          <div
            className="border-border/40 flex h-16 items-center justify-center rounded-md border font-mono text-xs"
            style={{
              backgroundColor: composedHex,
              color: L > 128 ? "#18181b" : "#fafafa",
            }}
          >
            {composedHex}
          </div>
        </div>
      </div>

      {/* Formula trace */}
      <div className="border-border/40 bg-background/40 space-y-1 rounded-md border p-3 font-mono text-2xs">
        <div className="text-muted-foreground">
          R&apos;={blendedRounded.r} · G&apos;={blendedRounded.g} · B&apos;=
          {blendedRounded.b}{" "}
          <span className="text-muted-foreground/60">
            (fg blended onto bg at α={alpha.toFixed(2)})
          </span>
        </div>
        <div className="text-muted-foreground">
          L = 0.2126·{blendedRounded.r} + 0.7152·{blendedRounded.g} + 0.0722·
          {blendedRounded.b}
        </div>
        <div className="text-foreground pt-0.5 text-xs">
          L ={" "}
          <span className="font-semibold tabular-nums">{L.toFixed(2)}</span>
          {"  →  "}
          <span className="text-foreground/90 uppercase tracking-mini">
            {band}
          </span>
          <span className="text-muted-foreground/70">
            {"  · "}
            {BAND_RULE[band]}
          </span>
        </div>
      </div>

      {/* L scale with three bands + a live marker showing where the current
          colour lands. */}
      <div>
        <div className="relative">
          <div className="border-border/40 flex h-10 overflow-hidden rounded-md border">
            <div
              className="flex items-center justify-center font-mono text-2xs uppercase tracking-mini"
              style={{
                width: `${(T_DARK / L_MAX) * 100}%`,
                backgroundColor: "oklch(0.26 0 0)",
                color: "#fafafa",
              }}
            >
              darkTone
            </div>
            <div
              className="flex items-center justify-center font-mono text-2xs uppercase tracking-mini"
              style={{
                width: `${((T_LIGHT - T_DARK) / L_MAX) * 100}%`,
                backgroundColor: "oklch(0.55 0 0)",
                color: "#fafafa",
              }}
            >
              evenTone
            </div>
            <div
              className="flex items-center justify-center font-mono text-2xs uppercase tracking-mini"
              style={{
                width: `${((L_MAX - T_LIGHT) / L_MAX) * 100}%`,
                backgroundColor: "oklch(0.92 0 0)",
                color: "oklch(0.21 0.034 264)",
              }}
            >
              lightTone
            </div>
          </div>

          {/* Live position marker */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 z-10 flex flex-col items-center transition-[left] duration-150 ease-out"
            style={{ left: indicatorLeft, transform: "translateX(-50%)" }}
          >
            <div className="bg-foreground -mt-1 size-2 rotate-45 rounded-[1px]" />
            <div className="bg-foreground w-[2px] flex-1" />
            <div className="bg-foreground -mb-1 size-2 rotate-45 rounded-[1px]" />
          </div>
        </div>

        <div className="relative mt-1.5 h-4 font-mono text-2xs text-muted-foreground/70">
          <span className="absolute left-0">L=0</span>
          <span
            className="absolute -translate-x-1/2"
            style={{ left: `${(T_DARK / L_MAX) * 100}%` }}
          >
            L={T_DARK}
          </span>
          <span
            className="absolute -translate-x-1/2"
            style={{ left: `${(T_LIGHT / L_MAX) * 100}%` }}
          >
            L={T_LIGHT}
          </span>
          <span className="absolute right-0">L=255</span>
        </div>
      </div>
    </div>
  );
}

function ControlRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-muted-foreground w-20 shrink-0 font-mono text-2xs uppercase tracking-mini">
        {label}
      </label>
      {children}
    </div>
  );
}
