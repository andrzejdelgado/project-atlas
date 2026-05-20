"use client";

import * as React from "react";

type PersonRole = "designer" | "engineer" | "architect" | "pm";

const ROLE_LABEL: Record<PersonRole, string> = {
  designer: "Designer",
  engineer: "Engineer",
  architect: "Architect",
  pm: "PM",
};

const ROLE_LABEL_PLURAL: Record<PersonRole, string> = {
  designer: "Designers",
  engineer: "Engineers",
  architect: "Architects",
  pm: "PMs",
};

const ROLE_COLOR: Record<PersonRole, string> = {
  designer: "var(--accent-emerald)",
  engineer: "var(--accent-blue)",
  architect: "var(--accent-violet)",
  pm: "var(--accent-amber)",
};

type Member =
  | { kind: "person"; role: PersonRole }
  | { kind: "team"; name: string; hue?: number; color?: string };

const INTERNAL_TEAM_COLOR = "oklch(0.82 0.11 230)";
const EXTERNAL_TEAM_COLOR = "var(--foreground)";

type Step = { label: string; short: string; members: Member[] };

const STEPS: Step[] = [
  {
    label: "Co-leads",
    short: "Co-leads",
    members: [
      { kind: "person", role: "engineer" },
      { kind: "person", role: "designer" },
    ],
  },
  {
    label: "Task force",
    short: "Task force",
    members: [
      { kind: "person", role: "engineer" },
      { kind: "person", role: "engineer" },
      { kind: "person", role: "engineer" },
      { kind: "person", role: "architect" },
      { kind: "person", role: "architect" },
    ],
  },
  {
    label: "Wargs absorbed",
    short: "Wargs",
    members: [
      { kind: "person", role: "engineer" },
      { kind: "person", role: "engineer" },
      { kind: "person", role: "engineer" },
      { kind: "person", role: "engineer" },
      { kind: "person", role: "engineer" },
      { kind: "person", role: "engineer" },
      { kind: "person", role: "engineer" },
      { kind: "person", role: "engineer" },
      { kind: "person", role: "engineer" },
      { kind: "person", role: "engineer" },
      { kind: "person", role: "designer" },
      { kind: "person", role: "designer" },
      { kind: "person", role: "pm" },
      { kind: "person", role: "pm" },
      { kind: "person", role: "pm" },
    ],
  },
  {
    label: "Teams form",
    short: "Teams",
    members: [
      { kind: "team", name: "Wargs", color: "var(--accent-blue)" },
      { kind: "team", name: "Foxes", color: "var(--accent-blue)" },
      { kind: "team", name: "Titan", color: "var(--accent-emerald)" },
      { kind: "team", name: "Product", color: "var(--accent-amber)" },
    ],
  },
  {
    label: "External scale",
    short: "External",
    members: [
      { kind: "team", name: "Int 01", color: INTERNAL_TEAM_COLOR },
      { kind: "team", name: "Int 02", color: INTERNAL_TEAM_COLOR },
      { kind: "team", name: "Ext 01" },
      { kind: "team", name: "Ext 02" },
      { kind: "team", name: "Ext 03" },
      { kind: "team", name: "Ext 04" },
      { kind: "team", name: "Ext 05" },
      { kind: "team", name: "Ext 06" },
      { kind: "team", name: "Ext +" },
    ],
  },
];

type ArcSpec = { yBase: number; bulge: number };

const ARCS: ArcSpec[] = [
  { yBase: 90, bulge: 110 },
  { yBase: 165, bulge: 103 },
  { yBase: 241, bulge: 95 },
  { yBase: 316, bulge: 88 },
  { yBase: 480, bulge: 80 },
];

const VIEW = { w: 700, h: 780 };
const SOURCE = { x: 350, y: 52 };
const ARC_MARGIN = 0;
const ARC_WIDTH = VIEW.w - 2 * ARC_MARGIN;

const DOT_DIAMETER = 12;
const DOT_GAP = 18;
const BOX_HEIGHT = 44;
const BOX_GAP = 22;
const ROW_GAP = 16;
const WRAP_THRESHOLD = 4;
const WRAP_COLS = 5;
const DOT_ARC_GAP = 28;
const BOX_ARC_GAP = 56;

const LABEL_FONT_SIZE = 14;
// Box layout — left padding before accent dot, then dot region, then text.
const BOX_LEFT_PAD = 14;
const BOX_DOT_RADIUS = 5;
const BOX_DOT_TEXT_GAP = 9;
const BOX_RIGHT_PAD = 14;
const BOX_CHAR_WIDTH = 9.4;

