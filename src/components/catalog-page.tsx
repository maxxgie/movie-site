import { Suspense } from "react";

import { MovieCard } from "@/components/movie-card";
import { Pagination } from "@/components/pagination";
import { SearchFilters } from "@/components/search-filters";
import { getGenres, searchMovies } from "@/lib/tmdb";

export type CatalogSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

type CatalogPageProps = {
  searchParams: Promise<CatalogSearchParams>;
  heading: string;
  subheading: string;
  showQuery: boolean;
};

export async function CatalogPage({
  searchParams,
  heading,
  subheading,
  showQuery,
}: CatalogPageProps) {
  const params = await searchParams;

  const query = first(params.q)?.trim();
  const genre = Number(first(params.genre)) || undefined;
  const year = Number(first(params.year)) || undefined;
  const minRating = Number(first(params.rating)) || undefined;
  const sort = first(params.sort);
  const page = Math.max(1, Number(first(params.page)) || 1);

  const [genres, result] = await Promise.all([
    getGenres(),
    searchMovies({ query, genre, year, minRating, sort, page }),
  ]);

  const cleanParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    const single = first(value);
    if (single) cleanParams[key] = single;
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10">
      <header className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-ink-100">{heading}</h1>
        <p className="mt-1.5 text-sm text-ink-400">{subheading}</p>
      </header>

      <div className="mb-8">
        <Suspense fallback={<div className="h-10" />}>
          <SearchFilters
            genres={genres}
            showQuery={showQuery}
            totalResults={result.totalResults}
          />
        </Suspense>
      </div>

      {result.results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 px-6 py-20 text-center">
          <h2 className="text-lg font-bold text-ink-100">Nothing matched that search</h2>
          <p className="mt-1.5 text-sm text-ink-400">
            Try a different title, or loosen the genre, year and rating filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          {result.results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={result.totalPages} params={cleanParams} />
    </div>
  );
}
