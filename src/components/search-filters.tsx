"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

import { RATING_OPTIONS, SORT_OPTIONS, YEAR_RANGE } from "@/data/genres";
import type { Genre } from "@/lib/types";

type SearchFiltersProps = {
  genres: Genre[];
  showQuery?: boolean;
  totalResults?: number;
};

const selectClass =
  "rounded-lg border border-white/10 bg-ink-900/70 px-3 py-2 text-sm font-medium text-ink-200 transition focus:border-brand-600 focus:outline-none";

export function SearchFilters({ genres, showQuery = true, totalResults }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryRef = useRef<HTMLInputElement>(null);

  const currentQuery = searchParams.get("q") ?? "";

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    const next = params.toString();
    router.push(next ? `?${next}` : window.location.pathname);
  };

  const submitQuery = (event: React.FormEvent) => {
    event.preventDefault();
    update("q", (queryRef.current?.value ?? "").trim());
  };

  const years = Array.from(
    { length: YEAR_RANGE.max - YEAR_RANGE.min + 1 },
    (_, index) => YEAR_RANGE.max - index,
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {showQuery ? (
          <form onSubmit={submitQuery} className="relative min-w-[220px] flex-1 sm:max-w-sm">
            <span className="sr-only">Search movies</span>
            <input
              key={currentQuery}
              ref={queryRef}
              type="search"
              defaultValue={currentQuery}
              placeholder="Search movies..."
              className="w-full rounded-lg border border-white/10 bg-ink-900/70 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-500 focus:border-brand-600 focus:outline-none"
            />
          </form>
        ) : null}

        <select
          value={searchParams.get("genre") ?? ""}
          onChange={(event) => update("genre", event.target.value)}
          aria-label="Genre"
          className={selectClass}
        >
          <option value="">All genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>

        <select
          value={searchParams.get("year") ?? ""}
          onChange={(event) => update("year", event.target.value)}
          aria-label="Release year"
          className={selectClass}
        >
          <option value="">Any year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          value={searchParams.get("rating") ?? ""}
          onChange={(event) => update("rating", event.target.value)}
          aria-label="Minimum rating"
          className={selectClass}
        >
          {RATING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={searchParams.get("sort") ?? "popularity.desc"}
          onChange={(event) => update("sort", event.target.value)}
          aria-label="Sort by"
          className={selectClass}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {typeof totalResults === "number" ? (
        <p className="text-xs text-ink-400">
          {totalResults.toLocaleString()} {totalResults === 1 ? "result" : "results"}
        </p>
      ) : null}
    </div>
  );
}
