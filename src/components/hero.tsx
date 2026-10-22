"use client";

import { useState } from "react";

import { WatchlistButton } from "@/components/watchlist-button";
import { TrailerModal } from "@/components/trailer-modal";
import { backdropUrl, formatRuntime, formatYear } from "@/lib/utils";
import type { MovieDetail } from "@/lib/types";

export function Hero({ movie }: { movie: MovieDetail }) {
  const [showTrailer, setShowTrailer] = useState(false);
  const backdrop = backdropUrl(movie.backdrop_path, "w1280");
  const trailer = movie.trailers.find((item) => item.type === "Trailer") ?? movie.trailers[0];

  return (
    <section className="relative isolate min-h-[78vh] overflow-hidden">
      {backdrop ? (
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${backdrop})` }}
        />
      ) : (
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-900 via-neutral-900 to-black" />
      )}

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/95 via-black/80 to-black/25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/95 via-transparent to-black/60" />

      <div className="mx-auto flex min-h-[78vh] max-w-[1600px] flex-col justify-end px-4 pb-16 pt-24 sm:px-6 lg:px-10">
        <div className="max-w-2xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-600/40 bg-brand-600/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-400">
            #{movie.popularity ? Math.round(movie.popularity) : "Featured"}
          </span>

          <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight text-white drop-shadow-2xl sm:text-5xl lg:text-6xl">
            {movie.title}
          </h1>

          {movie.tagline ? (
            <p className="mt-3 text-base italic text-ink-300">{movie.tagline}</p>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-300">
            <span className="inline-flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-brand-500">
                <path d="m12 3.6 2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 16.88l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L12 3.6Z" />
              </svg>
              {movie.vote_average.toFixed(1)}
              <span className="text-ink-500">/10</span>
            </span>
            <span>{formatYear(movie.release_date)}</span>
            <span>{formatRuntime(movie.runtime)}</span>
            {movie.genres?.length ? (
              <span className="hidden sm:inline">{movie.genres.map((g) => g.name).join(" • ")}</span>
            ) : null}
          </div>

          <p className="mt-5 line-clamp-3 max-w-xl text-sm leading-relaxed text-ink-300 sm:text-base">
            {movie.overview}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={`/watch/${movie.id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3 text-sm font-bold text-black transition hover:bg-white/85"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.3-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
              </svg>
              Play
            </a>

            {trailer ? (
              <button
                type="button"
                onClick={() => setShowTrailer(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-7 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/25"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 6h3v12H4zM9 6l10 6-10 6z" />
                </svg>
                Trailer
              </button>
            ) : null}

            <WatchlistButton movie={movie} variant="full" />
          </div>
        </div>
      </div>

      {showTrailer && trailer ? (
        <TrailerModal
          trailerKey={trailer.key}
          title={movie.title}
          onClose={() => setShowTrailer(false)}
        />
      ) : null}
    </section>
  );
}
