import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MovieActions } from "@/components/movie-actions";
import { MovieRow } from "@/components/movie-row";
import { PosterImage } from "@/components/poster-image";
import { ReviewsSection } from "@/components/reviews-section";
import { StarRating } from "@/components/star-rating";
import { getReviews, summariseReviews } from "@/lib/reviews-store";
import { getMovieById } from "@/lib/tmdb";
import { backdropUrl, formatMoney, formatRuntime, formatYear } from "@/lib/utils";

// Rendered per request so reviews are always fresh; TMDB responses are still
// cached by their own `next.revalidate` option.
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieById(Number(id));
  if (!movie) return { title: "Movie not found" };

  return {
    title: movie.title,
    description: movie.overview || `Watch ${movie.title} online on CineVault.`,
    openGraph: {
      title: movie.title,
      description: movie.overview,
      images: movie.backdrop_path ? [backdropUrl(movie.backdrop_path, "w1280")!] : [],
    },
  };
}

export default async function MoviePage({ params }: PageProps) {
  const { id } = await params;
  const movieId = Number(id);

  if (!Number.isFinite(movieId)) notFound();

  const movie = await getMovieById(movieId);
  if (!movie) notFound();

  const [reviews, summary] = await Promise.all([
    getReviews(movieId),
    summariseReviews(movieId),
  ]);

  const backdrop = backdropUrl(movie.backdrop_path, "w1280");
  const genreNames =
    movie.genres?.map((genre) => genre.name) ??
    movie.genre_ids.map((genreId) => `Genre ${genreId}`);

  return (
    <div className="pb-16">
      <section className="relative isolate overflow-hidden">
        {backdrop ? (
          <div
            className="absolute inset-0 -z-10 bg-cover bg-center"
            style={{ backgroundImage: `url(${backdrop})` }}
          />
        ) : (
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-900 via-neutral-900 to-black" />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/95 via-black/80 to-black/30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />

        <div className="mx-auto max-w-[1600px] px-4 pb-10 pt-16 sm:px-6 lg:px-10">
          <Link
            href="/"
            className="text-xs font-medium text-ink-400 transition hover:text-ink-100"
          >
            ← Back to home
          </Link>

          <div className="mt-6 flex flex-col gap-8 lg:flex-row">
            <div className="w-[200px] shrink-0 sm:w-[260px]">
              <PosterImage
                path={movie.poster_path}
                title={movie.title}
                className="aspect-[2/3] rounded-2xl shadow-2xl"
                priority
                sizes="260px"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                {movie.title}
              </h1>

              {movie.tagline ? (
                <p className="mt-2 text-sm italic text-ink-300">{movie.tagline}</p>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-300">
                <span className="inline-flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-brand-500">
                    <path d="m12 3.6 2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 16.88l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L12 3.6Z" />
                  </svg>
                  {movie.vote_average.toFixed(1)}
                  <span className="text-ink-500">/ 10</span>
                </span>
                <span>{formatYear(movie.release_date)}</span>
                <span>{formatRuntime(movie.runtime)}</span>
                <span className="hidden sm:inline">{genreNames.slice(0, 3).join(" • ")}</span>
              </div>

              {movie.overview ? (
                <p className="mt-5 max-w-3xl text-sm leading-relaxed text-ink-200 sm:text-base">
                  {movie.overview}
                </p>
              ) : null}

              <div className="mt-7">
                <MovieActions movie={movie} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1600px] space-y-12 px-4 sm:px-6 lg:px-10">
        <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="mb-4 text-lg font-bold tracking-tight text-ink-100">Cast</h2>
            {movie.cast.length ? (
              <div className="scrollbar-none flex gap-4 overflow-x-auto pb-2">
                {movie.cast.map((person) => (
                  <Link
                    key={person.id}
                    href={`/search?q=${encodeURIComponent(person.name)}`}
                    className="group w-[92px] shrink-0 text-center"
                  >
                    <div className="relative mx-auto aspect-[2/3] w-[92px] overflow-hidden rounded-lg bg-ink-800 ring-1 ring-white/5 transition group-hover:ring-brand-600/60">
                      {person.profile_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                          alt={person.name}
                          fill
                          sizes="92px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-lg font-bold text-ink-400">
                          {person.name.slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <p className="mt-2 truncate text-xs font-semibold text-ink-200 group-hover:text-ink-100">
                      {person.name}
                    </p>
                    <p className="truncate text-[11px] text-ink-500">{person.character}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-400">Cast information is not available yet.</p>
            )}
          </div>

          <aside className="rounded-2xl border border-white/10 bg-ink-900/50 p-5">
            <h2 className="mb-4 text-lg font-bold tracking-tight text-ink-100">Details</h2>
            <dl className="space-y-3 text-sm">
              {[
                ["Status", movie.status || "—"],
                ["Release", formatYear(movie.release_date)],
                ["Runtime", formatRuntime(movie.runtime)],
                ["Genres", genreNames.join(", ") || "—"],
                ["Budget", formatMoney(movie.budget)],
                ["Revenue", formatMoney(movie.revenue)],
                [
                  "Director",
                  movie.crew.find((person) => person.job === "Director")?.name ?? "—",
                ],
                ["Language", movie.original_language.toUpperCase()],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <dt className="shrink-0 text-ink-500">{label}</dt>
                  <dd className="text-right font-medium text-ink-200">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-500">
                Your rating
              </p>
              <div className="mt-2 flex items-center gap-3">
                <StarRating value={Math.round(summary.average)} readOnly size={18} />
                <span className="text-sm text-ink-400">
                  {summary.count
                    ? `${summary.average.toFixed(1)} from ${summary.count} review${summary.count === 1 ? "" : "s"}`
                    : "No reviews yet"}
                </span>
              </div>
            </div>
          </aside>
        </section>

        <section>
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
        </section>

        {movie.similar.length ? (
          <MovieRow title="More like this" movies={movie.similar} />
        ) : null}

        {movie.recommendations.length ? (
          <MovieRow title="Recommended for you" movies={movie.recommendations} />
        ) : null}
      </div>
    </div>
  );
}
