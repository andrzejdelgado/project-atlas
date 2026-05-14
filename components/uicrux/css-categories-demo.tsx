import { Boxes, Ruler, Activity, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type Category = {
  title: string;
  blurb: string;
  lessons: string[];
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
};

const CATEGORIES: Category[] = [
  {
    title: "Fundamentals",
    blurb: "The mental model browsers use to render anything at all.",
    lessons: ["CSS Basics", "Layout"],
    icon: Boxes,
    accent: "amber",
  },
  {
    title: "Design Computing",
    blurb:
      "Where designs become tokens — units, functions, and responsive math.",
    lessons: ["Measurement Units", "CSS Functions", "Responsiveness"],
    icon: Ruler,
    accent: "violet",
  },
  {
    title: "Advanced Interaction",
    blurb: "Motion and feedback — the language of cause and effect.",
    lessons: ["Animations", "Transitions"],
    icon: Activity,
    accent: "cyan",
  },
  {
    title: "Advanced Visual Effects",
    blurb:
      "Compositional work without bouncing back to Photoshop or Figma exports.",
    lessons: ["Blend Modes", "Gradients", "Filters"],
    icon: Sparkles,
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

export function CssCategoriesDemo() {
  return (
    <figure className="mt-6 grid gap-3 sm:grid-cols-2">
      {CATEGORIES.map(({ title, blurb, lessons, icon: Icon, accent }) => (
        <div
          key={title}
          className="border-border bg-card/40 flex flex-col gap-4 rounded-2xl border p-5"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className={cn(
                "flex size-9 items-center justify-center rounded-lg",
                ACCENT_STYLES[accent],
              )}
            >
              <Icon className="size-4.5" />
            </span>
            <p className="text-foreground text-sm font-semibold tracking-tight">
              {title}
            </p>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {blurb}
          </p>
          <ul className="border-border/60 flex flex-wrap gap-1.5 border-t pt-3">
            {lessons.map((lesson) => (
              <li
                key={lesson}
                className="border-border/70 bg-muted/40 text-foreground/80 rounded-md border px-2 py-0.5 font-mono text-[11px] tracking-wide"
              >
                {lesson}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </figure>
  );
}
