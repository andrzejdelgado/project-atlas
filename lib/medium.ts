export type MediumArticle = {
  title: string;
  url: string;
  publishedAt: string;
  image: string | null;
  categories: string[];
  readMinutes: number | null;
  excerpt: string | null;
};

const FEED_URL = "https://medium.com/feed/@andrzej.delgado";
const PROFILE_URL = "https://medium.com/@andrzej.delgado";

const cdata = (raw: string) =>
  raw.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#x27;/g, "'");

const stripTags = (s: string) => s.replace(/<[^>]+>/g, " ");

function pickTag(item: string, tag: string): string | null {
  const m = item.match(
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`),
  );
  return m ? cdata(m[1]) : null;
}

function pickAllTag(item: string, tag: string): string[] {
  const out: string[] = [];
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(item))) out.push(cdata(m[1]));
  return out;
}

export async function getMediumArticles(
  limit = 3,
): Promise<{
  articles: MediumArticle[];
  profileUrl: string;
  totalCount: number;
}> {
  try {
    const res = await fetch(FEED_URL, {
      next: { revalidate: 21600 },
      headers: { "User-Agent": "Mozilla/5.0 (atlas-site)" },
    });
    if (!res.ok)
      return { articles: [], profileUrl: PROFILE_URL, totalCount: 0 };
    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
    const totalCount = items.length;
    const articles: MediumArticle[] = items.slice(0, limit).map((it) => {
      const title = decode(pickTag(it, "title") ?? "");
      const url = (pickTag(it, "link") ?? "").split("?")[0];
      const publishedAt = pickTag(it, "pubDate") ?? "";
      const categories = pickAllTag(it, "category");
      const content = pickTag(it, "content:encoded") ?? "";
      const imgMatch = content.match(/src="([^"]+)"/);
      const image = imgMatch ? imgMatch[1] : null;
      const text = decode(stripTags(content)).replace(/\s+/g, " ").trim();
      const wordCount = text ? text.split(/\s+/).length : 0;
      const readMinutes = wordCount ? Math.max(1, Math.round(wordCount / 220)) : null;
      const excerpt = text ? text.slice(0, 180) : null;
      return {
        title,
        url,
        publishedAt,
        image,
        categories,
        readMinutes,
        excerpt,
      };
    });
    return { articles, profileUrl: PROFILE_URL, totalCount };
  } catch {
    return { articles: [], profileUrl: PROFILE_URL, totalCount: 0 };
  }
}
