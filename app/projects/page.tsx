import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageActions } from "@/components/page-actions";
import { getAllProjects } from "@/lib/content";
import { PROJECT_BRAND_ASSETS } from "@/lib/project-brand-assets";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I'm building, shipping, or quietly tinkering with.",
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
};

const fmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export default function ProjectsPage() {
  const projects = getAllProjects();
  return (
    <div className="mx-auto w-full max-w-[840px] py-4 sm:py-6 lg:py-8">
      <PageActions backHref="/" />
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Projects
        </h1>
        <p className="text-muted-foreground mt-2">
          Things I&apos;m building, shipping, or quietly tinkering with.
        </p>
      </header>
      <ul className="flex list-none flex-col p-0">
        {projects.map((entry, i) => (
          <li
            key={entry.slug}
            className="animate-in fade-in slide-in-from-bottom-2"
            style={{
              animationDuration: "300ms",
              animationDelay: `${i * 60}ms`,
              animationFillMode: "both",
            }}
          >
            <Link
              href={`/projects/${entry.slug}`}
              className="group hover:border-border hover:bg-card -mx-3 flex flex-col gap-3 rounded-2xl border border-transparent px-3 py-4 transition-[border-color,background-color] duration-200 sm:-mx-4 sm:flex-row sm:items-center sm:gap-6 sm:px-4"
            >
              <span
                aria-hidden
                className="text-muted-foreground/55 font-mono text-2xs uppercase tracking-mini tabular-nums sm:w-8 sm:shrink-0"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {(() => {
                const brand = PROJECT_BRAND_ASSETS[entry.slug];
                return brand ? (
                  <span
                    aria-hidden
                    className="border-border/60 bg-secondary/60 relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border"
                  >
                    <Image
                      src={brand.src}
                      alt=""
                      width={32}
                      height={32}
                      aria-hidden="true"
                      className={brand.className}
                    />
                  </span>
                ) : null;
              })()}
              <time
                dateTime={entry.frontmatter.date}
                className="text-muted-foreground text-xs tabular-nums sm:w-28 sm:shrink-0"
              >
                {fmt.format(new Date(entry.frontmatter.date))}
              </time>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-medium tracking-tight sm:text-lg">
                  {entry.frontmatter.title}
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  {entry.frontmatter.description}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
