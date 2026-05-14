import type { ReactNode } from "react";

type Props = {
  caption: ReactNode;
  height?: "sm" | "md" | "lg";
};

const HEIGHTS = {
  sm: "min-h-32",
  md: "min-h-48",
  lg: "min-h-64",
} as const;

export function DemoPlaceholder({ caption, height = "md" }: Props) {
  return (
    <figure className="border-border bg-card/40 mt-6 overflow-hidden rounded-2xl border border-dashed">
      <div
        className={`flex ${HEIGHTS[height]} items-center justify-center px-6 py-10`}
      >
        <span className="text-muted-foreground/70 font-mono text-2xs tracking-[0.18em] uppercase">
          Demo placeholder
        </span>
      </div>
      <figcaption className="border-border/60 bg-background/40 text-muted-foreground border-t border-dashed px-5 py-3 text-sm leading-relaxed">
        {caption}
      </figcaption>
    </figure>
  );
}
