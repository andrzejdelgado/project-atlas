import type { Metadata } from "next";

import { ContentCard } from "@/components/content-card";
import { PageActions } from "@/components/page-actions";
import { getPublishedCaseStudies } from "@/lib/content";

export const metadata: Metadata = {
  title: "Case studies",
  description: "Selected case studies and projects.",
};

export default function CaseStudiesPage() {
  const cases = getPublishedCaseStudies();
  return (
    <div className="mx-auto w-full max-w-[840px] py-4 sm:py-6 lg:py-8">
      <PageActions backHref="/" />
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Case studies
        </h1>
        <p className="text-muted-foreground mt-2">
          Long-horizon design systems and design-engineering work, written up
          after the fact.
        </p>
      </header>
      <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 sm:gap-6 lg:gap-8">
        {cases.map((entry, i) => (
          <li
            key={entry.slug}
            className="animate-in fade-in slide-in-from-bottom-2"
            style={{
              animationDuration: "300ms",
              animationDelay: `${i * 60}ms`,
              animationFillMode: "both",
            }}
          >
            <ContentCard entry={entry} href={`/case-studies/${entry.slug}`} />
          </li>
        ))}
      </ul>
    </div>
  );
}
