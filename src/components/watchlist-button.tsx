"use client";

import { useWatchlist } from "@/providers/watchlist-provider";
import type { Movie } from "@/lib/types";

type WatchlistButtonProps = {
  movie: Movie;
  variant?: "icon" | "full";
  className?: string;
};

export function WatchlistButton({ movie, variant = "icon", className = "" }: WatchlistButtonProps) {
  const { has, toggle } = useWatchlist();
  const inList = has(movie.id);

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    toggle({
      id: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      voteAverage: movie.vote_average,
      releaseDate: movie.release_date,
    });
  };

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition ${
          inList
            ? "border-brand-600 bg-brand-600/15 text-brand-500 hover:bg-brand-600/25"
            : "border-ink-700 bg-ink-800/70 text-ink-100 hover:border-ink-600 hover:bg-ink-800"
        } ${className}`}
      >
        {inList ? "In My List" : "+ My List"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={inList ? `Remove ${movie.title} from my list` : `Add ${movie.title} to my list`}
      title={inList ? "Remove from My List" : "Add to My List"}
      className={`grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/65 backdrop-blur transition hover:scale-105 hover:bg-black/85 ${
        inList ? "text-brand-500" : "text-white"
      } ${className}`}
    >
      {inList ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="m20 6-11 11-5-5" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      )}
    </button>
  );
}
