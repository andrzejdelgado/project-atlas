import Link from "next/link";

type Entry = { id: string; title: string };
type Group = { category: string; entries: Entry[] };

const GROUPS: Group[] = [
  {
    category: "Typography",
    entries: [
      { id: "font-rendering", title: "Font Rendering" },
      { id: "typography-system", title: "Typography System" },
      { id: "line-length", title: "Line Length Constraint" },
      { id: "baseline-alignment", title: "Baseline Alignment" },
      { id: "fluid-type-scale", title: "Fluid Type Scale" },
      { id: "font-features", title: "Font Feature Settings" },
      { id: "text-decoration", title: "Text Decoration Refinement" },
      { id: "optical-sizing", title: "Optical Sizing" },
    ],
  },
  {
    category: "Color",
    entries: [
      { id: "saturated-neutrals", title: "Saturated Neutrals" },
      { id: "oklch-color", title: "OKLCH for Perceptual Color" },
      { id: "gradient-color-space", title: "Gradient Refinement" },
      { id: "container-brightness", title: "Container Brightness Limits" },
    ],
  },
  {
    category: "Surfaces & Depth",
    entries: [
      { id: "concentric-radius", title: "Concentric Border Radius" },
      { id: "optical-alignment", title: "Optical Over Geometric Alignment" },
      { id: "min-hit-area", title: "Minimum Hit Area" },
      { id: "elevation-shadow", title: "Elevation Shadow" },
      { id: "filter-override", title: "CSS Filter Color Override" },
      { id: "inset-shadow", title: "Inset Shadow for Pressed States" },
      { id: "z-index-scale", title: "Elevation + Z-Index Scale" },
    ],
  },
  {
    category: "Visual Details",
    entries: [
      { id: "de-emphasize", title: "De-emphasize to Emphasize" },
      { id: "cursor-affordance", title: "Cursor Affordance" },
      { id: "icon-weight", title: "Icon Weight Reduction" },
    ],
  },
  {
    category: "Animations",
    entries: [
      { id: "skip-on-load", title: "Skip Animation on Page Load" },
      { id: "animation-duration", title: "Animation Duration Standards" },
      { id: "ease-out", title: "Ease-out for Interactive" },
      { id: "scroll-driven", title: "Scroll-Driven Animations" },
      { id: "reduced-motion", title: "Reduced Motion" },
      { id: "flip", title: "FLIP for Layout Animations" },
      { id: "spring", title: "Spring Physics via linear()" },
    ],
  },
  {
    category: "Performance",
    entries: [
      { id: "transition-specificity", title: "Never Use transition: all" },
      { id: "content-visibility", title: "content-visibility: auto" },
      { id: "css-containment", title: "CSS Containment" },
      { id: "compositor-only", title: "Compositor-Only Animations" },
    ],
  },
];

export function PrincipleToc() {
  let counter = 0;
  return (
    <nav
      aria-label="Principles"
      className="border-border bg-card/40 mt-10 rounded-2xl border p-5 sm:p-6"
    >
      <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
        Contents · 33 principles
      </p>
      <div className="mt-4 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {GROUPS.map((group) => (
          <div key={group.category}>
            <p className="text-foreground text-sm font-semibold tracking-tight">
              {group.category}
            </p>
            <ul className="mt-2 flex flex-col gap-1">
              {group.entries.map((entry) => {
                counter += 1;
                const num = String(counter).padStart(2, "0");
                return (
                  <li key={entry.id} className="flex items-baseline gap-3">
                    <span className="text-muted-foreground/70 font-mono text-xs tabular-nums">
                      {num}
                    </span>
                    <Link
                      href={`#${entry.id}`}
                      className="text-foreground/85 hover:text-foreground decoration-muted-foreground/40 hover:decoration-foreground text-sm underline underline-offset-4 transition-colors duration-200"
                    >
                      {entry.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
