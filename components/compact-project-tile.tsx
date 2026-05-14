import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

import type { ContentEntry } from "@/lib/content";

type CompactProjectTileProps = {
  entry: ContentEntry;
  Icon: LucideIcon;
  tint: string;
};

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export function CompactProjectTile({
  entry,
  Icon,
  tint,
}: CompactProjectTileProps) {
  const fm = entry.frontmatter;
  const cta = fm.cta ?? fm.description;
  const firstTag = fm.tags?.[0];

  return (
    <Link
      href={`/projects/${entry.slug}`}
      className="group relative flex items-start gap-3 rounded-xl border p-4 transition-colors duration-200"
      style={{
        borderColor: `hsl(${tint} / 0.35)`,
        backgroundColor: `hsl(${tint} / 0.08)`,
      }}
    >
      <Icon
        className="mt-0.5 size-5 shrink-0"
        style={{ color: `hsl(${tint})` }}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-foreground truncate text-sm font-semibold tracking-tight">
            {fm.title}
          </p>
          {fm.date && (
            <span className="text-muted-foreground/60 shrink-0 font-mono text-2xs tabular-nums">
              {dateFmt.format(new Date(fm.date))}
            </span>
          )}
        </div>
        <p className="text-muted-foreground mt-0.5 line-clamp-1 font-mono text-2xs uppercase tracking-mini">
          {cta}
        </p>
        {firstTag && (
          <span className="text-muted-foreground/65 mt-2 inline-flex font-mono text-2xs lowercase tracking-mini">
            #{firstTag.toLowerCase().replace(/\s+/g, "-")}
          </span>
        )}
      </div>
      <ArrowRight
        aria-hidden="true"
        className="text-muted-foreground/0 group-hover:text-muted-foreground absolute right-3 bottom-3 size-3 transition-colors"
      />
    </Link>
  );
}
