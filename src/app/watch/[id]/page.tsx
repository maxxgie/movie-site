import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MovieRow } from "@/components/movie-row";
import { ReviewsSection } from "@/components/reviews-section";
import { VideoPlayer } from "@/components/video-player";
import { getReviews, summariseReviews } from "@/lib/reviews-store";
import { DEMO_NOTICE, getSources } from "@/lib/sources";
import { getMovieById } from "@/lib/tmdb";
import { formatRuntime, formatYear } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieById(Number(id));
  return { title: movie ? `Watch ${movie.title}` : "Watch" };
}

export default async function WatchPage({ params }: PageProps) {
  const { id } = await params;
  const movieId = Number(id);

  if (!Number.isFinite(movieId)) notFound();

  const movie = await getMovieById(movieId);
  if (!movie) notFound();

  const [sources, reviews, summary] = await Promise.all([
    getSources(movieId),
    getReviews(movieId),
    summariseReviews(movieId),
  ]);

  const trailer = movie.trailers.find((item) => item.type === "Trailer") ?? movie.trailers[0];
  const usesDemo = sources.some((source) => source.demo);

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10">
      <VideoPlayer
        movieId={movie.id}
        title={movie.title}
        posterPath={movie.backdrop_path ?? movie.poster_path}
        backdropPath={movie.backdrop_path}
        sources={sources}
        trailerKey={trailer?.key ?? null}
      />

      {usesDemo ? (
        <p className="mt-3 rounded-lg border border-brand-600/30 bg-brand-600/10 px-4 py-2.5 text-xs text-ink-200">
          {DEMO_NOTICE}
        </p>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-ink-100 sm:text-3xl">
            {movie.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-400">
            <span>{formatYear(movie.release_date)}</span>
            <span>{formatRuntime(movie.runtime)}</span>
            <span className="inline-flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-brand-500">
                <path d="m12 3.6 2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 16.88l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L12 3.6Z" />
              </svg>
              {movie.vote_average.toFixed(1)}
            </span>
            {movie.genres?.length ? (
              <span>{movie.genres.map((genre) => genre.name).join(" • ")}</span>
            ) : null}
          </div>

          {movie.overview ? (
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-200">{movie.overview}</p>
          ) : null}

          <div className="mt-8">
            <h2 className="mb-4 text-lg font-bold tracking-tight text-ink-100">
              Reviews &amp; comments
            </h2>
            <ReviewsSection
              movieId={movie.id}
              movieTitle={movie.title}
              posterPath={movie.poster_path}
              initialReviews={reviews}
              initialSummary={summary}
            />
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-ink-900/50 p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink-400">
              Keyboard shortcuts
            </h2>
            <ul className="space-y-2 text-xs text-ink-300">
              {[
                ["Space / K", "Play or pause"],
                ["← / →", "Skip 10 seconds"],
                ["↑ / ↓", "Volume"],
                ["M", "Mute"],
                ["F", "Fullscreen"],
                ["S", "Playback speed"],
              ].map(([key, description]) => (
                <li key={key} className="flex items-center justify-between gap-3">
                  <kbd className="rounded border border-white/10 bg-ink-800 px-1.5 py-0.5 font-mono text-[11px] text-ink-200">
                    {key}
                  </kbd>
                  <span>{description}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {movie.similar.length ? (
        <div className="mt-12">
          <MovieRow title="More like this" movies={movie.similar} />
        </div>
      ) : null}
    </div>
  );
}
