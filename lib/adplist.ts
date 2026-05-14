export type AdpListStats = {
  title: string | null;
  yearsOfExperience: number | null;
  reviewCount: number | null;
  averageRating: number | null;
  profileUrl: string;
};

const PROFILE_URL = "https://adplist.org/mentors/andrzej-delgado";

export async function getAdpListStats(): Promise<AdpListStats | null> {
  try {
    const res = await fetch(PROFILE_URL, {
      next: { revalidate: 21600 },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const m = html.match(
      /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
    );
    if (!m) return null;
    const data = JSON.parse(m[1]);
    const pp = data?.props?.pageProps;
    if (!pp) return null;
    return {
      title: pp.mentor?.title ?? null,
      yearsOfExperience: pp.mentor?.years_of_experience ?? null,
      reviewCount: pp.reviewStats?.count ?? null,
      averageRating:
        typeof pp.reviewStats?.avg === "number" ? pp.reviewStats.avg : null,
      profileUrl: PROFILE_URL,
    };
  } catch {
    return null;
  }
}
