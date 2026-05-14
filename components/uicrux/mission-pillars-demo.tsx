import { MessagesSquare, Layers, ScanSearch, Rocket } from "lucide-react";

import { cn } from "@/lib/utils";

type Pillar = {
  title: string;
  blurb: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
};

const PILLARS: Pillar[] = [
  {
    title: "Collaboration & Communication",
    blurb:
      "Shared vocabulary between design and engineering — fewer translation losses at handoff.",
    icon: MessagesSquare,
    accent: "amber",
  },
  {
    title: "Management & Scalability",
    blurb:
      "Names and tokens that compound as the product grows, not snap as it adds surface.",
    icon: Layers,
    accent: "violet",
  },
  {
    title: "Understanding & Review",
    blurb:
      "Designers reading code reviews, engineers reading design files — same artefact, two lenses.",
    icon: ScanSearch,
    accent: "cyan",
  },
  {
    title: "Onboarding & Delivery",
    blurb:
      "New cross-functional hires ramp on the system instead of decoding individual habits.",
    icon: Rocket,
    accent: "mint",
  },
];

const ACCENT_STYLES: Record<string, string> = {
  amber:
    "bg-[oklch(0.65_0.16_75_/_0.14)] text-[oklch(0.55_0.18_75)] dark:bg-[oklch(0.78_0.15_75_/_0.16)] dark:text-[oklch(0.82_0.14_75)]",
  violet:
    "bg-[oklch(0.55_0.2_290_/_0.12)] text-[oklch(0.5_0.22_290)] dark:bg-[oklch(0.74_0.18_290_/_0.14)] dark:text-[oklch(0.78_0.18_290)]",
  cyan: "bg-[oklch(0.7_0.13_220_/_0.14)] text-[oklch(0.5_0.16_220)] dark:bg-[oklch(0.78_0.13_220_/_0.16)] dark:text-[oklch(0.82_0.12_220)]",
  mint: "bg-[oklch(0.78_0.13_175_/_0.14)] text-[oklch(0.5_0.14_175)] dark:bg-[oklch(0.82_0.13_175_/_0.16)] dark:text-[oklch(0.85_0.12_175)]",
};

export function MissionPillarsDemo() {
  return (
    <figure className="mt-6 grid gap-3 sm:grid-cols-2">
      {PILLARS.map(({ title, blurb, icon: Icon, accent }) => (
        <div
          key={title}
          className="border-border bg-card/40 flex flex-col gap-3 rounded-2xl border p-5"
        >
          <span
            aria-hidden="true"
            className={cn(
              "flex size-9 items-center justify-center rounded-lg",
              ACCENT_STYLES[accent],
            )}
          >
            <Icon className="size-4.5" />
          </span>
          <div>
            <p className="text-foreground text-sm font-semibold tracking-tight">
              {title}
            </p>
            <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
              {blurb}
            </p>
          </div>
        </div>
      ))}
    </figure>
  );
}
