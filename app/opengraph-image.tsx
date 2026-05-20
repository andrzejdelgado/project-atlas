import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

// Default site-wide OG image. Next.js auto-discovers this file as the OG
// image for the root route and any descendant that doesn't override it via
// its own opengraph-image.tsx. Note: Satori (the renderer behind next/og's
// ImageResponse) doesn't parse OKLCH yet, so colours are sRGB hex picked
// to approximate the dark UI palette.

export const alt = `${siteConfig.author} — ${siteConfig.jobTitle}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #16181f 0%, #1f2330 100%)",
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
            alignItems: "center",
            gap: "16px",
            fontSize: "22px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(250, 250, 250, 0.55)",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#5fa3ff",
              display: "block",
            }}
          />
          delgado.vc
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "84px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            {siteConfig.author}
          </div>
          <div
            style={{
              fontSize: "34px",
              fontWeight: 400,
              color: "rgba(250, 250, 250, 0.78)",
              lineHeight: 1.25,
              maxWidth: "900px",
            }}
          >
            {siteConfig.jobTitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "24px",
            fontSize: "22px",
            color: "rgba(250, 250, 250, 0.7)",
            letterSpacing: "0.02em",
          }}
        >
          <span>Case studies</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>Design systems</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>Design engineering</span>
        </div>
      </div>
    ),
    size,
  );
}
