import { cn } from "@/lib/utils";

type Methodology = {
  name: string;
  fullName: string;
  blurb: string;
  sample: { line: string; tone: "block" | "element" | "modifier" | "muted" }[];
  preferred?: boolean;
};

const METHODOLOGIES: Methodology[] = [
  {
    name: "BEM",
    fullName: "Block · Element · Modifier",
    blurb: "Flat selectors, equal weight. Long names, predictable structure.",
    sample: [
      { line: ".card", tone: "block" },
      { line: ".card__title", tone: "element" },
      { line: ".card__title--large", tone: "modifier" },
      { line: ".card__action", tone: "element" },
      { line: ".card__action--primary", tone: "modifier" },
    ],
  },
  {
    name: "RSCSS",
    fullName: "Reasonable System for CSS",
    blurb:
      "Components first, children scoped to parents. Fits React, Vue, Angular, Bootstrap.",
    preferred: true,
    sample: [
      { line: ".card", tone: "block" },
      { line: "  > .title", tone: "element" },
      { line: "  > .title.-large", tone: "modifier" },
      { line: "  > .action", tone: "element" },
      { line: "  > .action.-primary", tone: "modifier" },
    ],
  },
  {
    name: "SMACSS",
    fullName: "Scalable & Modular Architecture",
    blurb: "A categorisation style guide rather than a strict naming framework.",
    sample: [
      { line: ".l-card", tone: "muted" },
      { line: ".card", tone: "block" },
      { line: ".card .title", tone: "element" },
      { line: ".card.is-large", tone: "modifier" },
      { line: ".card .action", tone: "element" },
    ],
  },
];

const TONE_STYLES: Record<string, string> = {
  block: "text-foreground font-medium",
  element: "text-foreground/85",
  modifier: "text-[oklch(0.55_0.18_75)] dark:text-[oklch(0.82_0.14_75)]",
  muted: "text-muted-foreground/70",
};

export function NamingMethodologiesDemo() {
  return (
    <figure className="mt-6 grid gap-3 lg:grid-cols-3">
      {METHODOLOGIES.map(({ name, fullName, blurb, sample, preferred }) => (
        <div
          key={name}
          className={cn(
            "border-border bg-card/40 flex flex-col gap-4 rounded-2xl border p-5",
            preferred &&
              "border-[oklch(0.65_0.16_75_/_0.55)] dark:border-[oklch(0.78_0.15_75_/_0.55)]",
          )}
        >
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-foreground text-base font-semibold tracking-tight">
              {name}
            </p>
            {preferred && (
              <span className="bg-[oklch(0.65_0.16_75_/_0.14)] text-[oklch(0.55_0.18_75)] dark:bg-[oklch(0.78_0.15_75_/_0.16)] dark:text-[oklch(0.82_0.14_75)] rounded-md px-1.5 py-0.5 font-mono text-[10px] tracking-wider uppercase">
                preferred
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-xs uppercase tracking-wide font-mono">
            {fullName}
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {blurb}
          </p>
          <pre className="border-border/60 bg-muted/30 mt-1 overflow-x-auto rounded-lg border p-3 font-mono text-[12px] leading-6">
            {sample.map((s, i) => (
              <div key={i} className={TONE_STYLES[s.tone]}>
                {s.line}
              </div>
            ))}
          </pre>
        </div>
      ))}
    </figure>
  );
}
