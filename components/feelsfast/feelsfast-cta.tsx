import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { GithubIcon } from "@/components/brand-icons";

type Repo = {
  name: string;
  sub: string;
  url: string;
};

type Props = {
  liveUrl: string;
  platformRepo: string;
  skillRepo: string;
};

export function FeelsfastCta({ liveUrl, platformRepo, skillRepo }: Props) {
  const liveLabel = liveUrl.replace(/^https?:\/\/(www\.)?/, "");
  const repos: Repo[] = [
    {
      name: "feelsfast",
      sub: "Platform",
      url: platformRepo,
    },
    {
      name: "feelsfast-skill",
      sub: "AI Skill",
      url: skillRepo,
    },
  ];

  return (
    <div className="mt-6 flex flex-col gap-3">
      <a
        href={liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group border-border bg-muted/40 hover:border-[oklch(0.65_0.14_40_/_0.5)] hover:bg-[oklch(0.7_0.16_40_/_0.06)] dark:hover:border-[oklch(0.75_0.14_40_/_0.5)] dark:hover:bg-[oklch(0.75_0.14_40_/_0.08)] flex items-center gap-4 rounded-xl border px-4 py-3 transition-colors duration-200"
      >
        <span
          aria-hidden="true"
          className="border-border/60 bg-secondary/60 grid size-10 shrink-0 place-items-center rounded-lg border"
        >
          <Image
            src="/feelsfast/favicon.svg"
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

      <div className="border-border bg-card/40 rounded-xl border p-3 sm:p-4">
        <p className="text-muted-foreground px-1 pb-3 font-mono text-xs tracking-wider uppercase">
          GitHub
        </p>
        <ul className="flex flex-col gap-1">
          {repos.map((repo) => (
            <li key={repo.url}>
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group hover:bg-muted/60 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors duration-200"
              >
                <span
                  aria-hidden="true"
                  className="bg-foreground text-background flex size-8 shrink-0 items-center justify-center rounded-md"
                >
                  <GithubIcon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-foreground/90 group-hover:text-foreground block text-sm leading-snug tracking-tight transition-colors">
                    {repo.name}
                  </span>
                  <span className="text-muted-foreground mt-0.5 block font-mono text-xs">
                    {repo.sub}
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
    </div>
  );
}
