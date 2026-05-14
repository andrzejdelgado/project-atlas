import type { Metadata } from "next";

import { MdxContent } from "@/components/mdx-content";
import { PageActions } from "@/components/page-actions";
import { getAbout } from "@/lib/content";

const about = getAbout();

export const metadata: Metadata = {
  title: about?.frontmatter.title ?? "About",
  description: about?.frontmatter.description,
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[840px] py-4 sm:py-6 lg:py-8">
      <PageActions backHref="/" />
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {about?.frontmatter.title ?? "About"}
        </h1>
        {about?.frontmatter.description ? (
          <p className="text-muted-foreground mt-2 text-lg">
            {about.frontmatter.description}
          </p>
        ) : null}
      </header>
      <div className="prose-text">
        <MdxContent kind="about" />
      </div>
    </div>
  );
}
