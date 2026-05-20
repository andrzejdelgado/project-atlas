"use client";

import * as React from "react";

type Milestone = {
  segment: 1 | 2;
  t: number;
  label: string;
  projected?: boolean;
  badge: { dx: number; dy: number };
};

const MILESTONES: Milestone[] = [
  {
    segment: 1,
    t: 0.05,
    label: "Foundations",
    badge: { dx: 14, dy: -40 },
  },
  {
    segment: 1,
    t: 0.30,
    label: "First Components",
    badge: { dx: -55, dy: -65 },
  },
  {
    segment: 1,
    t: 0.58,
    label: "More complex Components",
    badge: { dx: -87, dy: -75 },
  },
  {
    segment: 1,
    t: 0.88,
    label: "Composite patterns",
    badge: { dx: -80, dy: -28 },
  },
  {
    segment: 2,
    t: 0.10,
    label: "Multi-brand scale",
    projected: true,
    badge: { dx: 70, dy: 60 },
  },
  {
    segment: 2,
    t: 0.55,
    label: "Cross-platform",
    projected: true,
    badge: { dx: 15, dy: 100 },
  },
];

const VIEW = { w: 720, h: 460 };
const CHART = { x: 1, y: 1, w: 718, h: 458 };
const BASELINE = CHART.y + CHART.h;
const Y_AXIS_LABEL_X = CHART.x + 24;
const Y_AXIS_LABEL_Y = CHART.y + 70;

const DOT_RADIUS = 5;
const ACCENT = "var(--accent-emerald)";

type P = { x: number; y: number };

const A0: P = { x: CHART.x, y: BASELINE - 16 };
const A1: P = { x: CHART.x + 0.55 * CHART.w, y: CHART.y + 50 };
const A2: P = { x: CHART.x + CHART.w, y: CHART.y + 130 };

const SEG1_CP1: P = { x: CHART.x + 0.45 * CHART.w, y: A0.y };
const SEG1_CP2: P = { x: CHART.x + 0.30 * CHART.w, y: A1.y };

const SEG2_CP1: P = { x: CHART.x + 0.75 * CHART.w, y: A1.y };
const SEG2_CP2: P = { x: CHART.x + 0.92 * CHART.w, y: A2.y };

function curvePath() {
  return [
    `M ${A0.x} ${A0.y}`,
    `C ${SEG1_CP1.x} ${SEG1_CP1.y}, ${SEG1_CP2.x} ${SEG1_CP2.y}, ${A1.x} ${A1.y}`,
    `C ${SEG2_CP1.x} ${SEG2_CP1.y}, ${SEG2_CP2.x} ${SEG2_CP2.y}, ${A2.x} ${A2.y}`,
  ].join(" ");
}

function curveAreaPath() {
  return `${curvePath()} L ${A2.x} ${BASELINE} L ${A0.x} ${BASELINE} Z`;
}

function bezier(t: number, p0: P, p1: P, p2: P, p3: P): P {
  const omt = 1 - t;
  return {
    x:
      omt * omt * omt * p0.x +
      3 * omt * omt * t * p1.x +
      3 * omt * t * t * p2.x +
      t * t * t * p3.x,
    y:
      omt * omt * omt * p0.y +
      3 * omt * omt * t * p1.y +
      3 * omt * t * t * p2.y +
      t * t * t * p3.y,
  };
}

function pointOnSegment(segment: 1 | 2, t: number): P {
  if (segment === 1) return bezier(t, A0, SEG1_CP1, SEG1_CP2, A1);
  return bezier(t, A1, SEG2_CP1, SEG2_CP2, A2);
}

const BADGE_FONT_SIZE = 11;
const BADGE_HEIGHT = 30;
const BADGE_LEFT_PAD = 10;
const BADGE_DOT_RADIUS = 4;
const BADGE_DOT_TEXT_GAP = 7;
const BADGE_RIGHT_PAD = 10;
const BADGE_CHAR_WIDTH = 7.4;
const BADGE_RX = 6;

function badgeWidth(label: string): number {
  const text = label.toUpperCase();
  return Math.round(
    BADGE_LEFT_PAD +
      2 * BADGE_DOT_RADIUS +
      BADGE_DOT_TEXT_GAP +
      text.length * BADGE_CHAR_WIDTH +
      BADGE_RIGHT_PAD,
  );
}

