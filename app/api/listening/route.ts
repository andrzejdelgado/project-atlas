import { NextResponse } from "next/server";
import { getNowPlaying, getPlaylists } from "@/lib/spotify";

export const revalidate = 60;

export async function GET() {
  try {
    const [nowPlaying, playlists] = await Promise.all([
      getNowPlaying(),
      getPlaylists(),
    ]);
    return NextResponse.json({ nowPlaying, playlists });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
