const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const TOP_ARTISTS_ENDPOINT =
  "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=8";
const RECENTLY_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";
const PLAYLISTS_ENDPOINT =
  "https://api.spotify.com/v1/me/playlists?limit=20";

export type SpotifyArtist = {
  name: string;
  url: string;
  image: string | null;
};

export type SpotifyPlaylist = {
  name: string;
  url: string;
  image: string | null;
  trackCount: number;
  owner: string;
};

export type SpotifyNowPlaying = {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  url: string;
  image: string | null;
};

// Module-level cache so we don't refresh on every request. Token is valid for
// ~1 hour; we refresh 1 minute before it expires to leave headroom.
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Missing Spotify env vars. Need SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN.",
    );
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Spotify token refresh failed: ${res.status}`);
  }

  const json = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };
  cachedToken = {
    token: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  };
  return json.access_token;
}

export async function getTopArtists(): Promise<SpotifyArtist[]> {
  const token = await getAccessToken();
  const res = await fetch(TOP_ARTISTS_ENDPOINT, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];

  const json = (await res.json()) as {
    items: Array<{
      name: string;
      external_urls: { spotify: string };
      images: Array<{ url: string }>;
    }>;
  };

  return json.items.map((a) => ({
    name: a.name,
    url: a.external_urls.spotify,
    image: a.images[a.images.length - 1]?.url ?? null,
  }));
}

export async function getPlaylists(): Promise<SpotifyPlaylist[]> {
  const token = await getAccessToken();
  const res = await fetch(PLAYLISTS_ENDPOINT, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];

  const json = (await res.json()) as {
    items: Array<{
      name: string;
      external_urls: { spotify: string };
      images: Array<{ url: string }> | null;
      tracks: { total: number };
      owner: { display_name: string };
    } | null>;
  };

  return json.items
    .filter((p): p is NonNullable<typeof p> => Boolean(p && p.name))
    .slice(0, 8)
    .map((p) => ({
      name: p.name,
      url: p.external_urls?.spotify ?? "",
      image: p.images?.[0]?.url ?? null,
      trackCount: p.tracks?.total ?? 0,
      owner: p.owner?.display_name ?? "",
    }));
}

export async function getNowPlaying(): Promise<SpotifyNowPlaying | null> {
  const token = await getAccessToken();
  const res = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 60 },
  });

  if (res.status === 204 || res.status > 400) {
    return getRecentlyPlayed(token);
  }

  const json = (await res.json()) as {
    is_playing: boolean;
    item: {
      name: string;
      album: { name: string; images: Array<{ url: string }> };
      artists: Array<{ name: string }>;
      external_urls: { spotify: string };
    } | null;
  };

  if (!json.item) return getRecentlyPlayed(token);

  return {
    isPlaying: json.is_playing,
    title: json.item.name,
    artist: json.item.artists.map((a) => a.name).join(", "),
    album: json.item.album.name,
    url: json.item.external_urls.spotify,
    image: json.item.album.images[json.item.album.images.length - 1]?.url ?? null,
  };
}

async function getRecentlyPlayed(
  token: string,
): Promise<SpotifyNowPlaying | null> {
  const res = await fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;

  const json = (await res.json()) as {
    items: Array<{
      track: {
        name: string;
        album: { name: string; images: Array<{ url: string }> };
        artists: Array<{ name: string }>;
        external_urls: { spotify: string };
      };
    }>;
  };

  const track = json.items[0]?.track;
  if (!track) return null;

  return {
    isPlaying: false,
    title: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    album: track.album.name,
    url: track.external_urls.spotify,
    image: track.album.images[track.album.images.length - 1]?.url ?? null,
  };
}
