"use client";

import * as React from "react";

type Goal = {
  area: string;
  outcome: React.ReactNode;
};

type Boundary = {
  area: string;
  outcome: React.ReactNode;
};

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-muted text-foreground rounded-md px-1.5 py-0.5 font-mono text-[0.9em]">
      {children}
    </code>
  );
}

const GOALS: Goal[] = [
  {
    area: "Web performance",
    outcome: (
      <>
        Every page migrated off <Chip>Gargantua</Chip> should land with{" "}
        <Chip>LCP</Chip> under 2.5s. This was a hard deck.
      </>
    ),
  },
  {
    area: "Flexibility",
    outcome: (
      <>
        The Operator can use <Chip>Saturn</Chip>&apos;s Library as any other UI
        Library, and be able to extend <Chip>Saturn</Chip> on its own.
      </>
    ),
  },
  {
    area: "Extensibility",
    outcome: (
      <>
        Thanks to agnosticity of <Chip>Saturn Heavy</Chip> the Operator should
        be able to connect any <Chip>CMS</Chip> to the platform.
      </>
    ),
  },
  {
    area: "Time to market",
    outcome: (
      <>
        A new brand should be shipped in two weeks. All product verticals can
        be turned on a on turned off on daily basis.
      </>
    ),
  },
  {
    area: "Operator autonomy",
    outcome: (
      <>
        The Operator should be able to create, modify and manage components,
        layouts and themes autonomously end-to-end.
      </>
    ),
  },
];

const OUT_OF_SCOPE: Boundary[] = [
  {
    area: "Vertical UX/UI",
    outcome: (
      <>
        <Chip>Saturn Heavy</Chip> should not make changes to <Chip>UX</Chip>{" "}
        nor <Chip>UI</Chip> of the brands.
      </>
    ),
  },
  {
    area: "Third-party integrations",
    outcome: (
      <>
        Analytics, A/B testing and the rest of the features of that nature
        should stay in their current form.
      </>
    ),
  },
];

const ACCENT = "var(--accent-emerald)";
const BOUNDARY = "var(--destructive)";

export function GoalsDemo() {
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
      <div className="relative p-5 sm:p-7">
        <div className="mb-5" style={fade(0)}>
          <span className="text-muted-foreground font-mono text-2xs uppercase tracking-mini">
            Terraform · Key results
          </span>
        </div>

        <ol className="flex flex-col gap-3">
          {GOALS.map((goal, i) => (
            <li
              key={goal.area}
              className="border-border/70 bg-background/75 hover:border-border relative flex flex-col gap-2.5 rounded-xl border p-4 transition-colors duration-200 sm:p-4.5"
              style={fade(0.08 + i * 0.06)}
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: ACCENT }}
                />
                <span className="text-foreground font-mono text-2xs uppercase tracking-mini">
                  {goal.area}
                </span>
              </div>
              <p className="text-foreground/85 text-sm leading-snug">
                {goal.outcome}
              </p>
            </li>
          ))}
        </ol>

        <div
          className="mt-6 mb-3"
          style={fade(0.08 + GOALS.length * 0.06)}
        >
          <span className="text-muted-foreground font-mono text-2xs uppercase tracking-mini">
            Out of scope
          </span>
        </div>

        <ul className="flex flex-col gap-3">
          {OUT_OF_SCOPE.map((item, i) => (
            <li
              key={item.area}
              className="border-border/40 bg-background/45 relative flex flex-col gap-2.5 rounded-xl border p-4 sm:p-4.5"
              style={fade(0.14 + GOALS.length * 0.06 + i * 0.06)}
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: BOUNDARY, opacity: 0.85 }}
                />
                <span className="text-muted-foreground font-mono text-2xs uppercase tracking-mini">
                  {item.area}
                </span>
              </div>
              <p className="text-muted-foreground/80 text-sm leading-snug">
                {item.outcome}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
