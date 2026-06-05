import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { EditableArticle } from "@/components/editable-article";
import { MdxContent } from "@/components/mdx-content";
import { PageActions } from "@/components/page-actions";
import { ShareAccessDenied } from "@/components/saturn-heavy/access-denied";
import { BurnBeacon } from "@/components/saturn-heavy/burn-beacon";
import { ShareWatermark } from "@/components/saturn-heavy/share-watermark";
import { getAllCaseStudies, getCaseStudyBySlug } from "@/lib/content";
import { renderInlineMarkdown } from "@/lib/inline-markdown";
import { verifyAccess } from "@/lib/share-tokens";
import { siteConfig } from "@/lib/site";

// Slugs that require an invite token when GATING_ENABLED is true. The
// metadata (title/description) is still served publicly so search-engine
// snippets stay informative; the body is replaced with a "Request access"
// UI for visitors without a valid token. Add more slugs here to gate them
// under the same scheme.
//
// Master switch. When false, ALL slugs are served publicly — the gate is
// bypassed regardless of what's in GATED_SLUGS. Flip back to true to
// reactivate the share-link / PIN flow.
const GATING_ENABLED = false;
const GATED_SLUGS = new Set<string>(["saturn-heavy"]);

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
  const canonical = `/case-studies/${slug}`;
  // Combine the case study's own tags with a handful of always-on portfolio
  // keywords so each page still surfaces for "Andrzej Delgado <topic>"
  // searches even when frontmatter tags are sparse.
  const tagKeywords = entry.frontmatter.tags ?? [];
  const keywords = Array.from(
    new Set([
      ...tagKeywords,
      entry.frontmatter.title,
      siteConfig.author,
      `${siteConfig.author} ${entry.frontmatter.title}`,
      "case study",
      "design systems",
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
      // When the case-study frontmatter declares a cover, that wins as the
      // OG image. Otherwise the field is omitted so Next.js auto-discovers
      // app/case-studies/[slug]/opengraph-image.tsx instead.
      ...(entry.frontmatter.cover
        ? {
            images: [
              { url: entry.frontmatter.cover, alt: entry.frontmatter.title },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${entry.frontmatter.title} — ${siteConfig.author}`,
      description: entry.frontmatter.description,
      ...(entry.frontmatter.cover
        ? { images: [entry.frontmatter.cover] }
        : {}),
    },
  };
}

export default async function CaseStudyPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ k?: string }>;
}) {
  const { slug } = await params;
  const entry = getCaseStudyBySlug(slug);
  if (!entry) notFound();

  // Per-recipient share-link gate. Off for unlisted slugs (most case
  // studies are public); on for slugs listed in GATED_SLUGS — and only
  // when the master switch GATING_ENABLED is on. When the master switch
  // is off, every slug is served publicly and any `?k=…` query param is
  // ignored (no watermark, no one-time burn) — flip GATING_ENABLED back
  // to true to restore the full share-link / PIN flow.
  const gate =
    GATING_ENABLED && GATED_SLUGS.has(slug)
      ? verifyAccess((await searchParams).k ?? null)
      : ({ kind: "granted" as const, token: null });

  const { title, description, date, cover, tags } = entry.frontmatter;
  const base = siteConfig.url.replace(/\/$/, "");
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: date,
    dateModified: date,
    inLanguage: "en",
    url: `${base}/case-studies/${slug}`,
    mainEntityOfPage: `${base}/case-studies/${slug}`,
    image: cover ? `${base}${cover}` : `${base}${siteConfig.ogImage}`,
    keywords: tags?.join(", "),
    author: {
      "@type": "Person",
      name: siteConfig.author,
      url: base,
      sameAs: siteConfig.social
        .filter((s) => s.key !== "email")
        .map((s) => s.href),
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.author,
      url: base,
    },
  };

  const granted = gate.kind === "granted";
  const grantedToken = granted ? gate.token : null;

  return (
    <article className="mx-auto w-full max-w-[840px] py-4 sm:py-6 lg:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <PageActions backHref="/" />
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

      {granted ? (
        <EditableArticle sourcePath={`case-studies/${slug}.mdx`}>
          {grantedToken ? (
            <ShareWatermark
              recipient={grantedToken.recipient}
              company={grantedToken.company}
              issuedAt={grantedToken.issuedAt}
            />
          ) : null}
          {grantedToken?.type === "one-time" && !grantedToken.usedAt ? (
            <BurnBeacon id={grantedToken.id} />
          ) : null}
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
          {grantedToken ? (
            <ShareWatermark
              recipient={grantedToken.recipient}
              company={grantedToken.company}
              issuedAt={grantedToken.issuedAt}
              variant="footer"
            />
          ) : null}
        </EditableArticle>
      ) : (
        <ShareAccessDenied reason={gate.reason} slug={slug} />
      )}
    </article>
  );
}
