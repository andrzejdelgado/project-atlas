"use client";

import * as React from "react";

type Pkg = {
  id: string;
  name: string;
  tech: string[];
  x: number;
  y: number;
  w: number;
  h: number;
  techCols: 1 | 2;
};

const VIEW = { w: 660, h: 660 };

const PACKAGES: Pkg[] = [
  {
    id: "halo",
    name: "Halo",
    tech: ["Storybook", "TypeScript"],
    x: 0,
    y: 10,
    w: 310,
    h: 122,
    techCols: 1,
  },
  {
    id: "visual",
    name: "Visual Testing",
    tech: ["Puppeteer", "reg-cli"],
    x: 350,
    y: 10,
    w: 310,
    h: 122,
    techCols: 1,
  },
  {
    id: "multitheming",
    name: "Multitheming System",
    tech: ["React", "Panda CSS", "TypeScript"],
    x: 0,
    y: 190,
    w: 310,
    h: 150,
    techCols: 1,
  },
  {
    id: "gateway",
    name: "Content Gateway",
    tech: ["NodeJS", "NestJS", "TypeScript"],
    x: 350,
    y: 190,
    w: 310,
    h: 150,
    techCols: 1,
  },
  {
    id: "jupyter",
    name: "Jupyter",
    tech: ["NextJS", "React", "NodeJS", "Panda CSS", "Jest"],
    x: 120,
    y: 470,
    w: 420,
    h: 150,
    techCols: 2,
  },
];

const TURBO_PAD_X = 14;
const TURBO_ICON = 22;
const TURBO_GAP = 10;
const TURBO_TEXT_W = 96;
const TURBO = {
  cx: VIEW.w / 2,
  cy: 405,
  w: TURBO_PAD_X * 2 + TURBO_ICON + TURBO_GAP + TURBO_TEXT_W,
  h: 44,
};

type ArrowSide = "left" | "right" | "top" | "bottom";

type ArrowSpec = {
  from: string;
  to: string;
  fromSide: ArrowSide;
  toSide: ArrowSide;
  fromOffset?: number;
  toOffset?: number;
  color: string;
  curveMag?: number;
};

const ARROWS: ArrowSpec[] = [
  {
    from: "visual",
    to: "halo",
    fromSide: "left",
    toSide: "right",
    color: "var(--accent-emerald)",
  },
  {
    from: "halo",
    to: "multitheming",
    fromSide: "bottom",
    toSide: "top",
    color: "var(--accent-blue)",
  },
  {
    from: "jupyter",
    to: "multitheming",
    fromSide: "top",
    toSide: "bottom",
    fromOffset: 0.2,
    color: "var(--accent-violet)",
    curveMag: 80,
  },
  {
    from: "jupyter",
    to: "gateway",
    fromSide: "top",
    toSide: "bottom",
    fromOffset: 0.8,
    color: "var(--accent-amber)",
    curveMag: 80,
  },
];

function sidePoint(p: Pkg, side: ArrowSide, offset = 0.5) {
  switch (side) {
    case "left":
      return { x: p.x, y: p.y + p.h * offset };
    case "right":
      return { x: p.x + p.w, y: p.y + p.h * offset };
    case "top":
      return { x: p.x + p.w * offset, y: p.y };
    case "bottom":
      return { x: p.x + p.w * offset, y: p.y + p.h };
  }
}

function tangentOut(side: ArrowSide): [number, number] {
  switch (side) {
    case "left":
      return [-1, 0];
    case "right":
      return [1, 0];
    case "top":
      return [0, -1];
    case "bottom":
      return [0, 1];
  }
}

type TechIcon = { letter: string; bg: string; fg?: string };

