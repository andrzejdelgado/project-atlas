import { ImageResponse } from "next/og";

import { getCaseStudyBySlug } from "@/lib/content";
import { siteConfig } from "@/lib/site";

// Per-case-study Open Graph card. Layout: meta strip on top with route + the
// site origin, large case-study title, two-line description, then tag chips.
// Note: Satori (the renderer behind next/og's ImageResponse) doesn't parse
// OKLCH yet, so colors are sRGB hex picked to approximate the dark UI.

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getCaseStudyBySlug(slug);
  const title = entry?.frontmatter.title ?? slug;
  const description = entry?.frontmatter.description ?? "";
  const tags = entry?.frontmatter.tags ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #16181f 0%, #1b1f2b 60%, #232038 100%)",
          color: "#fafafa",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "20px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(250, 250, 250, 0.55)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#5fa3ff",
                display: "block",
              }}
            />
            Case study · {siteConfig.author}
          </div>
          <div>delgado.vc</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: "78px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              maxWidth: "1050px",
            }}
          >
            {title}
          </div>
          {description ? (
            <div
              style={{
                fontSize: "26px",
                fontWeight: 400,
                color: "rgba(250, 250, 250, 0.74)",
                lineHeight: 1.35,
                maxWidth: "1000px",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {description}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            fontSize: "18px",
            color: "rgba(250, 250, 250, 0.7)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            flexWrap: "wrap",
          }}
        >
          {tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              style={{
                border: "1px solid rgba(250, 250, 250, 0.22)",
                borderRadius: "8px",
                padding: "6px 14px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    ),
    size,
  );
}

