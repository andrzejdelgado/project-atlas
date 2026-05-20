"use client";

import * as React from "react";

type Brand = { code: string; name: string; hue: number };

const BRANDS: Brand[] = [
  { code: "PSR", name: "Polestar", hue: 240 },
  { code: "GEM", name: "Gemini", hue: 290 },
  { code: "ORN", name: "Orion", hue: 75 },
  { code: "MER", name: "Mercury", hue: 155 },
  { code: "VEG", name: "Vega", hue: 25 },
  { code: "KER", name: "Kepler", hue: 195 },
  { code: "SRS", name: "Sirius", hue: 0 },
  { code: "ARM", name: "Artemis", hue: 130 },
  { code: "STR", name: "Stratos", hue: 175 },
  { code: "PHE", name: "Phoenix", hue: 50 },
  { code: "AND", name: "Andromeda", hue: 320 },
  { code: "NTL", name: "Nautilus", hue: 220 },
];

type PathEntry = { d: string; hue: number; code: string };

export function BrandNetwork() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const kernelRef = React.useRef<HTMLDivElement>(null);
  const brandRefs = React.useRef<Map<string, HTMLLIElement>>(new Map());
  const [paths, setPaths] = React.useState<PathEntry[]>([]);
  const [dims, setDims] = React.useState({ w: 0, h: 0 });

  React.useEffect(() => {
    const compute = () => {
      const container = containerRef.current;
      const kernel = kernelRef.current;
      if (!container || !kernel) return;

      const cRect = container.getBoundingClientRect();
      const kRect = kernel.getBoundingClientRect();

      const startX = kRect.left + kRect.width / 2 - cRect.left;
      const startY = kRect.bottom - cRect.top;

      const next: PathEntry[] = [];
      BRANDS.forEach((brand) => {
        const el = brandRefs.current.get(brand.code);
        if (!el) return;
        const r = el.getBoundingClientRect();
        const endX = r.left + r.width / 2 - cRect.left;
        const endY = r.top - cRect.top;

        const midY = (startY + endY) / 2;
        const d = `M ${startX.toFixed(2)} ${startY.toFixed(2)} C ${startX.toFixed(2)} ${midY.toFixed(2)}, ${endX.toFixed(2)} ${midY.toFixed(2)}, ${endX.toFixed(2)} ${endY.toFixed(2)}`;
        next.push({ d, hue: brand.hue, code: brand.code });
      });

      setPaths(next);
      setDims({ w: cRect.width, h: cRect.height });
    };

    compute();
    const ro = new ResizeObserver(compute);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative mt-5">
      <div ref={kernelRef} className="relative z-10 flex justify-center">
        <span
          title="kernelTheme — shared base every brand extends"
          className="border-foreground/20 bg-foreground/[0.06] text-foreground inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-2xs tracking-mini"
        >
          <span
            aria-hidden="true"
            className="bg-foreground size-1.5 shrink-0 rounded-full"
          />
          kT
          <span className="text-muted-foreground">kernelTheme</span>
        </span>
      </div>

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${dims.w || 1} ${dims.h || 1}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {paths.map((p) => (
          <path
            key={p.code}
            d={p.d}
            fill="none"
            stroke={`oklch(0.65 0.16 ${p.hue})`}
            strokeOpacity={0.55}
            strokeWidth={1}
          />
        ))}
      </svg>

      <ul className="relative z-10 mt-14 flex flex-wrap justify-center gap-1.5">
        {BRANDS.map((b) => (
          <li
            key={b.code}
            ref={(el) => {
              if (el) brandRefs.current.set(b.code, el);
              else brandRefs.current.delete(b.code);
            }}
          >
            <span
              className="border-border/70 bg-background/40 text-foreground/85 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-2xs uppercase tracking-mini sm:gap-[7px] sm:px-[9.2px] sm:py-[4.6px] sm:text-[0.72rem]"
              title={b.name}
            >
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full sm:size-[7px]"
                style={{ backgroundColor: `oklch(0.65 0.16 ${b.hue})` }}
              />
              {b.code}
              <span className="text-muted-foreground/70 normal-case">
                {b.name}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
