"use client";

import * as React from "react";

type Stage = { label: string; color: string; cx: number; cy: number };

const STAGES: Stage[] = [
  {
    label: "Monitoring the Fundamentals",
    color: "var(--accent-emerald)",
    cx: 18,
    cy: 24,
  },
  {
    label: "Continuous Integration",
    color: "var(--accent-blue)",
    cx: 75,
    cy: 24,
  },
  {
    label: "Continuous Stewardship",
    color: "var(--accent-violet)",
    cx: 125,
    cy: 69,
  },
  {
    label: "Continuous Feedback",
    color: "var(--accent-amber)",
    cx: 182,
    cy: 69,
  },
  {
    label: "Integration Testing",
    color: "var(--destructive)",
    cx: 182,
    cy: 24,
  },
  {
    label: "Continuous Delivery",
    color: "oklch(0.85 0.15 175)",
    cx: 125,
    cy: 24,
  },
  {
    label: "User Acceptance Testing",
    color: "oklch(0.8 0.18 55)",
    cx: 75,
    cy: 69,
  },
  {
    label: "Quality Assurance",
    color: "oklch(0.78 0.2 350)",
    cx: 18,
    cy: 69,
  },
];

const ACCENT = "var(--background)";

export function PdmDemo() {
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

  return (
    <figure
      ref={figureRef}
      className="border-border bg-card/40 relative mt-8 overflow-hidden rounded-2xl border"
    >
      <div className="p-5 sm:p-7">
        <div className="mb-2" style={fade(0)}>
          <span className="text-muted-foreground font-mono text-2xs uppercase tracking-mini">
            Progressive Design Model · CI/CD for design
          </span>
        </div>

        <div className="py-2 sm:py-4" style={fade(0.1)}>
          <svg
            viewBox="0 0 200 92"
            className="block h-auto w-full"
            aria-label="Infinity loop representing a continuous design and development cycle"
          >
            <path
              d="M 7 46 C 7 6, 75 6, 100 46 C 125 86, 193 86, 193 46"
              fill="none"
              stroke="var(--border)"
              strokeWidth={10.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 7 46 C 7 6, 75 6, 100 46 C 125 86, 193 86, 193 46"
              fill="none"
              stroke={ACCENT}
              strokeWidth={10}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 193 46 C 193 6, 125 6, 100 46 C 75 86, 7 86, 7 46"
              fill="none"
              stroke="var(--border)"
              strokeWidth={10.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 193 46 C 193 6, 125 6, 100 46 C 75 86, 7 86, 7 46"
              fill="none"
              stroke={ACCENT}
              strokeWidth={10}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {[
              { x: 46.5, y: 16, angle: 0 },
              { x: 109, y: 57, angle: 45 },
              { x: 153.5, y: 76, angle: 0 },
              { x: 193, y: 46, angle: -90 },
              { x: 153.5, y: 16, angle: 180 },
              { x: 91, y: 57, angle: 135 },
              { x: 46.5, y: 76, angle: 180 },
              { x: 7, y: 46, angle: -90 },
            ].map((a, i) => (
              <g
                key={i}
                transform={`translate(${a.x} ${a.y}) rotate(${a.angle})`}
              >
                <path
                  d="M -1.5 0 L 1.5 0 M 0 -1.5 L 1.5 0 L 0 1.5"
                  fill="none"
                  stroke="white"
                  strokeWidth={0.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            ))}

            {STAGES.map((stage, i) => {
              const w = 18;
              const h = 8;
              const left = stage.cx - w / 2;
              return (
                <g key={i}>
                  <rect
                    x={left}
                    y={stage.cy - h / 2}
                    width={w}
                    height={h}
                    rx={2}
                    fill="var(--card)"
                    stroke="var(--border)"
                    strokeWidth={0.5}
                  />
                  <circle
                    cx={left + 4.8}
                    cy={stage.cy}
                    r={1.4}
                    fill={stage.color}
                  />
                  <text
                    x={left + 8.2}
                    y={stage.cy + 2}
                    textAnchor="start"
                    fontSize={5}
                    fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
                    fill="var(--foreground)"
                    letterSpacing="0.04em"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-x-6">
          {STAGES.map((stage, i) => (
            <li
              key={stage.label}
              className="flex items-baseline gap-3"
              style={fade(0.2 + i * 0.04)}
            >
              <span
                aria-hidden="true"
                className="border-border bg-card text-foreground inline-flex shrink-0 items-center gap-1.5 rounded-sm border px-1.5 py-0.5 font-mono text-2xs tabular-nums"
              >
                <span
                  className="inline-block size-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: stage.color }}
                />
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-foreground font-mono text-xs uppercase tracking-mini">
                {stage.label}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}
