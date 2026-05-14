import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { ContentEntry } from "@/lib/content";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});

export function ProjectIndexRow({ entry }: { entry: ContentEntry }) {
  const fm = entry.frontmatter;

  return (
    <Link
      href={`/projects/${entry.slug}`}
      className="group hover:bg-muted/30 flex flex-col gap-1.5 px-6 py-5 transition-colors duration-200"
    >
      <div className="flex items-baseline justify-between gap-3">
        <time
          dateTime={fm.date}
          className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini tabular-nums"
        >
          {dateFmt.format(new Date(fm.date))}
        </time>
        <ArrowRight
          aria-hidden="true"
          className="text-muted-foreground/35 group-hover:text-foreground size-3.5 shrink-0 transition-colors duration-200"
        />
      </div>
      <h4 className="text-foreground text-lg font-semibold tracking-tight">
        {fm.title}
      </h4>
      <p className="text-muted-foreground/80 line-clamp-2 max-w-[60ch] text-sm leading-relaxed">
        {fm.description}
      </p>
    </Link>
  );
}
