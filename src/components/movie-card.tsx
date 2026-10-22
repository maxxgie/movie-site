"use client";

import Link from "next/link";

import { PosterImage } from "@/components/poster-image";
import { WatchlistButton } from "@/components/watchlist-button";
import { formatYear } from "@/lib/utils";
import type { Movie } from "@/lib/types";

type MovieCardProps = {
  movie: Movie;
  priority?: boolean;
  showWatch?: boolean;
};

export function MovieCard({ movie, priority = false, showWatch = true }: MovieCardProps) {
  return (
    <article className="group relative w-[150px] shrink-0 sm:w-[175px] lg:w-[195px]">
      <Link href={`/movie/${movie.id}`} className="block">
        <div className="relative overflow-hidden rounded-xl ring-1 ring-white/5 transition duration-300 group-hover:ring-brand-600/60 group-hover:shadow-glow">
          <PosterImage
            path={movie.poster_path}
            title={movie.title}
            priority={priority}
            className="aspect-[2/3]"
            sizes="(max-width: 640px) 38vw, (max-width: 1024px) 22vw, 195px"
            imageClassName="transition duration-500 group-hover:scale-105"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

          {showWatch ? (
            <span className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition duration-300 group-hover:opacity-100">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-white/95 text-black shadow-xl transition hover:scale-105">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.3-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
                </svg>
              </span>
            </span>
          ) : null}

          <span className="absolute right-2 top-2 opacity-0 transition duration-300 group-hover:opacity-100">
            <WatchlistButton movie={movie} />
          </span>
        </div>

        <div className="mt-2.5 space-y-1 px-0.5">
          <h3 className="truncate text-sm font-semibold text-ink-100 transition group-hover:text-ink-100">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-ink-400">
            <span>{formatYear(movie.release_date)}</span>
            {movie.vote_average > 0 ? (
              <>
                <span className="text-ink-600">•</span>
                <span className="inline-flex items-center gap-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-brand-500">
                    <path d="m12 3.6 2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 16.88l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L12 3.6Z" />
                  </svg>
                  {movie.vote_average.toFixed(1)}
                </span>
              </>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
