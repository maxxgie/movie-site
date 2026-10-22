"use client";

import Link from "next/link";
import { useState } from "react";

import { TrailerModal } from "@/components/trailer-modal";
import { WatchlistButton } from "@/components/watchlist-button";
import type { MovieDetail } from "@/lib/types";

export function MovieActions({ movie }: { movie: MovieDetail }) {
  const [showTrailer, setShowTrailer] = useState(false);
  const trailer = movie.trailers.find((item) => item.type === "Trailer") ?? movie.trailers[0];

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/watch/${movie.id}`}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-sm font-bold text-black transition hover:bg-white/85"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.3-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
          </svg>
          Play
        </Link>

        {trailer ? (
          <button
            type="button"
            onClick={() => setShowTrailer(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 6h3v12H4zM9 6l10 6-10 6z" />
            </svg>
            Trailer
          </button>
        ) : null}

        <WatchlistButton movie={movie} variant="full" />

        <a
          href="#reviews"
          className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-semibold text-ink-300 transition hover:border-white/30 hover:text-ink-100"
        >
          Reviews
        </a>
      </div>

      {showTrailer && trailer ? (
        <TrailerModal
          trailerKey={trailer.key}
          title={movie.title}
          onClose={() => setShowTrailer(false)}
        />
      ) : null}
    </>
  );
}
