type Stat = {
  label: string;
  value: string;
  detail?: string;
};

const STATS: Stat[] = [
  { label: "Design team", value: "17 → 5 → 5", detail: "post-split → post-hire" },
  { label: "Engineering support", value: "14 → 100+", detail: "mostly outsourced, multi-cultural" },
  { label: "Brands managed", value: "12", detail: "white-label, regulated iGaming" },
  { label: "Cross-collab efficiency", value: "4.5×", detail: "after introducing Agile" },
  { label: "Time-to-new-theme", value: "≤ 2 weeks", detail: "Project Atlas key result" },
  { label: "Components migrated (Titan)", value: "60+", detail: "across 12 brand themes" },
];

export function TeamScalingStats() {
  return (
    <section
      aria-label="Quantitative beats of Saturn Heavy"
      className="border-border bg-card/40 mt-6 rounded-2xl border p-5 sm:p-6"
    >
      <p className="text-muted-foreground/70 mb-5 font-mono text-2xs uppercase tracking-mini">
        Fifteen months · By the numbers
      </p>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 sm:gap-x-8">
        {STATS.map((s) => (
          <div key={s.label}>
            <dt className="text-muted-foreground/75 font-mono text-2xs uppercase tracking-mini">
              {s.label}
            </dt>
            <dd className="text-foreground mt-1.5 text-xl font-semibold tabular-nums leading-none">
              {s.value}
            </dd>
            {s.detail ? (
              <dd className="text-muted-foreground/80 mt-1 text-xs leading-snug">
                {s.detail}
              </dd>
            ) : null}
          </div>
        ))}
      </dl>
    </section>
  );
}