export function FoundationsCurveDemo() {
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
    transition: `opacity 0.55s ease-out ${delay}s`,
  });

  return (
    <figure
      ref={figureRef}
      className="border-border bg-card/40 relative mt-8 overflow-hidden rounded-2xl border"
    >
      <svg
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        className="block h-auto w-full"
        aria-label="Component delivery curve from foundations to multi-brand scale"
      >
        <defs>
          <pattern
            id="fc-space-dots"
            width={26}
            height={26}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={13}
              cy={13}
              r={0.9}
              fill="var(--muted-foreground)"
              opacity={0.4}
            />
          </pattern>
          <linearGradient id="fc-fade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="50%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="fc-fade-mask">
            <rect
              x={0}
              y={0}
              width={VIEW.w}
              height={VIEW.h}
              fill="url(#fc-fade)"
            />
          </mask>
        </defs>

        <rect
          x={0}
          y={0}
          width={VIEW.w}
          height={VIEW.h}
          fill="url(#fc-space-dots)"
          style={fade(0)}
        />

        <line
          x1={CHART.x}
          y1={CHART.y}
          x2={CHART.x}
          y2={BASELINE}
          stroke="var(--border)"
          strokeWidth={1}
          strokeOpacity={0.8}
          style={fade(0.05)}
        />
        <line
          x1={CHART.x}
          y1={BASELINE}
          x2={CHART.x + CHART.w}
          y2={BASELINE}
          stroke="var(--border)"
          strokeWidth={1}
          strokeOpacity={0.8}
          style={fade(0.05)}
        />

        <text
          x={Y_AXIS_LABEL_X}
          y={Y_AXIS_LABEL_Y}
          fontSize={14}
          fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
          fill="var(--muted-foreground)"
          letterSpacing="0.08em"
          textAnchor="middle"
          transform={`rotate(-90 ${Y_AXIS_LABEL_X} ${Y_AXIS_LABEL_Y})`}
          style={fade(0.1)}
        >
          EFFORT
        </text>
        <text
          x={CHART.x + CHART.w - 22}
          y={BASELINE - 22}
          fontSize={14}
          fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
          fill="var(--muted-foreground)"
          letterSpacing="0.08em"
          textAnchor="end"
          style={fade(0.1)}
        >
          UI ELEMENTS
        </text>

        <path
          d={curveAreaPath()}
          fill="black"
          fillOpacity={0.28}
          mask="url(#fc-fade-mask)"
          style={fade(0.4)}
        />

        <path
          d={curvePath()}
          fill="none"
          stroke={ACCENT}
          strokeWidth={2.5}
          mask="url(#fc-fade-mask)"
          style={fade(0.5)}
        />

        {MILESTONES.map((m, i) => {
          const { x, y } = pointOnSegment(m.segment, m.t);
          const bw = badgeWidth(m.label);
          const bx = x + m.badge.dx;
          const by = y + m.badge.dy;
          const dotDelay = 0.85 + i * 0.08;
          const badgeDelay = 1.0 + i * 0.08;

          const dxv = bx - x;
          const dyv = by - y;
          const len = Math.hypot(dxv, dyv) || 1;
          const nx = dxv / len;
          const ny = dyv / len;
          const halfW = bw / 2;
          const halfH = BADGE_HEIGHT / 2;
          const tx = Math.abs(nx) > 1e-6 ? halfW / Math.abs(nx) : Infinity;
          const ty = Math.abs(ny) > 1e-6 ? halfH / Math.abs(ny) : Infinity;
          const tRect = Math.min(tx, ty);
          const lineEndX = bx - nx * tRect;
          const lineEndY = by - ny * tRect;
          const lineStartX = x + nx * (DOT_RADIUS + 1.5);
          const lineStartY = y + ny * (DOT_RADIUS + 1.5);

          const badgeLeft = bx - halfW;
          const textX =
            badgeLeft +
            BADGE_LEFT_PAD +
            2 * BADGE_DOT_RADIUS +
            BADGE_DOT_TEXT_GAP;

          return (
            <g key={i}>
              <line
                x1={lineStartX}
                y1={lineStartY}
                x2={lineEndX}
                y2={lineEndY}
                stroke="var(--border)"
                strokeWidth={1}
                strokeOpacity={0.7}
                style={fade(badgeDelay - 0.05)}
              />
              <circle
                cx={x}
                cy={y}
                r={DOT_RADIUS}
                fill="var(--background)"
                stroke={ACCENT}
                strokeWidth={2}
                strokeDasharray={m.projected ? "3 3" : undefined}
                style={fade(dotDelay)}
              >
                <title>{m.label}</title>
              </circle>
              <g style={fade(badgeDelay)}>
                <rect
                  x={badgeLeft}
                  y={by - halfH}
                  width={bw}
                  height={BADGE_HEIGHT}
                  rx={BADGE_RX}
                  fill="var(--background)"
                  stroke="var(--border)"
                  strokeWidth={1}
                />
                <circle
                  cx={badgeLeft + BADGE_LEFT_PAD + BADGE_DOT_RADIUS}
                  cy={by}
                  r={BADGE_DOT_RADIUS}
                  fill={ACCENT}
                />
                <text
                  x={textX}
                  y={by + 4}
                  fontSize={BADGE_FONT_SIZE}
                  fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
                  fill="var(--foreground)"
                  letterSpacing="0.06em"
                >
                  {m.label.toUpperCase()}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