function boxWidthFor(name: string): number {
  const textW = name.length * BOX_CHAR_WIDTH;
  return Math.round(
    BOX_LEFT_PAD + 2 * BOX_DOT_RADIUS + BOX_DOT_TEXT_GAP + textW + BOX_RIGHT_PAD,
  );
}

function arcPathD(arc: ArcSpec): string {
  const startX = SOURCE.x - ARC_WIDTH / 2;
  const endX = SOURCE.x + ARC_WIDTH / 2;
  const cpY = arc.yBase + 2 * arc.bulge;
  return `M ${startX} ${arc.yBase} Q ${SOURCE.x} ${cpY} ${endX} ${arc.yBase}`;
}

function arcYAtX(arc: ArcSpec, x: number): number {
  const startX = SOURCE.x - ARC_WIDTH / 2;
  const t = (x - startX) / ARC_WIDTH;
  return arc.yBase + 4 * t * (1 - t) * arc.bulge;
}

type BoxLayout = { cx: number; cy: number; width: number };

function computeBoxLayouts(
  members: Member[],
  cols: number,
  arc: ArcSpec,
): (BoxLayout | null)[] {
  const out: (BoxLayout | null)[] = [];
  const N = members.length;
  const numRows = Math.ceil(N / cols);
  for (let r = 0; r < numRows; r++) {
    const start = r * cols;
    const end = Math.min(start + cols, N);
    const rowMembers = members.slice(start, end);
    const widths = rowMembers.map((m) =>
      m.kind === "team" ? boxWidthFor(m.name) : 0,
    );
    const totalW =
      widths.reduce((s, w) => s + w, 0) + (widths.length - 1) * BOX_GAP;
    let xCursor = SOURCE.x - totalW / 2;
    for (let i = 0; i < rowMembers.length; i++) {
      const m = rowMembers[i];
      if (m.kind !== "team") {
        out.push(null);
        continue;
      }
      const w = widths[i];
      const cx = xCursor + w / 2;
      const yOnArc = arcYAtX(arc, cx);
      const cy =
        yOnArc + BOX_HEIGHT / 2 + BOX_ARC_GAP + r * (BOX_HEIGHT + ROW_GAP);
      out.push({ cx, cy, width: w });
      xCursor += w + BOX_GAP;
    }
  }
  return out;
}

