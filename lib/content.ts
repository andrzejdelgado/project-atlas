import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Frontmatter = {
  title: string;
  description: string;
  date: string;
  cover?: string;
  tags?: string[];
  /** Optional client/company logo path — slotted into the home tile when present. */
  logo?: string;
  /** Optional short label shown in place of a logo (e.g. company initials). */
  mark?: string;
  /** Company / client the work was done for. */
  company?: string;
  /** Short tagline shown beneath the project title on the homepage card. */
  cta?: string;
  /** Color tint key for the homepage card — one of: violet, mint, coral, blue, cyan, amber. */
  tint?: string;
  /** Icon key for the homepage card — one of: sparkles, compass, book, layers, scroll, rocket. */
  icon?: string;
  /** When true, this project is promoted to the homepage hero slot. Only one should be featured at a time. */
  featured?: boolean;
  /** Stat row strings shown in the hero card, e.g. ["33 principles", "6 categories", "Open source"]. */
  stats?: string[];
  /** Visual preview kind rendered inside the hero card. */
  previewKind?: "color-ramp" | "code" | "quote";
  /** Inline content for the preview (the snippet for code, the quote text). */
  previewContent?: string;
};

export type ContentEntry = {
  slug: string;
  frontmatter: Frontmatter;
  body: string;
};

const ROOT = path.join(process.cwd(), "content");

function readDir(dir: string): ContentEntry[] {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(full, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.mdx$/, ""),
        frontmatter: data as Frontmatter,
        body: content,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    );
}

export function getAllCaseStudies(): ContentEntry[] {
  return readDir("case-studies");
}

export function getCaseStudyBySlug(slug: string): ContentEntry | undefined {
  return getAllCaseStudies().find((c) => c.slug === slug);
}

export function getAllProjects(): ContentEntry[] {
  return readDir("projects");
}

export function getProjectBySlug(slug: string): ContentEntry | undefined {
  return getAllProjects().find((n) => n.slug === slug);
}

export function getAbout(): ContentEntry | undefined {
  const file = path.join(ROOT, "about.mdx");
  if (!fs.existsSync(file)) return undefined;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return {
    slug: "about",
    frontmatter: data as Frontmatter,
    body: content,
  };
}
