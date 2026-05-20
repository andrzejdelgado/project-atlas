"use client";

import * as React from "react";
import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

type Mode = "light" | "dark";
type Brand = "MER" | "PSR" | "GEM";

type Pair = { light: string; dark: string };

type BrandPalette = {
  page: Pair;
  card: Pair;
  bg: Pair;
  fg: Pair;
  accent: Pair;
};

const BRANDS: Record<Brand, BrandPalette> = {
  MER: {
    page: { light: "#f0eee6", dark: "oklch(0.277 0 0)" },
    card: { light: "#f7f5ec", dark: "oklch(0.339 0 0)" },
    bg: { light: "oklch(0.92 0.012 80)", dark: "oklch(0.45 0 0)" },
    fg: { light: "oklch(0.21 0.034 264)", dark: "#fafafa" },
    accent: { light: "oklch(0.58 0.14 155)", dark: "oklch(0.83 0.18 160)" },
  },
  PSR: {
    page: { light: "#eef1f6", dark: "oklch(0.27 0.018 260)" },
    card: { light: "#f5f7fb", dark: "oklch(0.33 0.018 260)" },
    bg: { light: "oklch(0.91 0.022 260)", dark: "oklch(0.43 0.018 260)" },
    fg: { light: "oklch(0.22 0.04 260)", dark: "#f6f8ff" },
    accent: { light: "oklch(0.55 0.18 250)", dark: "oklch(0.78 0.16 250)" },
  },
  GEM: {
    page: { light: "#f1ece2", dark: "oklch(0.28 0.018 60)" },
    card: { light: "#f8f3e8", dark: "oklch(0.34 0.018 60)" },
    bg: { light: "oklch(0.92 0.024 70)", dark: "oklch(0.45 0.022 60)" },
    fg: { light: "oklch(0.23 0.05 50)", dark: "#fdf6ec" },
    accent: { light: "oklch(0.65 0.16 70)", dark: "oklch(0.82 0.16 75)" },
  },
};

type AnnotationKey = "page" | "card" | "bg" | "fg" | "em" | "plate";

