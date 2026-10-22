import Link from "next/link";

import { ContinueWatching } from "@/components/continue-watching";
import { Hero } from "@/components/hero";
import { MovieRow } from "@/components/movie-row";
import { TmdbBanner } from "@/components/tmdb-banner";
import {
  getGenres,
  getMovieById,
  getNowPlaying,
  getPopular,
  getTopRated,
  getTrending,
  getUpcoming,
  isTmdbConfigured,
} from "@/lib/tmdb";

export const revalidate = 3600;

export default async function HomePage() {
  const [trending, popular, topRated, nowPlaying, upcoming, genres] = await Promise.all([
    getTrending(),
    getPopular(),
    getTopRated(),
    getNowPlaying(),
    getUpcoming(),
    getGenres(),
  ]);

  const featured = trending[0] ? await getMovieById(trending[0].id) : null;

  return (
    <div className="pb-16">
      {!isTmdbConfigured() ? <TmdbBanner /> : null}

      {featured ? <Hero movie={featured} /> : null}

      <div className="mt-8 space-y-10">
        <ContinueWatching />

        <MovieRow title="Trending Now" movies={trending} href="/browse?sort=popularity.desc" />
        <MovieRow title="Popular This Week" movies={popular} href="/browse" />
        <MovieRow title="Top Rated" movies={topRated} href="/browse?sort=vote_average.desc" />
        <MovieRow title="In Theaters" movies={nowPlaying} href="/browse" />
        <MovieRow title="Coming Soon" movies={upcoming} href="/browse" />
      </div>

      <section className="mt-14 px-4 sm:px-6 lg:px-10">
        <h2 className="mb-3 text-lg font-bold tracking-tight text-ink-100 sm:text-xl">
          Browse by Genre
        </h2>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <Link
              key={genre.id}
              href={`/browse?genre=${genre.id}`}
              className="rounded-full border border-white/10 bg-ink-900/60 px-4 py-1.5 text-sm font-medium text-ink-300 transition hover:border-brand-600 hover:bg-brand-600/10 hover:text-brand-400"
            >
              {genre.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
