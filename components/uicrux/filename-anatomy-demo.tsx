type Segment = {
  text: string;
  label: string;
  tone: "context" | "purpose" | "mode" | "lang" | "size" | "density" | "format";
};

const FILENAME: Segment[] = [
  { text: "about_us", label: "Page / context", tone: "context" },
  { text: "-", label: "", tone: "context" },
  { text: "hero_banner", label: "Component", tone: "purpose" },
  { text: "-", label: "", tone: "purpose" },
  { text: "dark", label: "Theme", tone: "mode" },
  { text: "-", label: "", tone: "mode" },
  { text: "en", label: "Locale", tone: "lang" },
  { text: "-", label: "", tone: "lang" },
  { text: "1920x768", label: "Dimensions", tone: "size" },
  { text: "@2x", label: "Density", tone: "density" },
  { text: ".jpeg", label: "Format", tone: "format" },
];

const TONE_STYLES: Record<Segment["tone"], { text: string; chip: string }> = {
  context: {
    text: "text-[oklch(0.55_0.18_75)] dark:text-[oklch(0.82_0.14_75)]",
    chip: "bg-[oklch(0.65_0.16_75_/_0.14)] text-[oklch(0.55_0.18_75)] dark:bg-[oklch(0.78_0.15_75_/_0.16)] dark:text-[oklch(0.82_0.14_75)]",
  },
  purpose: {
    text: "text-[oklch(0.5_0.22_290)] dark:text-[oklch(0.78_0.18_290)]",
    chip: "bg-[oklch(0.55_0.2_290_/_0.12)] text-[oklch(0.5_0.22_290)] dark:bg-[oklch(0.74_0.18_290_/_0.14)] dark:text-[oklch(0.78_0.18_290)]",
  },
  mode: {
    text: "text-[oklch(0.5_0.16_220)] dark:text-[oklch(0.82_0.12_220)]",
    chip: "bg-[oklch(0.7_0.13_220_/_0.14)] text-[oklch(0.5_0.16_220)] dark:bg-[oklch(0.78_0.13_220_/_0.16)] dark:text-[oklch(0.82_0.12_220)]",
  },
  lang: {
    text: "text-[oklch(0.5_0.14_175)] dark:text-[oklch(0.85_0.12_175)]",
    chip: "bg-[oklch(0.78_0.13_175_/_0.14)] text-[oklch(0.5_0.14_175)] dark:bg-[oklch(0.82_0.13_175_/_0.16)] dark:text-[oklch(0.85_0.12_175)]",
  },
  size: {
    text: "text-[oklch(0.6_0.18_30)] dark:text-[oklch(0.82_0.14_30)]",
    chip: "bg-[oklch(0.65_0.18_30_/_0.14)] text-[oklch(0.6_0.18_30)] dark:bg-[oklch(0.78_0.16_30_/_0.16)] dark:text-[oklch(0.82_0.14_30)]",
  },
  density: {
    text: "text-[oklch(0.55_0.18_320)] dark:text-[oklch(0.82_0.14_320)]",
    chip: "bg-[oklch(0.6_0.18_320_/_0.14)] text-[oklch(0.55_0.18_320)] dark:bg-[oklch(0.78_0.16_320_/_0.16)] dark:text-[oklch(0.82_0.14_320)]",
  },
  format: {
    text: "text-muted-foreground",
    chip: "bg-muted text-muted-foreground",
  },
};

const LEGEND = [
  { tone: "context" as const, label: "Page / context" },
  { tone: "purpose" as const, label: "Component" },
  { tone: "mode" as const, label: "Theme" },
  { tone: "lang" as const, label: "Locale" },
  { tone: "size" as const, label: "Dimensions" },
  { tone: "density" as const, label: "Density" },
  { tone: "format" as const, label: "Format" },
];

export function FilenameAnatomyDemo() {
  return (
    <figure className="mt-6">
      <div className="border-border bg-card/40 rounded-2xl border p-5 sm:p-7">
        <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
          A self-describing filename
        </p>
        <pre className="mt-4 overflow-x-auto font-mono text-base sm:text-lg">
          <code>
            {FILENAME.map((segment, i) => (
              <span key={i} className={TONE_STYLES[segment.tone].text}>
                {segment.text}
              </span>
            ))}
          </code>
        </pre>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {LEGEND.map(({ tone, label }) => (
            <li
              key={tone}
              className={`${TONE_STYLES[tone].chip} rounded-md px-2 py-0.5 font-mono text-[11px] tracking-wide`}
            >
              {label}
            </li>
          ))}
        </ul>

        <p className="text-muted-foreground/80 mt-5 text-sm leading-relaxed">
          Each segment encodes a fact a developer would otherwise have to ask
          for. Underscores group what reads as one word; hyphens separate what
          reads as two — so bulk-renames in the IDE stay surgical.
        </p>
      </div>
    </figure>
  );
}
