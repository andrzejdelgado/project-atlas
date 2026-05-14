import { NextRequest, NextResponse } from "next/server";

const REDIRECT_URI = "http://127.0.0.1:3000/api/auth/callback/spotify";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return new NextResponse(`Spotify error: ${error}`, { status: 400 });
  }
  if (!code) {
    return new NextResponse("Missing ?code in callback URL", { status: 400 });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return new NextResponse(
      "Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env.local",
      { status: 500 },
    );
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
    cache: "no-store",
  });

  const json = await tokenRes.json();

  if (!tokenRes.ok) {
    return new NextResponse(
      `Token exchange failed:\n${JSON.stringify(json, null, 2)}`,
      {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      },
    );
  }

  const html = `<!doctype html>
<html>
  <head><meta charset="utf-8"><title>Spotify refresh token</title>
  <style>
    body { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; padding: 2rem; max-width: 720px; margin: 0 auto; line-height: 1.6; }
    h1 { font-size: 1.1rem; }
    code { background: #f4f4f5; padding: 0.75rem 1rem; display: block; border-radius: 8px; word-break: break-all; user-select: all; }
    p { color: #555; }
    .ok { color: #15803d; font-weight: 600; }
  </style>
  </head>
  <body>
    <h1 class="ok">✓ Spotify authorization complete</h1>
    <p>Copy the refresh token below and paste it into <strong>.env.local</strong> as <code style="display:inline;padding:2px 6px">SPOTIFY_REFRESH_TOKEN</code>:</p>
    <code>${json.refresh_token}</code>
    <p>Then delete the two temporary route folders (your assistant will tell you which) and restart the dev server.</p>
  </body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
