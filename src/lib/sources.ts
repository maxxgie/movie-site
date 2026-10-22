import { promises as fs } from "node:fs";
import path from "node:path";

export type StreamSource = {
  id: string;
  label: string;
  type: "hls" | "mp4" | "youtube";
  url: string;
  quality?: string;
  server?: string;
  demo?: boolean;
};

export const DEMO_NOTICE =
  "Demo stream (Big Buck Bunny, Blender Foundation, CC-BY). Add your own sources in data/sources.json.";

const BUNDLED_SOURCES: Record<string, StreamSource[]> = {
  "550": [
    {
      id: "550-hls",
      label: "Demo · Big Buck Bunny",
      type: "hls",
      url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
      quality: "1080p",
      server: "Demo CDN",
      demo: true,
    },
    {
      id: "550-mp4",
      label: "Demo · Big Buck Bunny",
      type: "mp4",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      quality: "720p",
      server: "Demo CDN",
      demo: true,
    },
  ],
};

/**
 * Sources are read from data/sources.json at runtime so you can add or swap
 * streams on a live server without rebuilding. Keys are TMDB movie ids.
 */
export async function getSources(movieId: number): Promise<StreamSource[]> {
  const key = String(movieId);

  try {
    const file = path.join(process.cwd(), "data", "sources.json");
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw) as Record<string, StreamSource[]>;
    const fromFile = parsed[key];
    if (Array.isArray(fromFile) && fromFile.length) return fromFile;
  } catch {
    // No sources file configured - fall through to bundled defaults.
  }

  return BUNDLED_SOURCES[key] ?? [];
}