export function TeamEvolutionDemo() {
  const figureRef = React.useRef<HTMLElement>(null);
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    const node = figureRef.current;
    if (!node) return;

    function check() {
      if (!node) return false;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const visible = rect.top < vh * 0.92 && rect.bottom > 0;
      if (visible) {
        setRevealed(true);
        return true;
      }
      return false;
    }

    if (check()) return;
    function onScroll() {
      if (check()) {
        window.removeEventListener("scroll", onScroll);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fade = (delay: number): React.CSSProperties => ({
    opacity: revealed ? 1 : 0,
    transition: `opacity 0.5s ease-out ${delay}s`,
  });

  return (
    <figure
      ref={figureRef}
      className="border-border bg-card/40 relative mt-8 overflow-hidden rounded-2xl border p-6 sm:p-8"
    >
      <div className="-mx-6 sm:-mx-8">
        <svg
          viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
          className="h-auto w-full"
          aria-label="Saturn Heavy team scaling across five evolution waves"
        >
          <defs>
            <pattern
              id="te-space-dots"
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
          </defs>
          <rect
            x={0}
            y={0}
            width={VIEW.w}
            height={VIEW.h}
            fill="url(#te-space-dots)"
            style={fade(0)}
          />

          <g style={fade(0.1)}>
            <circle
              cx={SOURCE.x}
              cy={SOURCE.y}
              r={30}
              fill="var(--foreground)"
              opacity={0.94}
            />
            <g
              transform={`rotate(-22 ${SOURCE.x} ${SOURCE.y})`}
              opacity={0.55}
            >
              <ellipse
                cx={SOURCE.x}
                cy={SOURCE.y}
                rx={56}
                ry={15}
                fill="none"
                stroke="var(--foreground)"
                strokeWidth={2}
              />
            </g>
          </g>

          {(() => {
            const badgeText = "SATURN HEAVY";
            const badgeW = Math.round(
              badgeText.length * BOX_CHAR_WIDTH + 2 * BOX_LEFT_PAD,
            );
            const badgeCy = SOURCE.y + 68;
            return (
              <g style={fade(0.28)}>
                <rect
                  x={SOURCE.x - badgeW / 2}
                  y={badgeCy - BOX_HEIGHT / 2}
                  width={badgeW}
                  height={BOX_HEIGHT}
                  rx={7}
                  fill="var(--background)"
                  stroke="var(--border)"
                  strokeWidth={1}
                />
                <text
                  x={SOURCE.x}
                  y={badgeCy + 5}
                  textAnchor="middle"
                  fontSize={LABEL_FONT_SIZE}
                  fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
                  fill="var(--foreground)"
                  letterSpacing="0.08em"
                >
                  {badgeText}
                </text>
              </g>
            );
          })()}

          {ARCS.map((arc, i) => {
            const step = STEPS[i];
            const isTeamGroup = step.members[0]?.kind === "team";
            const N = step.members.length;
            const wrapEnabled = isTeamGroup && N > WRAP_THRESHOLD;
            const cols = wrapEnabled ? WRAP_COLS : N;
            const boxLayouts = isTeamGroup
              ? computeBoxLayouts(step.members, cols, arc)
              : null;

            const arcDelay = 0.42 + (i - 1) * 0.1;
            const bandBase = 0.55 + i * 0.16;

            return (
              <g key={i}>
                {i > 0 ? (
                  <path
                    d={arcPathD(arc)}
                    fill="none"
                    stroke="var(--border)"
                    strokeOpacity={0.9}
                    strokeWidth={1.4}
                    style={fade(arcDelay)}
                  />
                ) : null}

                {step.members.map((m, j) => {
                  const memberDelay = bandBase + j * 0.035;
                  if (m.kind === "person") {
                    const rowW = N * DOT_DIAMETER + (N - 1) * DOT_GAP;
                    const cx =
                      SOURCE.x -
                      rowW / 2 +
                      DOT_DIAMETER / 2 +
                      j * (DOT_DIAMETER + DOT_GAP);
                    const yOnArc = arcYAtX(arc, cx);
                    const cy = yOnArc + DOT_DIAMETER / 2 + DOT_ARC_GAP;
                    return (
                      <circle
                        key={j}
                        cx={cx}
                        cy={cy}
                        r={DOT_DIAMETER / 2}
                        fill={ROLE_COLOR[m.role]}
                        stroke="var(--card)"
                        strokeWidth={1.5}
                        style={fade(memberDelay)}
                      >
                        <title>{`${ROLE_LABEL[m.role]} · ${step.label}`}</title>
                      </circle>
                    );
                  }
                  const layout = boxLayouts?.[j];
                  if (!layout) return null;
                  const { cx, cy, width: w } = layout;
                  const left = cx - w / 2;
                  const accent =
                    m.color ??
                    (typeof m.hue === "number"
                      ? `oklch(0.65 0.16 ${m.hue})`
                      : "var(--foreground)");

                  return (
                    <g key={j} style={fade(memberDelay)}>
                      <rect
                        x={left}
                        y={cy - BOX_HEIGHT / 2}
                        width={w}
                        height={BOX_HEIGHT}
                        rx={7}
                        fill="var(--background)"
                        stroke="var(--border)"
                        strokeWidth={1}
                      />
                      <circle
                        cx={left + BOX_LEFT_PAD + BOX_DOT_RADIUS}
                        cy={cy}
                        r={BOX_DOT_RADIUS}
                        fill={accent}
                      />
                      <text
                        x={
                          left +
                          BOX_LEFT_PAD +
                          2 * BOX_DOT_RADIUS +
                          BOX_DOT_TEXT_GAP
                        }
                        y={cy + 5}
                        fontSize={LABEL_FONT_SIZE}
                        fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
                        fill="var(--foreground)"
                        letterSpacing="0.06em"
                      >
                        {m.name.toUpperCase()}
                      </text>
                      <title>{`${m.name} · ${step.label}`}</title>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      <div
        className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2"
        style={fade(1.55)}
      >
        {(Object.keys(ROLE_COLOR) as PersonRole[]).map((role) => (
          <div key={role} className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: ROLE_COLOR[role] }}
            />
            <span className="text-muted-foreground font-mono text-2xs uppercase tracking-mini">
              {ROLE_LABEL_PLURAL[role]}
            </span>
          </div>
        ))}
        <div className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: INTERNAL_TEAM_COLOR }}
          />
          <span className="text-muted-foreground font-mono text-2xs uppercase tracking-mini">
            Internal teams
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: EXTERNAL_TEAM_COLOR }}
          />
          <span className="text-muted-foreground font-mono text-2xs uppercase tracking-mini">
            External teams
          </span>
        </div>
      </div>
    </figure>
  );
}
