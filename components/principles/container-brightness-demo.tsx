import { cn } from "@/lib/utils";

type Mode = "dark" | "light";
type Variant = "default" | "refined";

const SURFACES: Record<Mode, { surfaceBg: string; cards: Record<Variant, string> }> = {
  dark: {
    surfaceBg: "oklch(0.10 0 0)",
    cards: {
      default: "oklch(0.30 0 0)",
      refined: "oklch(0.16 0 0)",
    },
  },
  light: {
    surfaceBg: "oklch(0.97 0 0)",
    cards: {
      default: "oklch(0.78 0 0)",
      refined: "oklch(0.93 0 0)",
    },
  },
};

const TEXT_COLORS: Record<Mode, { fg: string; muted: string; trend: string }> = {
  dark: {
    fg: "oklch(0.95 0 0)",
    muted: "oklch(0.65 0 0)",
    trend: "oklch(0.78 0.13 165)",
  },
  light: {
    fg: "oklch(0.20 0 0)",
    muted: "oklch(0.45 0 0)",
    trend: "oklch(0.50 0.13 165)",
  },
};

function MiniCard({
  bgColor,
  textColors,
  kind,
}: {
  bgColor: string;
  textColors: { fg: string; muted: string; trend: string };
  kind: "revenue" | "deployment";
}) {
  return (
    <div
      className="flex flex-col gap-2 rounded-xl px-5 py-4"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span
          className="font-mono text-2xs tracking-mini uppercase"
          style={{ color: textColors.muted }}
        >
          {kind === "revenue" ? "Revenue" : "Deployment"}
        </span>
        <span
          className="font-mono text-2xs tabular-nums"
          style={{ color: textColors.trend }}
        >
          {kind === "revenue" ? "↑ 8.2%" : "● Live"}
        </span>
      </div>
      {kind === "revenue" ? (
        <>
          <div
            className="text-lg font-semibold tabular-nums"
            style={{ color: textColors.fg }}
          >
            $12,486.00
          </div>
          <div className="text-xs" style={{ color: textColors.muted }}>
            Up from $11,540 last month — driven by enterprise renewals.
          </div>
        </>
      ) : (
        <>
          <div
            className="text-sm font-semibold"
            style={{ color: textColors.fg }}
          >
            build-prod-2486 promoted
          </div>
          <div className="text-xs" style={{ color: textColors.muted }}>
            Verified by 4 checks · Rolled out to 100% of traffic 2 minutes ago.
          </div>
        </>
      )}
    </div>
  );
}

function Surface({
  mode,
  variant,
}: {
  mode: Mode;
  variant: Variant;
}) {
  const surface = SURFACES[mode];
  const text = TEXT_COLORS[mode];
  const cardBg = surface.cards[variant];
  const dotClass = variant === "default" ? "bg-red-400" : "bg-emerald-400";
  const dotLabel =
    variant === "default" ? "Too much contrast" : "Within limits";
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border/40 p-5"
      style={{ backgroundColor: surface.surfaceBg }}
    >
      <span
        role="img"
        aria-label={dotLabel}
        className={cn(
          "absolute top-3 right-3 size-2 rounded-full",
          dotClass,
        )}
      />
      <div className="flex flex-col gap-3">
        <MiniCard bgColor={cardBg} textColors={text} kind="revenue" />
        <MiniCard bgColor={cardBg} textColors={text} kind="deployment" />
      </div>
    </div>
  );
}

function ModeBlock({ mode }: { mode: Mode }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-muted-foreground/70 font-mono text-2xs tracking-mini uppercase">
        {mode === "dark" ? "Dark UI · 12% ceiling" : "Light UI · 7% ceiling"}
      </span>
      <div className="grid gap-3 sm:grid-cols-2">
        <Surface mode={mode} variant="default" />
        <Surface mode={mode} variant="refined" />
      </div>
    </div>
  );
}

export function ContainerBrightnessDemo() {
  return (
    <figure className="mt-6 flex flex-col gap-6">
      <ModeBlock mode="dark" />
      <ModeBlock mode="light" />
    </figure>
  );
}
