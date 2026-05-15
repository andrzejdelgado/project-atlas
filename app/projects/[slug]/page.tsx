import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MdxContent } from "@/components/mdx-content";
import { PageActions } from "@/components/page-actions";
import { getAllProjects, getProjectBySlug } from "@/lib/content";

const fmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function generateStaticParams() {
  return getAllProjects().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getProjectBySlug(slug);
  if (!entry) return {};
  return {
    title: entry.frontmatter.title,
    description: entry.frontmatter.description,
    openGraph: {
      title: entry.frontmatter.title,
      description: entry.frontmatter.description,
      type: "article",
      publishedTime: entry.frontmatter.date,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getProjectBySlug(slug);
  if (!entry) notFound();

  const { title, description, date } = entry.frontmatter;

  return (
    <article className="w-full py-4 sm:py-6 lg:py-8">
      <PageActions backHref="/" />
      <header>
        <p className="text-muted-foreground text-xs tracking-wider uppercase tabular-nums">
          <time dateTime={date}>{fmt.format(new Date(date))}</time>
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">{description}</p>
      </header>
      <div className="mt-10">
        <MdxContent kind="projects" slug={slug} />
      </div>
    </article>
  );
}
