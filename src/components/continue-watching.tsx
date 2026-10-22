"use client";

import Link from "next/link";

import { PosterImage } from "@/components/poster-image";
import { formatDuration } from "@/lib/utils";
import { useWatchlist } from "@/providers/watchlist-provider";

export function ContinueWatching() {
  const { progress } = useWatchlist();

  const entries = Object.values(progress)
    .filter(
      (entry) =>
        entry.duration > 0 &&
        entry.time > 20 &&
        entry.time < entry.duration - 30,
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 12);

  if (!entries.length) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-10">
      <h2 className="mb-3 text-lg font-bold tracking-tight text-ink-100 sm:text-xl">
        Continue Watching
      </h2>
      <div className="scrollbar-none flex gap-3 overflow-x-auto pb-2 sm:gap-4">
        {entries.map((entry) => {
          const percent = Math.min(100, (entry.time / entry.duration) * 100);
          const remaining = formatDuration(entry.duration - entry.time);

          return (
            <Link
              key={entry.id}
              href={`/watch/${entry.id}`}
              className="group/continue w-[220px] shrink-0 sm:w-[260px]"
            >
              <div className="relative overflow-hidden rounded-xl ring-1 ring-white/10 transition group-hover/continue:ring-brand-600/60">
                <PosterImage
                  path={entry.posterPath}
                  title={entry.title}
                  className="aspect-video"
                  sizes="(max-width: 640px) 55vw, 260px"
                />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/25">
                  <div className="h-full bg-brand-600" style={{ width: `${percent}%` }} />
                </div>
                <span className="absolute bottom-3 right-3 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                  {remaining} left
                </span>
              </div>
              <p className="mt-2 truncate text-sm font-semibold text-ink-100">{entry.title}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
