import type { MetadataRoute } from "next";

import { getAllCaseStudies, getAllProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";

// Auto-generated sitemap — Next.js serves this at /sitemap.xml. Static
// routes are listed explicitly; case-study and project URLs come from the
// MDX content directory so the index stays in sync with what actually
// ships. lastModified pulls from each entry's frontmatter date.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/case-studies`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  const caseStudies: MetadataRoute.Sitemap = getAllCaseStudies().map((c) => ({
    url: `${base}/case-studies/${c.slug}`,
    lastModified: new Date(c.frontmatter.date),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const projects: MetadataRoute.Sitemap = getAllProjects().map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: new Date(p.frontmatter.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...caseStudies, ...projects];
}
