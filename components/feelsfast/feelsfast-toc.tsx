import Link from "next/link";

type Entry = { id: string; title: string };
type Group = { category: string; entries: Entry[] };

const GROUPS: Group[] = [
  {
    category: "Story",
    entries: [
      { id: "tldr", title: "TL;DR" },
      { id: "origin", title: "Origin" },
      { id: "by-the-numbers", title: "By the numbers" },
    ],
  },
  {
    category: "The platform",
    entries: [
      { id: "the-platform", title: "Platform tour" },
      { id: "the-four-time-bands", title: "The four time bands" },
    ],
  },
  {
    category: "The work",
    entries: [
      { id: "method-that-worked", title: "Method that worked" },
      { id: "challenges", title: "Challenges" },
      { id: "what-we-shipped--learned", title: "What we shipped & learned" },
      { id: "results", title: "Results" },
    ],
  },
  {
    category: "Closing",
    entries: [
      { id: "reflection", title: "Reflection" },
      { id: "credits", title: "Credits" },
      { id: "project-info", title: "Project info" },
    ],
  },
];

export function FeelsfastToc() {
  return (
    <nav
      aria-label="Sections"
      className="border-border bg-card/40 mt-10 rounded-2xl border p-5 sm:p-6"
    >
      <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
        Contents
      </p>
      <div className="mt-4 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {GROUPS.map((group) => (
          <div key={group.category}>
            <p className="text-foreground text-sm font-semibold tracking-tight">
              {group.category}
            </p>
            <ul className="mt-2 flex flex-col gap-1">
              {group.entries.map((entry) => (
                <li key={entry.id} className="flex items-baseline gap-3">
                  <span
                    aria-hidden="true"
                    className="bg-muted-foreground/40 size-1 shrink-0 translate-y-[-2px] rounded-full"
                  />
                  <Link
                    href={`#${entry.id}`}
                    className="text-foreground/85 hover:text-foreground decoration-muted-foreground/40 hover:decoration-foreground text-sm underline underline-offset-4 transition-colors duration-200"
                  >
                    {entry.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
