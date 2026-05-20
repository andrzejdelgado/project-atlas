"use client";

// TokenMappingDemo — Primitive → Meta → Component chain for one brand at a
// time. A "lineage line" runs down the left edge in the brand's primitive
// colour, passing through three markers and terminating at the last one.
// The "renders as" panel below shows three different components that all
// consume the same Meta token (surface.action) and therefore all re-theme
// when the brand changes. Foreground colour on every brand-tinted surface
// is auto-picked from the brand's sRGB luminance (the same L > 128 rule the
// Surfaces and Hues demos use), so the text stays legible on every brand.

import * as React from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type BrandKey = "polestar" | "mercury" | "andromeda";

type Brand = {
  key: BrandKey;
  name: string;
  code: string;
  primitive: string;
  primitiveName: string;
};

const BRANDS: Brand[] = [
  {
    key: "polestar",
    name: "Polestar",
    code: "PSR",
    primitive: "oklch(0.58 0.17 240)",
    primitiveName: "color-blue-500",
  },
  {
    key: "mercury",
    name: "Mercury",
    code: "MER",
    primitive: "oklch(0.62 0.16 155)",
    primitiveName: "color-emerald-500",
  },
  {
    key: "andromeda",
    name: "Andromeda",
    code: "AND",
    primitive: "oklch(0.55 0.18 320)",
    primitiveName: "color-purple-500",
  },
];

// Same foreground crossover used by the Surfaces and Hues demos: black text
// above L=128, white text below. Computed on the actual rendered primitive
// (canvas readback) rather than guessed from OKLCH lightness.
const T_INK_FLIP = 128;
const INK = "#18181b";
const PAPER = "#fafafa";

// Marker column layout — kept in sync with the row padding so all three
// markers share the same X centre and the lineage line is a single column.
const MARKER_BOX = 28; // size-7
const MARKER_LEFT = 16; // px-4
const MARKER_TOP = 16; // py-4
const MARKER_CENTER_X = MARKER_LEFT + MARKER_BOX / 2;
const MARKER_CENTER_Y = MARKER_TOP + MARKER_BOX / 2;

function resolvePrimitive(oklch: string): { L: number; hex: string } {
  if (typeof document === "undefined") return { L: 128, hex: "#000000" };
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { L: 128, hex: "#000000" };
  ctx.fillStyle = "#000";
  ctx.fillStyle = oklch;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const hex =
    "#" +
    [r, g, b]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
  return { L, hex };
}