export function SurfacesDemo() {
  const { resolvedTheme } = useTheme();
  const [mode, setMode] = React.useState<Mode>("dark");
  const [brand, setBrand] = React.useState<Brand>("MER");
  const userOverrodeRef = React.useRef(false);

  React.useEffect(() => {
    if (userOverrodeRef.current) return;
    if (resolvedTheme === "light" || resolvedTheme === "dark") {
      setMode(resolvedTheme);
    }
  }, [resolvedTheme]);

  const pickMode = (m: Mode) => {
    userOverrodeRef.current = true;
    setMode(m);
  };

  const palette = BRANDS[brand];
  const page = mode === "light" ? palette.page.light : palette.page.dark;
  const card = mode === "light" ? palette.card.light : palette.card.dark;
  const bg = mode === "light" ? palette.bg.light : palette.bg.dark;
  const fg = mode === "light" ? palette.fg.light : palette.fg.dark;
  const accent = mode === "light" ? palette.accent.light : palette.accent.dark;

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const pageLabelRef = React.useRef<HTMLSpanElement>(null);
  const cardLabelRef = React.useRef<HTMLSpanElement>(null);
  const bgLabelRef = React.useRef<HTMLSpanElement>(null);
  const fgTextRef = React.useRef<HTMLHeadingElement>(null);
  const emeraldBtnRef = React.useRef<HTMLButtonElement>(null);
  const plateRef = React.useRef<HTMLSpanElement>(null);
  const boxRefs = React.useRef<Partial<Record<AnnotationKey, HTMLDivElement | null>>>(
    {},
  );

  type Anno = {
    key: AnnotationKey;
    label: string;
    /** Token role displayed above the hex value inside each annotation box. */
    kind: "Surface" | "Background";
    value: string;
    targetRef: React.RefObject<HTMLElement | null>;
    anchorX: number;
    anchorY: number;
    /** Pixel offset added to the box vertical position. Use to separate boxes
     *  whose targets share the same Y (button vs. plate). */
    boxYOffset?: number;
    /** Side from which the path enters the target. "right" = horizontal
     *  tangent (control point to the right). "bottom" = vertical tangent
     *  (control point below the target, so the line approaches from below). */
    targetSide?: "right" | "bottom";
    /** Below-sm overrides — applied when viewport width < 640px. */
    mobile?: {
      anchorX: number;
      anchorY: number;
      targetSide?: "right" | "bottom";
    };
  };

  const annotations: Anno[] = [
    {
      key: "page",
      label: "surface.page",
      kind: "Surface",
      value: page,
      targetRef: pageLabelRef as React.RefObject<HTMLElement | null>,
      anchorX: 1,
      anchorY: 0.5,
    },
    {
      key: "card",
      label: "surface.card",
      kind: "Surface",
      value: card,
      targetRef: cardLabelRef as React.RefObject<HTMLElement | null>,
      anchorX: 1,
      anchorY: 0.5,
    },
    {
      key: "bg",
      label: "bg.component",
      kind: "Surface",
      value: bg,
      targetRef: bgLabelRef as React.RefObject<HTMLElement | null>,
      anchorX: 1,
      anchorY: 0.5,
    },
    {
      key: "em",
      label: "accent",
      kind: "Background",
      value: accent,
      targetRef: emeraldBtnRef as React.RefObject<HTMLElement | null>,
      anchorX: 1,
      anchorY: 0.5,
      mobile: {
        anchorX: 0.5,
        anchorY: 1,
        targetSide: "bottom",
      },
    },
  ];

  type LinePath = { key: AnnotationKey; d: string };

  const [paths, setPaths] = React.useState<LinePath[]>([]);
  const [hexValues, setHexValues] = React.useState<
    Partial<Record<AnnotationKey, string>>
  >({});

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    // Rasterise each color into a 1×1 canvas and read the pixel — this is
    // the only reliable way to force oklch/relative-color syntax into sRGB
    // values, since both getComputedStyle and ctx.fillStyle now preserve the
    // source color space as a string.
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const probe = document.createElement("div");
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    document.body.appendChild(probe);
    const next: Partial<Record<AnnotationKey, string>> = {};
    for (const a of annotations) {
      probe.style.color = "";
      probe.style.color = a.value;
      const resolvedCss = getComputedStyle(probe).color;
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.fillStyle = resolvedCss;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, alpha255] = ctx.getImageData(0, 0, 1, 1).data;
      let hex =
        "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
      if (alpha255 < 255) {
        hex += alpha255.toString(16).padStart(2, "0");
      }
      next[a.key] = hex.toUpperCase();
    }
    document.body.removeChild(probe);
    setHexValues(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, brand]);

  React.useEffect(() => {
    function measure() {
      const wrap = wrapperRef.current;
      if (!wrap) return;
      const wR = wrap.getBoundingClientRect();
      const isMobile = window.innerWidth < 640;
      const nextPaths: LinePath[] = [];
      for (const a of annotations) {
        const target = a.targetRef.current;
        const box = boxRefs.current[a.key];
        if (!target || !box) continue;
        // Apply mobile overrides for anchor + targetSide when the viewport is
        // below the sm breakpoint.
        const anchorX = isMobile && a.mobile ? a.mobile.anchorX : a.anchorX;
        const anchorY = isMobile && a.mobile ? a.mobile.anchorY : a.anchorY;
        const targetSide =
          isMobile && a.mobile ? a.mobile.targetSide : a.targetSide;
        const tR = target.getBoundingClientRect();
        const bR = box.getBoundingClientRect();
        const x2 = tR.left + anchorX * tR.width - wR.left;
        const y2 = tR.top + anchorY * tR.height - wR.top;
        const x1 = bR.left - wR.left;
        const y1 = bR.top + bR.height / 2 - wR.top;
        // Control points extend perpendicular to each endpoint's edge so the
        // tangent enters cleanly (no random Y wobble), matching the HLA demo.
        // The box always exits to the left; the target side is configurable
        // via `targetSide` ("right" = horizontal tangent, "bottom" = vertical
        // tangent so the line approaches the target from below).
        const dx = x1 - x2;
        const dy = y1 - y2;
        const magBox = Math.max(36, Math.min(110, Math.abs(dx) * 0.5));
        const c1x = x1 - magBox;
        const c1y = y1;
        let c2x: number;
        let c2y: number;
        if (targetSide === "bottom") {
          const magTarget = Math.max(36, Math.min(110, Math.abs(dy) * 0.6));
          c2x = x2;
          c2y = y2 + magTarget;
        } else {
          c2x = x2 + magBox;
          c2y = y2;
        }
        nextPaths.push({
          key: a.key,
          d: `M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`,
        });
      }
      setPaths(nextPaths);
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    window.addEventListener("resize", measure);
    const raf = requestAnimationFrame(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, brand]);

  return (
    <div
      ref={wrapperRef}
      className="relative space-y-6 pb-14 sm:pb-0"
      style={{ ["--demo-fg" as string]: fg } as React.CSSProperties}
    >
      <div className="relative z-20 flex items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Mode"
          className="border-border/60 bg-background/40 inline-flex shrink-0 rounded-md border p-0.5"
        >
          {(["light", "dark"] as Mode[]).map((m) => {
            const Icon = m === "light" ? Sun : Moon;
            const active = m === mode;
            return (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={m}
                onClick={() => pickMode(m)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 font-mono text-2xs uppercase tracking-mini transition-colors",
                  active
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-3" aria-hidden="true" />
                <span className="hidden sm:inline">{m}</span>
              </button>
            );
          })}
        </div>

        <div
          role="tablist"
          aria-label="Brand"
          className="border-border/60 bg-background/40 inline-flex shrink-0 rounded-md border p-0.5"
        >
          {(
            [
              { code: "MER", hue: 155 },
              { code: "PSR", hue: 240 },
              { code: "GEM", hue: 290 },
            ] as { code: Brand; hue: number }[]
          ).map((b) => {
            const active = b.code === brand;
            return (
              <button
                key={b.code}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setBrand(b.code)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 font-mono text-2xs uppercase tracking-mini transition-colors",
                  active
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  aria-hidden="true"
                  className="inline-block size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: `oklch(0.65 0.16 ${b.hue})` }}
                />
                {b.code}
              </button>
            );
          })}
        </div>
      </div>

      <div
        aria-label="Surface stack"
        className="border-border/70 relative z-10 overflow-hidden rounded-xl border transition-colors duration-300"
        style={{ backgroundColor: page, color: fg }}
      >
        <p
          className="px-3 pt-3 font-mono text-2xs uppercase tracking-mini sm:px-6 sm:pt-5"
          style={{ color: fg, opacity: 0.6 }}
        >
          <span ref={pageLabelRef} className="inline-flex pr-2">
            Page
          </span>
        </p>

        <div
          className="m-3 rounded-xl p-3 transition-colors duration-300 sm:m-6 sm:p-6"
          style={{ backgroundColor: card }}
        >
          <p
            className="font-mono text-2xs uppercase tracking-mini"
            style={{ color: fg, opacity: 0.6 }}
          >
            <span ref={cardLabelRef} className="inline-flex pr-2">
              Sidebar
            </span>
          </p>

          <div
            className="mt-3 rounded-lg px-3 py-3 transition-colors duration-300 sm:mt-5 sm:px-4 sm:py-4"
            style={{ backgroundColor: bg }}
          >
            <p
              className="font-mono text-2xs uppercase tracking-mini"
              style={{ color: fg, opacity: 0.6 }}
            >
              <span ref={bgLabelRef} className="inline-flex pr-2">
                Card
              </span>
            </p>

            <h4
              ref={fgTextRef}
              className="mt-3 inline-block text-base font-semibold"
              style={{ color: fg }}
            >
              Saturn Heavy in production
            </h4>
            <p
              className="mt-1 text-sm leading-relaxed"
              style={{ color: fg, opacity: 0.75 }}
            >
              12 brand themes shipped from a single token spine — zero one-off overrides.
            </p>

            <button
              ref={emeraldBtnRef}
              type="button"
              className={cn(
                "mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-md bg-[var(--accent-current)] py-1.5 pr-3.5 pl-1.5 transition-[background-color,transform,box-shadow] duration-150 ease-out hover:bg-[oklch(from_var(--accent-current)_calc(l_-_0.05)_c_h)] active:bg-[oklch(from_var(--accent-current)_calc(l_-_0.1)_c_h)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[oklch(from_var(--accent-current)_l_c_h_/_0.6)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] focus-visible:outline-none motion-reduce:transition-none motion-reduce:active:scale-100 sm:w-auto sm:justify-start",
                mode === "light" ? "text-white" : "text-black",
              )}
              style={{ ["--accent-current" as string]: accent } as React.CSSProperties}
            >
              <span
                ref={plateRef}
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-sm",
                  mode === "light" ? "bg-white/15" : "bg-black/15",
                )}
              >
                <Image
                  src="/case-studies/saturn-heavy.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden="true"
                />
              </span>
              <span className="text-sm">
                <span className="sm:hidden">Saturn</span>
                <span className="hidden sm:inline">Launch Saturn Heavy</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* SVG layer with bezier arrows. Sits above the surface stack (z-15)
          but below the floating boxes (z-20). */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[15] size-full"
      >
        <defs>
          <marker
            id="surfaces-demo-arrow"
            viewBox="0 0 10 10"
            refX="8.5"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path
              d="M 0 1 L 9 5 L 0 9 z"
              fill="var(--demo-fg)"
              fillOpacity={0.75}
            />
          </marker>
        </defs>
        {paths.map((p) => (
          <path
            key={p.key}
            d={p.d}
            fill="none"
            stroke="var(--demo-fg)"
            strokeOpacity={0.7}
            strokeWidth={1.25}
            strokeLinecap="round"
            markerEnd="url(#surfaces-demo-arrow)"
          />
        ))}
      </svg>

      {/* Top annotation stack — sits below the toggle row so it doesn't
          collide with the LIGHT/DARK and brand switches. Inset 8px from the
          right edge so the boxes don't touch the surrounding card. */}
      <div className="pointer-events-none absolute top-[68px] right-4 z-20 flex flex-col gap-2">
        {annotations.slice(0, 3).map((a) => (
          <div
            key={a.key}
            ref={(el) => {
              boxRefs.current[a.key] = el;
            }}
            className="border-border/70 bg-card pointer-events-auto flex w-[106px] items-center gap-2 rounded-md border px-2.5 py-1.5 shadow-md"
          >
            <span
              aria-hidden="true"
              className="border-border/40 size-3.5 shrink-0 rounded-[3px] border"
              style={{ backgroundColor: a.value }}
            />
            <div className="min-w-0 leading-none">
              <div className="text-muted-foreground/80 font-mono text-[10px] uppercase tracking-mini">
                {a.kind}
              </div>
              <div className="text-foreground/90 mt-0.5 truncate font-mono text-2xs">
                {hexValues[a.key] ?? a.value.toUpperCase()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom annotation stack — anchored to the bottom of the demo, inset
          8px from both the right and the bottom edges. */}
      <div className="pointer-events-none absolute right-4 bottom-4 z-20 flex flex-col gap-2">
        {annotations.slice(3).map((a) => (
          <div
            key={a.key}
            ref={(el) => {
              boxRefs.current[a.key] = el;
            }}
            className="border-border/70 bg-card pointer-events-auto flex w-[106px] items-center gap-2 rounded-md border px-2.5 py-1.5 shadow-md"
          >
            <span
              aria-hidden="true"
              className="border-border/40 size-3.5 shrink-0 rounded-[3px] border"
              style={{ backgroundColor: a.value }}
            />
            <div className="min-w-0 leading-none">
              <div className="text-muted-foreground/80 font-mono text-[10px] uppercase tracking-mini">
                {a.kind}
              </div>
              <div className="text-foreground/90 mt-0.5 truncate font-mono text-2xs">
                {hexValues[a.key] ?? a.value.toUpperCase()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
