"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { SpotifyNowPlaying, SpotifyPlaylist } from "@/lib/spotify";

type ListeningData = {
  nowPlaying: SpotifyNowPlaying | null;
  playlists: SpotifyPlaylist[];
};

function cleanTitle(title: string): string {
  return title
    .replace(/\s*-\s*\d{4}\s*Remaster(ed)?.*$/i, "")
    .replace(/\s*-\s*Remaster(ed)?.*$/i, "")
    .replace(/\s*\(Remaster(ed)?[^)]*\)/i, "")
    .replace(/\s*-\s*\d{4}\s*Mix.*$/i, "")
    .replace(/\s*\(\d{4}\s*Remaster[^)]*\)/i, "")
    .trim();
}

function useDominantColor(src: string | null | undefined) {
  const [rgb, setRgb] = useState<{ r: number; g: number; b: number } | null>(
    null,
  );

  useEffect(() => {
    if (!src) {
      setRgb(null);
      return;
    }
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      if (!w || !h) return;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      try {
        const { data } = ctx.getImageData(0, 0, w, h);
        const buckets = new Map<
          string,
          { r: number; g: number; b: number; n: number }
        >();
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          if (a < 200) continue;
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          if (max - min < 20) continue;
          if (max < 30 || min > 230) continue;
          const key = `${r >> 5}-${g >> 5}-${b >> 5}`;
          const cur = buckets.get(key);
          if (cur) {
            cur.r += r;
            cur.g += g;
            cur.b += b;
            cur.n += 1;
          } else {
            buckets.set(key, { r, g, b, n: 1 });
          }
        }
        let best: { r: number; g: number; b: number; n: number } | null = null;
        for (const v of buckets.values()) {
          if (!best || v.n > best.n) best = v;
        }
        if (best) {
          setRgb({
            r: Math.round(best.r / best.n),
            g: Math.round(best.g / best.n),
            b: Math.round(best.b / best.n),
          });
        }
      } catch {
        // CORS — ignore
      }
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  return rgb;
}

function Equalizer({ playing }: { playing: boolean }) {
  return (
    <span aria-hidden className="inline-flex h-3 items-end gap-[2px]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`block w-[2px] rounded-sm bg-emerald-600 dark:bg-emerald-400 ${
            playing
              ? `eq-bar ${i === 1 ? "eq-bar-2" : i === 2 ? "eq-bar-3" : ""}`
              : ""
          }`}
          style={{ height: playing ? "100%" : "30%" }}
        />
      ))}
    </span>
  );
}

export function ListeningTile() {
  const [data, setData] = useState<ListeningData | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/listening");
        if (!res.ok) return;
        const json = (await res.json()) as ListeningData;
        if (!cancelled) setData(json);
      } catch {
        /* ignore */
      }
    };
    load();
    const id = setInterval(load, 300_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const nowPlaying = data?.nowPlaying;
  const playlists = data?.playlists ?? [];
  const accent = useDominantColor(nowPlaying?.image);

  const accentRgb = accent ? `${accent.r}, ${accent.g}, ${accent.b}` : null;
  const glowStyle: React.CSSProperties = accentRgb
    ? {
        background: `radial-gradient(circle at 0% 50%, rgba(${accentRgb}, 0.35), transparent 65%), radial-gradient(circle at 100% 100%, rgba(${accentRgb}, 0.15), transparent 60%)`,
      }
    : {};
  const borderStyle: React.CSSProperties = accentRgb
    ? { boxShadow: `inset 0 0 0 1px rgba(${accentRgb}, 0.25)` }
    : {};

  const edgeGradient =
    "linear-gradient(in oklab to right, transparent, oklch(0.65 0.22 290 / 0.85) 25%, oklch(0.72 0.2 25 / 0.95) 55%, oklch(0.8 0.13 175 / 0.85) 80%, transparent)";

  return (
    <div className="flex flex-col gap-3">
      {nowPlaying?.isPlaying && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px overflow-hidden"
        >
          <span
            className="listening-edge-sweep block size-full"
            style={{ background: edgeGradient }}
          />
        </span>
      )}
      {nowPlaying && (
        <a
          href={nowPlaying.url}
          target="_blank"
          rel="noreferrer"
          style={borderStyle}
          className="group border-border/70 bg-background/40 relative flex items-center gap-3 overflow-hidden rounded-lg border p-2 transition-all hover:scale-[1.01]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-90 transition-opacity duration-700"
            style={glowStyle}
          />
          {nowPlaying.image ? (
            <div className="relative size-14 shrink-0 overflow-hidden rounded">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={nowPlaying.image}
                alt=""
                className="size-full object-cover"
              />
            </div>
          ) : (
            <div className="size-14 shrink-0 rounded bg-gradient-to-br from-[oklch(0.55_0.15_264)] to-[oklch(0.65_0.2_320)]" />
          )}
          <div className="relative min-w-0 flex-1">
            <div className="mb-0.5 flex items-center gap-1.5">
              <Equalizer playing={nowPlaying.isPlaying} />
              <span
                className={`text-[10px] font-medium uppercase tracking-[0.08em] ${
                  nowPlaying.isPlaying
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-foreground/50"
                }`}
              >
                {nowPlaying.isPlaying ? "Now playing" : "Last played"}
              </span>
            </div>
            <div className="text-foreground truncate text-sm font-medium leading-tight">
              {cleanTitle(nowPlaying.title)}
            </div>
            <div className="text-muted-foreground tracking-mini truncate font-mono text-2xs uppercase">
              {nowPlaying.artist}
            </div>
          </div>
        </a>
      )}

      {playlists.length > 0 && (
        <ol className="grid grid-cols-2 gap-x-3 gap-y-0.5">
          {playlists.slice(0, 8).map((playlist) => (
            <li key={playlist.name} className="contents">
              <a
                href={playlist.url}
                target="_blank"
                rel="noreferrer"
                className="group hover:bg-background/40 border-border/40 flex items-center gap-2 rounded-md border-b px-1 py-1.5 transition-colors"
              >
                {playlist.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={playlist.image}
                    alt=""
                    className="size-6 shrink-0 rounded object-cover"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="size-6 shrink-0 rounded bg-gradient-to-br from-[oklch(0.55_0.15_264)] to-[oklch(0.65_0.2_320)]"
                  />
                )}
                <span className="min-w-0 flex-1">
                  <span className="text-foreground block truncate text-xs font-medium leading-tight">
                    {playlist.name}
                  </span>
                  {playlist.trackCount > 0 && (
                    <span className="text-foreground/50 block text-[10px] tabular-nums">
                      {playlist.trackCount} tracks
                    </span>
                  )}
                </span>
                <ArrowUpRight
                  size={12}
                  className="text-foreground/50 shrink-0 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                />
              </a>
            </li>
          ))}
        </ol>
      )}

      {!data && <div className="text-foreground/50 text-xs">Loading…</div>}
    </div>
  );
}
