import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { MediumIcon } from "@/components/brand-icons";

type Article = {
  title: string;
  url: string;
  date: string;
};

type Props = {
  liveUrl: string;
  articles: Article[];
};

export function UicruxCta({ liveUrl, articles }: Props) {
  const liveLabel = liveUrl.replace(/^https?:\/\/(www\.)?/, "");

  return (
    <div className="mt-6 flex flex-col gap-3">
      <a
        href={liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group border-border bg-muted/40 hover:border-[oklch(0.65_0.16_75_/_0.5)] hover:bg-[oklch(0.7_0.18_75_/_0.06)] dark:hover:border-[oklch(0.78_0.15_75_/_0.5)] dark:hover:bg-[oklch(0.78_0.15_75_/_0.08)] flex items-center gap-4 rounded-xl border px-4 py-3 transition-colors duration-200"
      >
        <span
          aria-hidden="true"
          className="border-border/60 bg-secondary/60 grid size-10 shrink-0 place-items-center rounded-lg border"
        >
          <Image
            src="/uicrux-symbol.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden="true"
            className="size-6"
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="text-foreground block text-sm font-medium tracking-tight">
            Open the live platform
          </span>
          <span className="text-muted-foreground mt-0.5 block truncate font-mono text-xs">
            {liveLabel}
          </span>
        </span>
        <ArrowUpRight
          className="text-muted-foreground/70 group-hover:text-foreground size-4 shrink-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </a>

      {articles.length > 0 && (
        <div className="border-border bg-card/40 rounded-xl border p-3 sm:p-4">
          <p className="text-muted-foreground px-1 pb-3 font-mono text-xs tracking-wider uppercase">
            Medium
          </p>
          <ul className="flex flex-col gap-1">
            {articles.map((article) => (
              <li key={article.url}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group hover:bg-muted/60 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors duration-200"
                >
                  <span
                    aria-hidden="true"
                    className="bg-foreground text-background flex size-8 shrink-0 items-center justify-center rounded-md"
                  >
                    <MediumIcon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-foreground/90 group-hover:text-foreground block text-sm leading-snug tracking-tight transition-colors">
                      {article.title}
                    </span>
                    <span className="text-muted-foreground mt-0.5 block font-mono text-xs tabular-nums">
                      {article.date}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="text-muted-foreground/60 group-hover:text-foreground size-4 shrink-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