// Per-tech colour, drawn from the project accent palette (with a couple of
// hue-shifted siblings for colours not directly in the palette — "mint",
// "yellow"). When the same colour is used twice inside one card, the second
// instance gets a hue rotation at render time so they don't read as identical.
const TECH_ICONS: Record<string, TechIcon> = {
  Storybook: { letter: "S", bg: "var(--destructive)" },
  TypeScript: { letter: "TS", bg: "var(--accent-violet)" },
  Puppeteer: { letter: "P", bg: "var(--accent-amber)" },
  "reg-cli": { letter: ">_", bg: "var(--accent-emerald)" },
  NodeJS: { letter: "N", bg: "var(--accent-blue)" },
  NestJS: {
    letter: "N",
    bg: "oklch(from var(--accent-emerald) l c calc(h + 25))",
  },
  React: { letter: "R", bg: "var(--accent-blue)" },
  "Panda CSS": {
    letter: "P",
    bg: "oklch(from var(--accent-amber) l c calc(h + 18))",
  },
  NextJS: { letter: "N", bg: "var(--accent-emerald)" },
  Jest: { letter: "J", bg: "var(--destructive)" },
};

const HUE_SHIFTS = [0, 22, -22, 44];

function shiftHue(base: string, idx: number): string {
  if (idx === 0) return base;
  const shift = HUE_SHIFTS[idx % HUE_SHIFTS.length];
  return `oklch(from ${base} l c calc(h + ${shift}))`;
}

function colorSlug(color: string): string {
  return color.replace(/[^a-z]/gi, "").toLowerCase();
}

