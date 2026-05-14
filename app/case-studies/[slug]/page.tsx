import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { MdxContent } from "@/components/mdx-content";
import { PageActions } from "@/components/page-actions";
import { getAllCaseStudies, getCaseStudyBySlug } from "@/lib/content";

const fmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function generateStaticParams() {
  return getAllCaseStudies().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getCaseStudyBySlug(slug);
  if (!entry) return {};
  return {
    title: entry.frontmatter.title,
    description: entry.frontmatter.description,
    openGraph: {
      title: entry.frontmatter.title,
      description: entry.frontmatter.description,
      images: entry.frontmatter.cover ? [entry.frontmatter.cover] : undefined,
      type: "article",
      publishedTime: entry.frontmatter.date,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getCaseStudyBySlug(slug);
  if (!entry) notFound();

  const { title, description, date, cover } = entry.frontmatter;

  return (
    <article className="mx-auto w-full max-w-[840px] py-4 sm:py-6 lg:py-8">
      <PageActions backHref="/case-studies" />
      <header>
        <p className="text-muted-foreground text-xs tracking-wider uppercase tabular-nums">
          <time dateTime={date}>{fmt.format(new Date(date))}</time>
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">{description}</p>
      </header>
      {cover ? (
        <div className="border-border relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl border">
          <Image
            src={cover}
            alt=""
            fill
            sizes="(max-width: 840px) 100vw, 840px"
            priority
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="prose-text mt-10">
        <MdxContent kind="case-studies" slug={slug} />
      </div>
    </article>
  );
}
