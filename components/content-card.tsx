import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import type { ContentEntry } from "@/lib/content";

type Props = {
  entry: ContentEntry;
  href: string;
  className?: string;
  showCover?: boolean;
};

const fmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function ContentCard({
  entry,
  href,
  className,
  showCover = true,
}: Props) {
  const { title, description, date, cover, tags } = entry.frontmatter;
  return (
    <Link
      href={href}
      className={cn(
        "group bg-card text-card-foreground hover:border-foreground/20 border-border relative flex flex-col overflow-hidden rounded-2xl border p-3 transition-[border-color,transform] duration-200 will-change-transform active:scale-[0.985] sm:p-6",
        className,
      )}
    >
      {showCover && cover ? (
        <div className="border-border/60 relative mb-4 aspect-[16/9] overflow-hidden rounded-md border">
          <Image
            src={cover}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col">
        <div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs tabular-nums">
          <time dateTime={date}>{fmt.format(new Date(date))}</time>
          {tags?.length ? (
            <>
              <span aria-hidden>·</span>
              <span>{tags.slice(0, 2).join(" · ")}</span>
            </>
          ) : null}
        </div>
        <h3 className="text-base font-semibold tracking-tight sm:text-lg">
          {title}
        </h3>
        <p className="text-muted-foreground mt-1 line-clamp-3 text-sm">
          {description}
        </p>
      </div>
    </Link>
  );
}
