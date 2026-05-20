import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

// Served at /robots.txt by Next.js. Allow indexing across the board; block
// the inline-MDX editor API (dev-only, but blocked anyway) and point
// crawlers at the sitemap.
export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url.replace(/\/$/, "");
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
