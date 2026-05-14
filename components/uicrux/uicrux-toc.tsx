import Link from "next/link";

type Entry = { id: string; title: string };
type Group = { category: string; entries: Entry[] };

const GROUPS: Group[] = [
  {
    category: "Story",
    entries: [
      { id: "tldr", title: "TL;DR" },
      { id: "why-i-built-it", title: "Why I built it" },
    ],
  },
  {
    category: "CSS for Designers",
    entries: [
      { id: "fundamentals", title: "Fundamentals" },
      { id: "design-computing", title: "Design Computing" },
      { id: "advanced-interaction", title: "Advanced Interaction" },
      { id: "advanced-visual-effects", title: "Advanced Visual Effects" },
    ],
  },
  {
    category: "UI Elements",
    entries: [{ id: "ui-elements", title: "Visual catalog" }],
  },
  {
    category: "Naming Conventions",
    entries: [
      { id: "naming-principles", title: "Principles" },
      { id: "categorization", title: "Categorization" },
      { id: "methodologies", title: "CSS Methodologies" },
      { id: "vocabulary", title: "Shared Vocabulary" },
    ],
  },
  {
    category: "Assets Delivery",
    entries: [
      { id: "filename-rules", title: "Filename rules" },
      { id: "responsive-images", title: "Responsive images" },
      { id: "modern-formats", title: "Modern formats" },
    ],
  },
  {
    category: "Resources",
    entries: [{ id: "resources", title: "Curated reading list" }],
  },
  {
    category: "Reflection",
    entries: [{ id: "reflection", title: "What it taught me" }],
  },
  {
    category: "Closing",
    entries: [
      { id: "credits", title: "Credits" },
      { id: "project-info", title: "Project info" },
    ],
  },
];

export function UicruxToc() {
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
