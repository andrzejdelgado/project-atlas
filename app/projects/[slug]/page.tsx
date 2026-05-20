import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EditableArticle } from "@/components/editable-article";
import { MdxContent } from "@/components/mdx-content";
import { PageActions } from "@/components/page-actions";
import { getAllProjects, getProjectBySlug } from "@/lib/content";
import { renderInlineMarkdown } from "@/lib/inline-markdown";
import { siteConfig } from "@/lib/site";

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
  const canonical = `/projects/${slug}`;
  const tagKeywords = entry.frontmatter.tags ?? [];
  const keywords = Array.from(
    new Set([
      ...tagKeywords,
      entry.frontmatter.title,
      siteConfig.author,
      `${siteConfig.author} ${entry.frontmatter.title}`,
      "project",
    ]),
  );
  return {
    title: entry.frontmatter.title,
    description: entry.frontmatter.description,
    keywords,
    authors: [{ name: siteConfig.author, url: siteConfig.url }],
    alternates: { canonical },
    openGraph: {
      title: `${entry.frontmatter.title} — ${siteConfig.author}`,
      description: entry.frontmatter.description,
      url: canonical,
      siteName: siteConfig.name,
      type: "article",
      publishedTime: entry.frontmatter.date,
      authors: [siteConfig.author],
      tags: tagKeywords,
    },
    twitter: {
      card: "summary_large_image",
      title: `${entry.frontmatter.title} — ${siteConfig.author}`,
      description: entry.frontmatter.description,
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

  const { title, description, date, tags } = entry.frontmatter;
  const base = siteConfig.url.replace(/\/$/, "");
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description,
    datePublished: date,
    dateModified: date,
    inLanguage: "en",
    url: `${base}/projects/${slug}`,
    mainEntityOfPage: `${base}/projects/${slug}`,
    image: `${base}${siteConfig.ogImage}`,
    keywords: tags?.join(", "),
    creator: {
      "@type": "Person",
      name: siteConfig.author,
      url: base,
    },
  };

  return (
    <article className="w-full py-4 sm:py-6 lg:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <PageActions backHref="/" />
      <EditableArticle sourcePath={`projects/${slug}.mdx`}>
        <header>
          <p className="text-muted-foreground text-xs tracking-wider uppercase tabular-nums">
            <time dateTime={date}>{fmt.format(new Date(date))}</time>
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            {renderInlineMarkdown(description)}
          </p>
        </header>
        <div className="mt-10">
          <MdxContent kind="projects" slug={slug} />
        </div>
      </EditableArticle>
    </article>
  );
}
