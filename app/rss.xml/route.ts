import { getAllProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";

const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function GET() {
  const projects = getAllProjects();
  const items = projects
    .map((n) => {
      const url = `${siteConfig.url}/projects/${n.slug}`;
      return `    <item>
      <title>${escape(n.frontmatter.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(n.frontmatter.date).toUTCString()}</pubDate>
      <description>${escape(n.frontmatter.description)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${escape(siteConfig.author)} — Projects</title>
    <link>${siteConfig.url}/projects</link>
    <description>${escape(siteConfig.description)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
