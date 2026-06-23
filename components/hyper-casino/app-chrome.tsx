"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/** Euro money formatter with fixed 2dp for tabular alignment. */
export const eur = (n: number) =>
  "€" +
  n.toLocaleString("en-IE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/** Decimal odds, always 2dp. */
export const odds = (n: number) => n.toFixed(2);

// Jersey / kit — a legal-safe, illustrated stand-in for club badges, identified
// purely by colour and form (no numbers/stats). Built to match an emoji-style
// reference: a soft rounded silhouette, an OKLCH-driven body gradient (light top
// → warm shadow) for real volume, a layered collar (piping + band + dark neck
// opening + centre drip), cuff stripes over a darker hem, and a diamond emblem.
export type Lch = { l: number; c: number; h: number };
const ok = (l: number, c: number, h: number) =>
  `oklch(${Math.min(1, Math.max(0, l)).toFixed(3)} ${Math.max(0, c).toFixed(3)} ${h})`;

const KIT_BODY =
  "M22 11 C 18.8 11.4 17.4 13 17 16 C 16.2 21 15.8 28 15.8 37 C 15.8 47 16.3 52 17.2 54 C 17.9 55.8 19.8 56.4 23 56.4 L 41 56.4 C 44.2 56.4 46.1 55.8 46.8 54 C 47.7 52 48.2 47 48.2 37 C 48.2 28 47.8 21 47 16 C 46.6 13 45.2 11.4 42 11 L 39.5 11 C 38.8 16.5 25.2 16.5 24.5 11 Z";
const KIT_SLEEVE_L =
  "M21.5 11.3 C 16 11.3 10.5 12.6 6 15.6 C 4 17 2.9 19.6 3.2 22.2 C 3.4 24.3 4.6 26.2 6.8 27.4 C 9.2 28.8 12.6 28.6 15.2 27.2 C 16.8 26.3 17.6 24.6 17.4 22.6 C 17 18 17.6 13.4 19.4 12 Z";
const KIT_SLEEVE_R =
  "M42.5 11.3 C 48 11.3 53.5 12.6 58 15.6 C 60 17 61.1 19.6 60.8 22.2 C 60.6 24.3 59.4 26.2 57.2 27.4 C 54.8 28.8 51.4 28.6 48.8 27.2 C 47.2 26.3 46.4 24.6 46.6 22.6 C 47 18 46.4 13.4 44.6 12 Z";
const KIT_CUFF_L =
  "M5.4 23.4 C 8 25.4 11.6 25.6 14.9 24.1 C 15.4 24.9 15.2 25.9 14.6 26.5 C 11.4 27.9 7.9 27.7 5.5 25.7 C 5 25.1 5.1 24 5.4 23.4 Z";
const KIT_CUFF_R =
  "M58.6 23.4 C 56 25.4 52.4 25.6 49.1 24.1 C 48.6 24.9 48.8 25.9 49.4 26.5 C 52.6 27.9 56.1 27.7 58.5 25.7 C 59 25.1 58.9 24 58.6 23.4 Z";
const KIT_COLLAR_PIPING =
  "M21 9 C 24 11 40 11 43 9 C 43.4 16.5 38.4 23.8 32 23.8 C 25.6 23.8 20.6 16.5 21 9 Z";
const KIT_COLLAR_BAND =
  "M23 9.5 C 25.6 11.2 38.4 11.2 41 9.5 C 41.3 15.8 36.8 21.6 32 21.6 C 27.2 21.6 22.7 15.8 23 9.5 Z";
const KIT_NECK =
  "M25.5 10 C 27.8 11.5 36.2 11.5 38.5 10 C 38.7 15 35 19.4 32 19.4 C 29 19.4 25.3 15 25.5 10 Z";
const KIT_DRIP =
  "M32 20.4 C 33.1 20.4 33.7 21.6 33.4 23.5 C 33.2 24.7 32.6 25.4 32 25.4 C 31.4 25.4 30.8 24.7 30.6 23.5 C 30.3 21.6 30.9 20.4 32 20.4 Z";
const KIT_DIAMOND = "M44 27 L47.2 30 L44 33 L40.8 30 Z";

// Basketball variant — a flat-cut tank (per reference): wide shoulder straps with
// a deep U-scoop neck, deep armholes, and a torso tapering to a flat hem. Body is
// the primary colour; the accent forms the strap edges and lower side panels.
const BBALL_BODY =
  "M13.5 4 C 12.6 4 11.9 6.5 11.5 12 C 11.1 17.5 14.2 23 18 25 C 17 34 16.2 44 15.4 50.5 C 15.3 52.6 15.6 53.8 16.8 53.8 L 47.2 53.8 C 48.4 53.8 48.7 52.6 48.6 50.5 C 47.8 44 47 34 46 25 C 49.8 23 52.9 17.5 52.5 12 C 52.1 6.5 51.4 4 50.5 4 L 40 4 C 38.8 11.5 35 17 32 17 C 29 17 25.2 11.5 24 4 Z";
const BBALL_STRAP_L = "M9 1 L 18.5 1 L 16.5 11 L 15.5 15 L 8 15 Z";
const BBALL_STRAP_R = "M55 1 L 45.5 1 L 47.5 11 L 48.5 15 L 56 15 Z";
const BBALL_PANEL_L = "M17 39 L 32 54.5 L 13 55 L 11 38 Z";
const BBALL_PANEL_R = "M47 39 L 32 54.5 L 51 55 L 53 38 Z";
const BBALL_NECK_SHADOW =
  "M24 4 C 25.2 11.5 29 17 32 17 C 35 17 38.8 11.5 40 4 L 37.8 4 C 36.8 10.2 34 14.4 32 14.4 C 30 14.4 27.2 10.2 26.2 4 Z";

export function TeamKit({
  primary,
  sleeve,
  accent,
  trim,
  variant = "football",
  className,
}: {
  /** Body colour as OKLCH parts — drives the volume gradient. */
  primary: Lch;
  /** Sleeve colour (OKLCH parts); defaults to the body colour. */
  sleeve?: Lch;
  /** Collar-band + emblem colour (drives the dark neck opening too). */
  accent: Lch;
  /** Collar piping + cuff stripe colour. */
  trim: string;
  /** Garment shape. */
  variant?: "football" | "basketball";
  className?: string;
}) {
  const uid = React.useId().replace(/:/g, "");
  const bgId = `bd-${uid}`;
  const slId = `sl-${uid}`;
  const acId = `ac-${uid}`;
  const hlId = `hl-${uid}`;
  const clipId = `cp-${uid}`;
  const p = primary;
  const s = sleeve ?? primary;
  const a = accent;
  const hemDark = ok(s.l - 0.13, s.c + 0.05, s.h - 12);
  return (
    <svg
      viewBox="0 0 64 60"
      className={cn("shrink-0", className)}
      role="img"
      aria-hidden
    >
      <defs>
        <linearGradient id={bgId} x1="0.12" y1="0.02" x2="0.82" y2="1">
          <stop offset="0%" stopColor={ok(p.l + 0.15, p.c - 0.03, p.h)} />
          <stop offset="38%" stopColor={ok(p.l + 0.04, p.c, p.h)} />
          <stop offset="72%" stopColor={ok(p.l - 0.04, p.c + 0.025, p.h - 5)} />
          <stop offset="100%" stopColor={ok(p.l - 0.14, p.c + 0.06, p.h - 14)} />
        </linearGradient>
        <linearGradient id={slId} x1="0.1" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor={ok(s.l + 0.08, s.c - 0.02, s.h)} />
          <stop offset="60%" stopColor={ok(s.l - 0.03, s.c + 0.015, s.h - 4)} />
          <stop offset="100%" stopColor={ok(s.l - 0.11, s.c + 0.045, s.h - 11)} />
        </linearGradient>
        <linearGradient id={acId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ok(a.l + 0.06, a.c, a.h)} />
          <stop offset="100%" stopColor={ok(a.l - 0.05, a.c, a.h)} />
        </linearGradient>
        <radialGradient id={hlId} cx="36%" cy="18%" r="52%">
          <stop offset="0%" stopColor="oklch(1 0 0)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="oklch(1 0 0)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {variant === "basketball" ? (
        <>
          {/* flat tank body */}
          <path d={BBALL_BODY} fill={`url(#${bgId})`} />

          {/* colour-blocks clipped to the body: neck shadow, side panels, straps */}
          <clipPath id={clipId}>
            <path d={BBALL_BODY} />
          </clipPath>
          <g clipPath={`url(#${clipId})`}>
            <path d={BBALL_NECK_SHADOW} fill={ok(p.l - 0.12, p.c + 0.04, p.h - 6)} />
            <path d={BBALL_PANEL_L} fill={`url(#${acId})`} />
            <path d={BBALL_PANEL_R} fill={`url(#${acId})`} />
            <path d={BBALL_STRAP_L} fill={`url(#${acId})`} />
            <path d={BBALL_STRAP_R} fill={`url(#${acId})`} />
          </g>

          {/* woven tag */}
          <rect
            x="37"
            y="26"
            width="5.2"
            height="2.3"
            rx="1.15"
            fill={ok(a.l + 0.14, a.c - 0.02, a.h)}
          />
        </>
      ) : (
        <>
          {/* sleeves, body, chest highlight */}
          <path d={KIT_SLEEVE_L} fill={`url(#${slId})`} />
          <path d={KIT_SLEEVE_R} fill={`url(#${slId})`} />
          <path d={KIT_BODY} fill={`url(#${bgId})`} />
          <path d={KIT_BODY} fill={`url(#${hlId})`} />

          {/* cuffs: darker hem under a trim stripe */}
          <path d={KIT_CUFF_L} fill={hemDark} transform="translate(0 1.6)" />
          <path d={KIT_CUFF_R} fill={hemDark} transform="translate(0 1.6)" />
          <path d={KIT_CUFF_L} fill={trim} />
          <path d={KIT_CUFF_R} fill={trim} />

          {/* diamond emblem (accent so it always contrasts the body) */}
          <path d={KIT_DIAMOND} fill={ok(a.l, a.c, a.h)} />
          <path
            d={KIT_DIAMOND}
            fill="oklch(1 0 0)"
            fillOpacity="0.18"
            transform="translate(-0.5 -0.6)"
          />

          {/* collar: piping → band → dark opening → drip */}
          <path d={KIT_COLLAR_PIPING} fill={trim} />
          <path d={KIT_COLLAR_BAND} fill={`url(#${acId})`} />
          <path d={KIT_NECK} fill={ok(Math.min(a.l - 0.26, 0.4), a.c, a.h)} />
          <path d={KIT_DRIP} fill={trim} />
        </>
      )}
    </svg>
  );
}

/** Top brand bar (logged-out): Mercury wordmark + Register / Login. Sits on the
 *  near-black chrome band so it reads as a distinct header. */
export function AppBar() {
  return (
    <div className="flex items-center justify-between px-3.5 pb-2 pt-0.5">
      {/* Mercury brand lockup (symbol + wordmark) — rendered in colour as a
          background image; the wordmark is recoloured white to read on the bar. */}
      <span
        role="img"
        aria-label="Mercury"
        className="block shrink-0"
        style={{
          height: 16,
          width: 88,
          backgroundImage: "url(/hyper-casino/mercury-logo.svg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "left center",
        }}
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-lg bg-[var(--hc-lime)] px-2.5 py-1.5 text-[0.75rem] font-bold text-[var(--hc-lime-fg)] transition-transform active:scale-95"
        >
          Register
        </button>
        <button
          type="button"
          className="rounded-lg border border-white/15 px-2.5 py-1.5 text-[0.75rem] font-semibold text-[var(--hc-fg)] transition-colors hover:bg-white/5"
        >
          Login
        </button>
      </div>
    </div>
  );
}
