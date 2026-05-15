import type { Metadata } from "next";
import { ArrowUpRight, BookOpen, Headphones, ScrollText } from "lucide-react";

import { MdxContent } from "@/components/mdx-content";
import { PageActions } from "@/components/page-actions";
import { ListeningTile } from "@/components/listening-tile";
import { Tile, TileHeader } from "@/components/tile";
import { getAbout } from "@/lib/content";
import { principles, reading } from "@/lib/dashboard";

const about = getAbout();

export const metadata: Metadata = {
  title: about?.frontmatter.title ?? "About",
  description: about?.frontmatter.description,
};

export default function AboutPage() {
  return (
    <div className="w-full py-4 sm:py-6 lg:py-8">
      <PageActions backHref="/" />
      <div className="mx-auto max-w-[60ch]">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {about?.frontmatter.title ?? "About"}
          </h1>
        </header>
        <div className="prose-text">
          <MdxContent kind="about" />
        </div>
      </div>

      {/* Guiding principles */}
      <section className="mt-16 sm:mt-20">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">
            Guiding principles
          </h2>
          <span className="border-border text-muted-foreground inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-2xs font-semibold uppercase tracking-mini">
            {principles.length}
          </span>
        </div>
        <Tile padded={false} className="mt-4">
          <div
            className="scrollbar-thin max-h-[22rem] min-h-0 flex-1 overflow-y-auto py-5 sm:py-6"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0, black 7%, black 93%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0, black 7%, black 93%, transparent 100%)",
            }}
          >
            <ol className="space-y-4">
              {Object.entries(
                principles.reduce<
                  Record<string, { text: string; index: number }[]>
                >((acc, p, i) => {
                  (acc[p.group] ??= []).push({ text: p.text, index: i });
                  return acc;
                }, {}),
              ).map(([groupName, items]) => (
                <li key={groupName}>
                  <p className="text-muted-foreground/70 px-4 pb-1 font-mono text-2xs font-semibold uppercase tracking-mini sm:px-5">
                    {groupName}
                  </p>
                  <ul className="space-y-0.5">
                    {items.map(({ text, index }) => (
                      <li
                        key={text}
                        className="hover:bg-foreground/5 flex items-baseline gap-3 px-4 py-1.5 transition-colors duration-200 sm:px-5"
                      >
                        <span className="text-muted-foreground/45 w-6 shrink-0 text-[10px] font-medium tracking-wider tabular-nums">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-foreground/90 text-[13px] leading-snug first-letter:uppercase">
                          {text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </Tile>
      </section>

      {/* Inputs — Listening + Reading */}
      <section className="mt-16 sm:mt-20">
        <h2 className="text-2xl font-semibold tracking-tight">Inputs</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
          {/* Listening */}
          <Tile>
            <TileHeader icon={Headphones} title="Listening to" />
            <ListeningTile />
          </Tile>

          {/* Reading */}
          <Tile>
            <TileHeader icon={BookOpen} title="Reading" />
            <ul className="divide-border/70 -mx-5 flex-1 divide-y sm:-mx-6">
              {reading.map((book) => (
                <li
                  key={book.title}
                  className="flex items-baseline justify-between gap-3 px-5 py-2 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground flex items-center gap-1.5 truncate text-sm font-medium">
                      {book.isActive ? (
                        <span
                          aria-hidden
                          className="relative inline-flex size-1.5 shrink-0 rounded-full bg-emerald-600 dark:bg-emerald-400"
                        >
                          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-600/60 dark:bg-emerald-400/60" />
                        </span>
                      ) : null}
                      <span className="truncate">{book.title}</span>
                    </p>
                    <p className="text-muted-foreground truncate font-mono text-2xs uppercase tracking-mini">
                      {book.author}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 font-mono text-2xs uppercase tracking-mini ${
                      book.isActive
                        ? "border-emerald-600/40 bg-emerald-600/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300 inline-flex items-center rounded-full border px-2 py-0.5 font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {book.note}
                  </span>
                </li>
              ))}
            </ul>
          </Tile>
        </div>
      </section>

      {/* Reach me */}
      <section className="mt-16 sm:mt-20">
        <div className="mx-auto max-w-[60ch]">
          <h2 className="text-2xl font-semibold tracking-tight">Reach me</h2>
          <p className="text-foreground/85 mt-4 leading-7">
            If you have any questions, article requests, you&apos;re
            looking for a mentor, or you just want to say &ldquo;Hi&rdquo;,
            feel free to reach out through a{" "}
            <a
              href="https://www.linkedin.com/in/andrzejdelgado"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground decoration-muted-foreground/50 hover:decoration-foreground group inline underline underline-offset-4 transition-colors duration-200"
            >
              <code className="bg-muted text-foreground rounded-md px-1.5 py-0.5 font-mono text-[0.9em]">
                LinkedIn
              </code>
              <ArrowUpRight
                aria-hidden="true"
                className="text-muted-foreground/70 group-hover:text-foreground ml-0.5 inline size-[0.85em] -translate-y-[0.05em] transition-all duration-200 group-hover:-translate-y-[0.15em] group-hover:translate-x-[0.05em]"
              />
            </a>{" "}
            message or book a session with me at{" "}
            <a
              href="https://adplist.org/mentors/andrzej-delgado"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground decoration-muted-foreground/50 hover:decoration-foreground group inline underline underline-offset-4 transition-colors duration-200"
            >
              <code className="bg-muted text-foreground rounded-md px-1.5 py-0.5 font-mono text-[0.9em]">
                ADPList
              </code>
              <ArrowUpRight
                aria-hidden="true"
                className="text-muted-foreground/70 group-hover:text-foreground ml-0.5 inline size-[0.85em] -translate-y-[0.05em] transition-all duration-200 group-hover:-translate-y-[0.15em] group-hover:translate-x-[0.05em]"
              />
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
