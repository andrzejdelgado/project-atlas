import { cn } from "@/lib/utils";

const STEPS = 8;

function buildOklchRamp(): string[] {
  const colors: string[] = [];
  for (let i = 0; i < STEPS; i++) {
    const t = i / (STEPS - 1);
    const L = 0.92 - t * 0.7;
    const C = 0.04 + Math.sin(t * Math.PI) * 0.18;
    colors.push(`oklch(${L.toFixed(3)} ${C.toFixed(3)} 264)`);
  }
  return colors;
}

function buildHslRamp(): string[] {
  const colors: string[] = [];
  for (let i = 0; i < STEPS; i++) {
    const t = i / (STEPS - 1);
    const L = 90 - t * 70;
    const S = 65;
    colors.push(`hsl(225 ${S}% ${L.toFixed(1)}%)`);
  }
  return colors;
}

const HSL_RAMP = buildHslRamp();
const OKLCH_RAMP = buildOklchRamp();

type RowProps = {
  label: string;
  ramp: string[];
  dotClass: string;
};

function Row({ label, ramp, dotClass }: RowProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
      <div className="flex shrink-0 items-center gap-2 sm:w-20">
        <span
          aria-hidden="true"
          className={cn("size-2 rounded-full", dotClass)}
        />
        <span className="text-muted-foreground/80 font-mono text-xs">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        {ramp.map((c, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="border-border/40 size-8 rounded-xl border sm:size-12"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  );
}

export function OklchColorDemo() {
  return (
    <figure className="border-border bg-card/40 mt-6 rounded-2xl border px-8 py-9">
      <div className="flex flex-col items-center gap-7">
        <Row label="HSL" ramp={HSL_RAMP} dotClass="bg-red-400" />
        <Row label="OKLCH" ramp={OKLCH_RAMP} dotClass="bg-emerald-400" />
      </div>
    </figure>
  );
}
