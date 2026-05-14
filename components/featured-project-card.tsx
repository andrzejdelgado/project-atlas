import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

import type { ContentEntry } from "@/lib/content";
import { cn } from "@/lib/utils";

type FeaturedProjectCardProps = {
  entry: ContentEntry;
  Icon: LucideIcon;
  tint: string;
};

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});

function ColorRampPreview({ tint }: { tint: string }) {
  // Use the project's tint hue for the ramp; vary lightness across 8 stops.
  // Hue is the first number in the HSL string passed in (e.g. "290 75% 65%").
  const hue = tint.split(" ")[0] ?? "290";
  const stops = Array.from({ length: 8 }, (_, i) => {
    const t = i / 7;
    const l = 92 - t * 70;
    return `hsl(${hue} 70% ${l.toFixed(1)}%)`;
  });
  return (
    <div className="flex items-stretch gap-1.5">
      {stops.map((c, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="border-border/40 h-12 flex-1 rounded-md border sm:h-14"
          style={{ background: c }}
        />
      ))}
    </div>
  );
}

function CodePreview({ content }: { content: string }) {
  return (
    <pre className="bg-secondary/50 border-border/55 text-muted-foreground overflow-x-auto rounded-md border p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap">
      {content}
    </pre>
  );
}

function QuotePreview({ content }: { content: string }) {
  return (
    <blockquote className="border-border/55 text-foreground/85 border-l-2 px-4 py-1 text-base font-medium italic leading-relaxed">
      {content}
    </blockquote>
  );
}

export function FeaturedProjectCard({
  entry,
  Icon,
  tint,
}: FeaturedProjectCardProps) {
  const fm = entry.frontmatter;
  const eyebrowTag = fm.tags?.[0] ?? "Project";
  const stats = fm.stats ?? [];
  const tagPills = fm.tags?.slice(0, 4) ?? [];

  let preview: React.ReactNode = null;
  if (fm.previewKind === "color-ramp") {
    preview = <ColorRampPreview tint={tint} />;
  } else if (fm.previewKind === "code" && fm.previewContent) {
    preview = <CodePreview content={fm.previewContent} />;
  } else if (fm.previewKind === "quote" && fm.previewContent) {
    preview = <QuotePreview content={fm.previewContent} />;
  }

  return (
    <Link
      href={`/projects/${entry.slug}`}
      className={cn(
        "group relative flex flex-col gap-5 overflow-hidden rounded-2xl border p-5 transition-colors duration-200 sm:p-6",
      )}
      style={{
        borderColor: `hsl(${tint} / 0.4)`,
        backgroundColor: `hsl(${tint} / 0.07)`,
      }}
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-xl"
          style={{ backgroundColor: `hsl(${tint} / 0.18)` }}
        >
          <Icon className="size-5" style={{ color: `hsl(${tint})` }} />
        </span>
        <div className="min-w-0 flex-1">
          <span
            className="font-mono text-2xs uppercase tracking-mini"
            style={{ color: `hsl(${tint})` }}
          >
            ✻ Featured · {eyebrowTag}
          </span>
          <h4 className="text-foreground mt-1 text-lg font-semibold tracking-tight sm:text-xl">
            {fm.title}
          </h4>
          {fm.cta && (
            <p className="text-muted-foreground mt-1 font-mono text-2xs uppercase tracking-mini">
              {fm.cta}
            </p>
          )}
        </div>
      </div>

      {preview && <div className="-mx-1">{preview}</div>}

      <p className="text-muted-foreground max-w-[60ch] text-sm leading-relaxed">
        {fm.description}
      </p>

      {tagPills.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {tagPills.map((t) => (
            <span
              key={t}
              className="border-border/55 text-muted-foreground rounded-full border px-2 py-0.5 font-mono text-2xs lowercase tracking-mini"
            >
              #{t.toLowerCase().replace(/\s+/g, "-")}
            </span>
          ))}
        </div>
      )}

      {(stats.length > 0 || fm.date) && (
        <div className="border-border/40 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {stats.map((s, i) => (
              <span
                key={i}
                className="text-muted-foreground font-mono text-2xs uppercase tracking-mini"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {fm.date && (
              <span className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini">
                {dateFmt.format(new Date(fm.date))}
              </span>
            )}
            <span
              className="inline-flex items-center gap-1 font-mono text-2xs uppercase tracking-mini transition-transform duration-200 group-hover:translate-x-0.5"
              style={{ color: `hsl(${tint})` }}
            >
              Open
              <ArrowRight className="size-3" aria-hidden="true" />
            </span>
          </div>
        </div>
      )}
    </Link>
  );
}