export function ArchitectureDemo() {
  const figureRef = React.useRef<HTMLElement>(null);
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    const node = figureRef.current;
    if (!node) return;
    function check() {
      if (!node) return false;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < vh * 0.92 && rect.bottom > 0) {
        setRevealed(true);
        return true;
      }
      return false;
    }
    if (check()) return;
    function onScroll() {
      if (check()) window.removeEventListener("scroll", onScroll);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fade = (delay: number): React.CSSProperties => ({
    opacity: revealed ? 1 : 0,
    transform: revealed ? "translateY(0)" : "translateY(8px)",
    transition: `opacity 0.55s ease-out ${delay}s, transform 0.55s ease-out ${delay}s`,
  });

  // Unique colors used by arrows — render one arrowhead marker per colour.
  const uniqueColors = Array.from(new Set(ARROWS.map((a) => a.color)));

  return (
    <figure
      ref={figureRef}
      className="border-border bg-card/40 relative mt-8 overflow-hidden rounded-2xl border"
    >
      <div className="p-5 sm:p-7">
        <div className="mb-2" style={fade(0)}>
          <span className="text-muted-foreground font-mono text-2xs uppercase tracking-mini">
            Saturn Heavy · High-level architecture
          </span>
        </div>
        <svg
          viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
          className="block h-auto w-full"
          aria-label="Saturn Heavy is a Turborepo monorepo with five packages: Halo, Visual Testing, Multitheming System, Content Gateway, and Jupyter"
        >
          <defs>
            {uniqueColors.map((color) => (
              <marker
                key={colorSlug(color)}
                id={`arch-arrow-${colorSlug(color)}`}
                markerUnits="userSpaceOnUse"
                markerWidth={11}
                markerHeight={11}
                refX={9}
                refY={5.5}
                orient="auto"
              >
                <path d="M0,1 L0,10 L9,5.5 z" fill={color} />
              </marker>
            ))}
          </defs>

          {ARROWS.map((a, i) => {
            const from = PACKAGES.find((p) => p.id === a.from)!;
            const to = PACKAGES.find((p) => p.id === a.to)!;
            const p0 = sidePoint(from, a.fromSide, a.fromOffset ?? 0.5);
            const p3 = sidePoint(to, a.toSide, a.toOffset ?? 0.5);
            const [dx0, dy0] = tangentOut(a.fromSide);
            const [dx1, dy1] = tangentOut(a.toSide);
            const mag = a.curveMag ?? 50;
            const cp1 = { x: p0.x + dx0 * mag, y: p0.y + dy0 * mag };
            const cp2 = { x: p3.x + dx1 * mag, y: p3.y + dy1 * mag };
            const d = `M ${p0.x} ${p0.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${p3.x} ${p3.y}`;
            return (
              <path
                key={`arrow-${i}`}
                d={d}
                fill="none"
                stroke={a.color}
                strokeWidth={1.75}
                strokeOpacity={0.9}
                markerEnd={`url(#arch-arrow-${colorSlug(a.color)})`}
                style={fade(0.45 + i * 0.06)}
              />
            );
          })}

          <g style={fade(0.2)}>
            <rect
              x={TURBO.cx - TURBO.w / 2}
              y={TURBO.cy - TURBO.h / 2}
              width={TURBO.w}
              height={TURBO.h}
              rx={TURBO.h / 2}
              fill="var(--background)"
              stroke="var(--border)"
              strokeWidth={1}
            />
            <rect
              x={TURBO.cx - TURBO.w / 2 + TURBO_PAD_X}
              y={TURBO.cy - TURBO_ICON / 2}
              width={TURBO_ICON}
              height={TURBO_ICON}
              rx={6}
              fill="var(--foreground)"
            />
            <text
              x={TURBO.cx - TURBO.w / 2 + TURBO_PAD_X + TURBO_ICON / 2}
              y={TURBO.cy + 4}
              fontSize={12}
              fontWeight="700"
              fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
              fill="var(--background)"
              textAnchor="middle"
            >
              T
            </text>
            <text
              x={
                TURBO.cx - TURBO.w / 2 + TURBO_PAD_X + TURBO_ICON + TURBO_GAP
              }
              y={TURBO.cy + 5}
              fontSize={14}
              fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
              fill="var(--foreground)"
              textAnchor="start"
              letterSpacing="0.08em"
            >
              TURBOREPO
            </text>
          </g>

          {PACKAGES.map((p, i) => {
            const cols = p.techCols;
            const padX = 18;
            const innerW = p.w - 2 * padX;
            const colW = innerW / cols;
            const seenColors: Record<string, number> = {};
            const techColors = p.tech.map((t) => {
              const icon = TECH_ICONS[t];
              if (!icon) return "";
              const idx = seenColors[icon.bg] ?? 0;
              seenColors[icon.bg] = idx + 1;
              return shiftHue(icon.bg, idx);
            });
            return (
              <g key={p.id} style={fade(0.25 + i * 0.06)}>
                <rect
                  x={p.x}
                  y={p.y}
                  width={p.w}
                  height={p.h}
                  rx={12}
                  fill="var(--background)"
                  stroke="var(--border)"
                  strokeWidth={1}
                />
                <text
                  x={p.x + padX}
                  y={p.y + 26}
                  fontSize={13}
                  fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
                  fill="var(--foreground)"
                  letterSpacing="0.08em"
                >
                  {p.name.toUpperCase()}
                </text>
                <line
                  x1={p.x}
                  y1={p.y + 42}
                  x2={p.x + p.w}
                  y2={p.y + 42}
                  stroke="var(--border)"
                  strokeWidth={1}
                />
                {p.tech.map((t, ti) => {
                  const icon = TECH_ICONS[t];
                  const col = ti % cols;
                  const row = Math.floor(ti / cols);
                  const rowY = p.y + 58 + row * 28;
                  const colX = p.x + padX + col * colW;
                  if (!icon) {
                    return (
                      <text
                        key={`t-${ti}`}
                        x={colX}
                        y={rowY + 13}
                        fontSize={11}
                        fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
                        fill="var(--muted-foreground)"
                      >
                        {t}
                      </text>
                    );
                  }
                  const bg = techColors[ti];
                  return (
                    <g key={`t-${ti}`}>
                      <rect
                        x={colX}
                        y={rowY}
                        width={20}
                        height={20}
                        rx={5}
                        fill={bg}
                      />
                      <text
                        x={colX + 10}
                        y={rowY + 14}
                        fontSize={icon.letter.length > 1 ? 8 : 11}
                        fontWeight="700"
                        fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
                        fill={icon.fg ?? "var(--background)"}
                        textAnchor="middle"
                      >
                        {icon.letter}
                      </text>
                      <text
                        x={colX + 28}
                        y={rowY + 14}
                        fontSize={12}
                        fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
                        fill="var(--foreground)"
                        letterSpacing="0.02em"
                      >
                        {t}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}