export function TokenMappingDemo() {
  const [brandKey, setBrandKey] = React.useState<BrandKey>("polestar");
  const [activeTab, setActiveTab] = React.useState<string>("reports");
  const brand = BRANDS.find((b) => b.key === brandKey) ?? BRANDS[0];

  // Pre-resolve each brand's L once on mount so the foreground decision is
  // consistent across all "renders as" components.
  const [resolved, setResolved] = React.useState<
    Partial<Record<BrandKey, { L: number; hex: string }>>
  >({});
  React.useEffect(() => {
    const next: Partial<Record<BrandKey, { L: number; hex: string }>> = {};
    for (const b of BRANDS) {
      next[b.key] = resolvePrimitive(b.primitive);
    }
    setResolved(next);
  }, []);

  const brandInfo = resolved[brand.key] ?? { L: 128, hex: "#000000" };
  const onLightSide = brandInfo.L > T_INK_FLIP;
  const fgOnBrand = onLightSide ? INK : PAPER;

  // Lineage line measurement — terminates exactly on the third marker.
  const cardRef = React.useRef<HTMLDivElement>(null);
  const lastMarkerRef = React.useRef<HTMLSpanElement>(null);
  const [lineHeight, setLineHeight] = React.useState<number>(0);

  React.useLayoutEffect(() => {
    function measure() {
      if (!cardRef.current || !lastMarkerRef.current) return;
      const cardRect = cardRef.current.getBoundingClientRect();
      const lastRect = lastMarkerRef.current.getBoundingClientRect();
      const center = lastRect.top + lastRect.height / 2 - cardRect.top;
      setLineHeight(Math.max(0, center - MARKER_CENTER_Y));
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (cardRef.current) ro.observe(cardRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div className="space-y-5">
      <div
        role="tablist"
        aria-label="Brand theme"
        className="border-border/60 bg-background/40 inline-flex shrink-0 rounded-md border p-0.5"
      >
        {BRANDS.map((b) => {
          const active = b.key === brandKey;
          return (
            <button
              key={b.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setBrandKey(b.key)}
              aria-label={b.name}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 font-mono text-2xs uppercase tracking-mini transition-colors",
                active
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: b.primitive }}
              />
              {b.code}
            </button>
          );
        })}
      </div>

      <div
        ref={cardRef}
        className="border-border/60 bg-background/40 relative overflow-hidden rounded-xl border"
      >
        <span
          aria-hidden="true"
          className="absolute w-px transition-[background-color] duration-300"
          style={{
            top: `${MARKER_CENTER_Y}px`,
            left: `${MARKER_CENTER_X}px`,
            height: `${lineHeight}px`,
            backgroundColor: brand.primitive,
            opacity: 0.45,
            transform: "translateX(-0.5px)",
          }}
        />

        <TierRow
          tier="Primitive"
          token={brand.primitiveName}
          detail={brand.primitive}
          color={brand.primitive}
          variant="swatch"
        />
        <Divider />
        <TierRow
          tier="Meta"
          token="surface-action"
          detail={brand.primitiveName}
          arrow
          color={brand.primitive}
          variant="dot"
        />
        <Divider />
        <div className="relative px-4 py-4 pl-[60px]">
          <span
            ref={lastMarkerRef}
            aria-hidden="true"
            className="absolute flex size-7 items-center justify-center"
            style={{ left: `${MARKER_LEFT}px`, top: `${MARKER_TOP}px` }}
          >
            <span className="bg-card flex size-3.5 items-center justify-center rounded-full">
              <span
                className="size-2.5 rounded-full transition-colors duration-300"
                style={{ backgroundColor: brand.primitive }}
              />
            </span>
          </span>

          <div className="min-w-0">
            <p className="text-muted-foreground font-mono text-2xs uppercase tracking-mini">
              Component
            </p>
            <ul className="mt-1.5 space-y-1.5">
              {[
                "button-primary-bg",
                "link-primary-text",
                "tab-active-bg",
              ].map((token, i, arr) => {
                const isLast = i === arr.length - 1;
                return (
                  <li key={token}>
                    <p className="text-foreground truncate font-mono text-sm tracking-mini">
                      {token}
                    </p>
                    {isLast ? (
                      <p className="text-muted-foreground/70 mt-0.5 inline-flex items-center gap-1 truncate font-mono text-2xs tracking-mini">
                        <ArrowRight
                          aria-hidden="true"
                          className="size-3 shrink-0 -translate-y-px"
                        />
                        <span className="truncate">surface-action</span>
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* All three components below consume the same Meta token. Re-route
          surface-action and the button, the link AND the active tab all
          re-skin in lockstep. Hover/active states are derived from
          --accent-current with OKLCH relative-color syntax so every brand
          gets a perceptually-consistent darken on interaction. */}
      <div
        className="border-border/60 bg-background/40 space-y-4 rounded-xl border px-4 py-4"
        style={{ "--accent-current": brand.primitive } as React.CSSProperties}
      >
        <div>
          <p className="text-foreground/85 font-mono text-2xs uppercase tracking-mini">
            Renders as
          </p>
          <p className="text-muted-foreground/70 mt-0.5 font-mono text-2xs uppercase tracking-mini">
            Every component below consumes surface-action
          </p>
        </div>

        <RenderRow label="Button">
          <button
            type="button"
            className={cn(
              "rounded-md px-3.5 py-2 text-sm font-medium tracking-tight",
              "bg-[var(--accent-current)]",
              "transition-[background-color,transform] duration-200 will-change-transform",
              "hover:bg-[oklch(from_var(--accent-current)_calc(l_-_0.05)_c_h)]",
              "active:bg-[oklch(from_var(--accent-current)_calc(l_-_0.1)_c_h)] active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-current)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "motion-reduce:transition-none motion-reduce:active:scale-100",
            )}
            style={{ color: fgOnBrand }}
          >
            Primary action
          </button>
        </RenderRow>

        <RenderRow label="Link">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className={cn(
              "inline-flex items-center gap-1 rounded-sm text-sm font-medium tracking-tight",
              "text-[var(--accent-current)]",
              "transition-colors duration-200",
              "hover:text-[oklch(from_var(--accent-current)_calc(l_+_0.08)_c_h)] hover:underline",
              "active:text-[oklch(from_var(--accent-current)_calc(l_+_0.15)_c_h)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-current)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "motion-reduce:transition-none",
            )}
          >
            Learn more
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </a>
        </RenderRow>

        <RenderRow label="Tabs">
          <div
            role="tablist"
            aria-label="Tabs preview"
            className="border-border/40 bg-background/50 inline-flex shrink-0 rounded-md border p-0.5"
          >
            {[
              { id: "overview", label: "Overview" },
              { id: "reports", label: "Reports" },
              { id: "insights", label: "Insights" },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "rounded-sm px-2.5 py-1 text-xs font-medium",
                    "transition-[background-color,color,transform] duration-200 will-change-transform",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-current)] focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                    "motion-reduce:transition-none motion-reduce:active:scale-100",
                    active
                      ? "bg-[var(--accent-current)] hover:bg-[oklch(from_var(--accent-current)_calc(l_-_0.05)_c_h)] active:bg-[oklch(from_var(--accent-current)_calc(l_-_0.1)_c_h)] active:scale-[0.98]"
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground active:scale-[0.98]",
                  )}
                  style={active ? { color: fgOnBrand } : undefined}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </RenderRow>
      </div>
    </div>
  );
}

function RenderRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground/70 shrink-0 font-mono text-2xs uppercase tracking-mini">
        {label}
      </span>
      <div className="min-w-0 shrink-0">{children}</div>
    </div>
  );
}

type TierRowProps = {
  tier: string;
  token: string;
  detail: string;
  /** When true, the detail is prefixed with an ArrowRight icon (pointer to
   *  the token this row resolves to). */
  arrow?: boolean;
  color: string;
  variant: "swatch" | "dot";
  markerRef?: React.Ref<HTMLSpanElement>;
};

function TierRow({
  tier,
  token,
  detail,
  arrow = false,
  color,
  variant,
  markerRef,
}: TierRowProps) {
  return (
    <div className="relative px-4 py-4 pl-[60px]">
      <span
        ref={markerRef}
        aria-hidden="true"
        className="absolute flex size-7 items-center justify-center"
        style={{ left: `${MARKER_LEFT}px`, top: `${MARKER_TOP}px` }}
      >
        {variant === "swatch" ? (
          <span
            className="border-border/40 size-7 rounded-md border transition-colors duration-300"
            style={{ backgroundColor: color }}
          />
        ) : (
          <span className="bg-card flex size-3.5 items-center justify-center rounded-full">
            <span
              className="size-2.5 rounded-full transition-colors duration-300"
              style={{ backgroundColor: color }}
            />
          </span>
        )}
      </span>

      <div className="min-w-0">
        <p className="text-muted-foreground font-mono text-2xs uppercase tracking-mini">
          {tier}
        </p>
        <p className="text-foreground mt-1.5 truncate font-mono text-sm tracking-mini">
          {token}
        </p>
        <p className="text-muted-foreground/70 mt-0.5 inline-flex items-center gap-1 truncate font-mono text-2xs tracking-mini">
          {arrow ? (
            <ArrowRight
              aria-hidden="true"
              className="size-3 shrink-0 -translate-y-px"
            />
          ) : null}
          <span className="truncate">{detail}</span>
        </p>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div aria-hidden="true" className="border-border/40 ml-[60px] border-t" />
  );
}
