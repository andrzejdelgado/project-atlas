import { NextResponse } from "next/server";

const REDIRECT_URI = "http://127.0.0.1:3000/api/auth/callback/spotify";
const SCOPES = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-top-read",
  "playlist-read-private",
  "playlist-read-collaborative",
].join(" ");

export function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  if (!clientId) {
    return new NextResponse("Missing SPOTIFY_CLIENT_ID in .env.local", {
      status: 500,
    });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
  });

  return NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`,
  );
}
