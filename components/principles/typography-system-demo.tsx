type Row = {
  name: string;
  text: string;
  fontSize: string;
  lineHeight: number;
  letterSpacing: string;
  fontWeight: number;
  textClass: string;
};

const ROWS: Row[] = [
  {
    name: "display",
    text: "Type scale",
    fontSize: "2.5rem",
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
    fontWeight: 600,
    textClass: "text-foreground",
  },
  {
    name: "heading",
    text: "Section heading",
    fontSize: "1.5rem",
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
    fontWeight: 600,
    textClass: "text-foreground",
  },
  {
    name: "body",
    text: "Body text reads comfortably at 1.7 line-height with no tracking adjustment. The generous space between lines lets the eye move from the end of one line to the beginning of the next without effort. Tighter line-height — 1.3 or 1.4 — works for single-line labels but causes lines to feel stacked and compressed in paragraph form.",
    fontSize: "1rem",
    lineHeight: 1.7,
    letterSpacing: "0",
    fontWeight: 400,
    textClass: "text-foreground/85",
  },
  {
    name: "label",
    text: "Label / caption context",
    fontSize: "0.8125rem",
    lineHeight: 1.4,
    letterSpacing: "0.01em",
    fontWeight: 500,
    textClass: "text-muted-foreground",
  },
];

export function TypographySystemDemo() {
  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-6 py-10 sm:px-10 sm:py-12">
      <span
        role="img"
        aria-label="Each context tuned for its optical needs"
        className="bg-emerald-400 absolute top-4 right-4 size-2 rounded-full"
      />
      <div className="flex flex-col gap-6 sm:gap-8">
        {ROWS.map((row) => (
          <div
            key={row.name}
            className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[5rem_1fr] sm:items-baseline sm:gap-6"
          >
            <span className="text-muted-foreground/55 font-mono text-xs tracking-wider lowercase">
              {row.name}
            </span>
            <p
              className={row.textClass}
              style={{
                fontSize: row.fontSize,
                lineHeight: row.lineHeight,
                letterSpacing: row.letterSpacing,
                fontWeight: row.fontWeight,
              }}
            >
              {row.text}
            </p>
          </div>
        ))}
      </div>
    </figure>
  );
}
