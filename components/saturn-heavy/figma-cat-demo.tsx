import * as React from "react";

// "Sorry, no Figma link" — a tongue-in-cheek illustrated apology that sits
// at the tail of the Titan chapter. The card is framed in the Project
// Atlas language (border-border/60 bg-card/40, rounded-2xl, sm padding
// bump) with two ornaments: the Figma mark in the top-left and a
// pulsating red live-indicator dot in the top-right.
//
// The visual is a binary grid (0s and 1s in Geist Mono) where most
// digits are rendered at low opacity and a select few are full-bright
// white, forming a sad X-eye face. Rendered as inline SVG with a
// viewBox so the grid scales pixel-perfect to whatever width the card
// gives it — no clamp() hand-tuning, no jumps at breakpoints.

const COLS = 60;
const ROWS = 30;

// SVG units. Cells are square (CELL_W === CELL_H) so the face pattern's
// proportions in the grid map 1:1 to its proportions on screen — i.e.
// "letter-spacing" the digits horizontally to match line-height. This is
// what makes the round face read as round instead of horizontally-squished
// the way pure monospace does (mono chars are typically ~0.6em wide).
const CELL_W = 11;
const CELL_H = 11;
const VIEW_W = COLS * CELL_W;
const VIEW_H = ROWS * CELL_H;

// Face mask. X = full-bright digit, . = dimmed digit. Eyes are 5×5 X
// shapes (X...X / .X.X. / ..X.. / .X.X. / X...X) centred at cols 24 and
// 35 (eye-to-eye distance 11). The frown is a downturned 4-wide arc that
// fans out from cols 28–31 at row 19 to corners at cols 25 and 34 at
// row 22. With square cells the eye-to-mouth bounding region is ~16 cols
// wide × ~13 rows tall — close to a circle.
const MASK = [
  "............................................................",
  "............................................................",
  "............................................................",
  "............................................................",
  "............................................................",
  "............................................................",
  "............................................................",
  "............................................................",
  "............................................................",
  "......................X...X......X...X.....................",
  ".......................X.X........X.X......................",
  "........................X..........X.......................",
  ".......................X.X........X.X......................",
  "......................X...X......X...X.....................",
  "............................................................",
  "............................................................",
  "............................................................",
  "............................................................",
  "............................XXXX............................",
  "...........................X....X...........................",
  "..........................X......X..........................",
  ".........................X........X.........................",
  "............................................................",
  "............................................................",
  "............................................................",
  "............................................................",
  "............................................................",
  "............................................................",
  "............................................................",
  "............................................................",
];

// Deterministic seeded RNG so server-rendered and client-hydrated grids
// produce identical strings (no hydration mismatch). Mulberry32 is the
// usual choice for tiny seeded PRNGs.
function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(0xb1c4d51e);
const GRID: string[][] = Array.from({ length: ROWS }, () =>
  Array.from({ length: COLS }, () => (rng() < 0.5 ? "0" : "1")),
);

export function FigmaCatDemo() {
  return (
    <figure
      aria-label="A binary-grid sad face — sorry, no Figma link"
      className="border-border/60 bg-card/40 relative mt-8 overflow-hidden rounded-2xl border"
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="A grid of 0s and 1s with selected digits highlighted to draw a sad X-eye face"
        className="text-foreground block h-auto w-full"
      >
        {GRID.map((row, r) =>
          row.map((char, c) => {
            const lit = MASK[r]?.[c] === "X";
            return (
              <text
                key={`${r}-${c}`}
                x={c * CELL_W + CELL_W / 2}
                y={r * CELL_H + CELL_H * 0.84}
                fontSize={CELL_H * 0.95}
                textAnchor="middle"
                fontFamily="var(--font-mono), ui-monospace, monospace"
                fill="currentColor"
                opacity={lit ? 1 : 0.18}
              >
                {char}
              </text>
            );
          }),
        )}
      </svg>

      <div className="mt-6 flex justify-center sm:mt-8">
        <span className="relative inline-flex">
          <span
            aria-hidden="true"
            className="absolute inset-0 -m-1 animate-ping rounded-full bg-red-500/35"
          />
          <FigmaMark
            aria-hidden="true"
            className="relative size-6"
            style={{
              filter: "drop-shadow(0 0 6px oklch(0.65 0.22 25 / 0.5))",
            }}
          />
        </span>
      </div>

      <figcaption className="text-muted-foreground/85 mt-5 mb-7 text-center font-mono text-2xs uppercase tracking-mini sm:mb-9">
        Sorry, I cannot share any Figma links
      </figcaption>
    </figure>
  );
}

function FigmaMark({
  className,
  ...rest
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 38 57"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Figma"
      {...rest}
    >
      <path
        d="M19 28.5C19 25.9804 20.0009 23.5641 21.7825 21.7825C23.5641 20.0009 25.9804 19 28.5 19C31.0196 19 33.4359 20.0009 35.2175 21.7825C36.9991 23.5641 38 25.9804 38 28.5C38 31.0196 36.9991 33.4359 35.2175 35.2175C33.4359 36.9991 31.0196 38 28.5 38C25.9804 38 23.5641 36.9991 21.7825 35.2175C20.0009 33.4359 19 31.0196 19 28.5Z"
        fill="#1ABCFE"
      />
      <path
        d="M0 47.5C0 44.9804 1.00089 42.5641 2.78249 40.7825C4.56408 39.0009 6.98044 38 9.5 38H19V47.5C19 50.0196 17.9991 52.4359 16.2175 54.2175C14.4359 55.9991 12.0196 57 9.5 57C6.98044 57 4.56408 55.9991 2.78249 54.2175C1.00089 52.4359 0 50.0196 0 47.5Z"
        fill="#0ACF83"
      />
      <path
        d="M19 0V19H28.5C31.0196 19 33.4359 17.9991 35.2175 16.2175C36.9991 14.4359 38 12.0196 38 9.5C38 6.98044 36.9991 4.56408 35.2175 2.78249C33.4359 1.00089 31.0196 0 28.5 0H19Z"
        fill="#FF7262"
      />
      <path
        d="M0 9.5C0 12.0196 1.00089 14.4359 2.78249 16.2175C4.56408 17.9991 6.98044 19 9.5 19H19V0H9.5C6.98044 0 4.56408 1.00089 2.78249 2.78249C1.00089 4.56408 0 6.98044 0 9.5Z"
        fill="#F24E1E"
      />
      <path
        d="M0 28.5C0 31.0196 1.00089 33.4359 2.78249 35.2175C4.56408 36.9991 6.98044 38 9.5 38H19V19H9.5C6.98044 19 4.56408 20.0009 2.78249 21.7825C1.00089 23.5641 0 25.9804 0 28.5Z"
        fill="#A259FF"
      />
    </svg>
  );
}
