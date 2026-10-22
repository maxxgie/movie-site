import "server-only";

import { FALLBACK_GENRES } from "@/data/genres";
import { SEED_MOVIES, findSeedMovie } from "@/data/seed";
import type { CastMember, CrewMember, Genre, Movie, MovieDetail, Trailer } from "@/lib/types";

// Read through an alias so the value is resolved at runtime rather than being
// inlined at build time (useful for proxies and local mocks).
const env = process.env;

const TMDB_BASE = (env.TMDB_BASE_URL?.trim() || "https://api.themoviedb.org/3").replace(
  /\/$/,
  "",
);

const API_KEY = env.TMDB_API_KEY?.trim();
const ACCESS_TOKEN = env.TMDB_ACCESS_TOKEN?.trim();

export function isTmdbConfigured() {
  return Boolean(API_KEY || ACCESS_TOKEN);
}

type QueryValue = string | number | boolean | undefined | null;

function buildUrl(path: string, params: Record<string, QueryValue> = {}) {
  const url = new URL(`${TMDB_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }
  if (API_KEY && !ACCESS_TOKEN) {
    url.searchParams.set("api_key", API_KEY);
  }
  return url;
}

async function tmdbFetch<T>(
  path: string,
  params: Record<string, QueryValue> = {},
  revalidate = 3600,
): Promise<T | null> {
  if (!isTmdbConfigured()) return null;

  try {
    const response = await fetch(buildUrl(path, params), {
      headers: ACCESS_TOKEN
        ? { Authorization: `Bearer ${ACCESS_TOKEN}`, accept: "application/json" }
        : { accept: "application/json" },
      next: { revalidate },
    });

    if (!response.ok) {
      console.error(`[tmdb] ${path} responded ${response.status}`);
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`[tmdb] ${path} failed`, error);
    return null;
  }
}

type TmdbMovie = Partial<Movie> & { id: number };

function normalise(movie: TmdbMovie): Movie {
  return {
    id: movie.id,
    title: movie.title ?? movie.original_title ?? "Untitled",
    original_title: movie.original_title ?? movie.title ?? "Untitled",
    overview: movie.overview ?? "",
    poster_path: movie.poster_path ?? null,
    backdrop_path: movie.backdrop_path ?? null,
    release_date: movie.release_date ?? "",
    vote_average: movie.vote_average ?? 0,
    vote_count: movie.vote_count ?? 0,
    genre_ids: movie.genre_ids ?? [],
    genres: movie.genres,
    original_language: movie.original_language ?? "en",
    adult: movie.adult ?? false,
    popularity: movie.popularity ?? 0,
  };
}

function pickTrailers(videos: { results?: TmdbVideo[] }): Trailer[] {
  const results = videos.results ?? [];
  return results
    .filter(
      (video) =>
        video.site === "YouTube" &&
        ["Trailer", "Teaser", "Official Trailer", "Clip"].includes(video.type),
    )
    .map((video) => ({
      key: video.key,
      name: video.name,
      site: video.site,
      type: video.type,
      official: video.official,
    }));
}

type TmdbVideo = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
};

type TmdbCredits = {
  cast?: { id: number; name: string; character: string; profile_path: string | null }[];
  crew?: { id: number; name: string; job: string; profile_path: string | null }[];
};

export async function getTrending(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: TmdbMovie[] }>("/trending/movie/week");
  if (data?.results?.length) return data.results.map(normalise);
  return SEED_MOVIES.slice(0, 12);
}

export async function getPopular(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: TmdbMovie[] }>("/movie/popular");
  if (data?.results?.length) return data.results.map(normalise);
  return SEED_MOVIES.slice(12, 24);
}

export async function getTopRated(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: TmdbMovie[] }>("/movie/top_rated");
  if (data?.results?.length) return data.results.map(normalise);
  return [...SEED_MOVIES].sort((a, b) => b.vote_average - a.vote_average).slice(0, 12);
}

export async function getNowPlaying(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: TmdbMovie[] }>("/movie/now_playing");
  if (data?.results?.length) return data.results.map(normalise);
  return SEED_MOVIES.slice(0, 10);
}

export async function getUpcoming(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: TmdbMovie[] }>("/movie/upcoming");
  if (data?.results?.length) return data.results.map(normalise);
  return SEED_MOVIES.slice(10, 20);
}

export async function getGenres(): Promise<Genre[]> {
  const data = await tmdbFetch<{ genres?: Genre[] }>("/genre/movie/list", {}, 86400);
  if (data?.genres?.length) return data.genres;
  return FALLBACK_GENRES;
}

export async function getMovieById(id: number): Promise<MovieDetail | null> {
  const data = await tmdbFetch<TmdbMovieDetail>(`/movie/${id}`, {
    append_to_response: "credits,videos,images,similar,recommendations",
  });

  if (data) {
    const credits = (data.credits ?? {}) as TmdbCredits;
    const cast: CastMember[] = (credits.cast ?? []).slice(0, 18).map((person) => ({
      id: person.id,
      name: person.name,
      character: person.character,
      profile_path: person.profile_path,
    }));
    const crew: CrewMember[] = (credits.crew ?? [])
      .filter((person) => ["Director", "Writer", "Screenplay"].includes(person.job))
      .slice(0, 8)
      .map((person) => ({
        id: person.id,
        name: person.name,
        job: person.job,
        profile_path: person.profile_path,
      }));

    const logos = data.images?.logos ?? [];

    return {
      ...normalise(data),
      tagline: data.tagline ?? "",
      runtime: data.runtime ?? 0,
      status: data.status ?? "",
      budget: data.budget ?? 0,
      revenue: data.revenue ?? 0,
      homepage: data.homepage ?? null,
      imdb_id: data.imdb_id ?? null,
      cast,
      crew,
      trailers: pickTrailers(data.videos ?? {}),
      similar: (data.similar?.results ?? []).map(normalise),
      recommendations: (data.recommendations?.results ?? []).map(normalise),
      logo_path: logos[0]?.file_path ?? null,
    };
  }

  const seed = findSeedMovie(id);
  if (!seed) return null;

  return {
    ...seed,
    tagline: "",
    runtime: 0,
    status: "Released",
    budget: 0,
    revenue: 0,
    homepage: null,
    imdb_id: null,
    cast: [],
    crew: [],
    trailers: [],
    similar: SEED_MOVIES.filter((movie) => movie.id !== id).slice(0, 6),
    recommendations: SEED_MOVIES.filter((movie) => movie.id !== id).slice(0, 6),
    logo_path: null,
  };
}

type TmdbMovieDetail = Partial<Movie> & {
  id: number;
  title?: string;
  tagline?: string;
  runtime?: number;
  status?: string;
  budget?: number;
  revenue?: number;
  homepage?: string | null;
  imdb_id?: string | null;
  credits?: TmdbCredits;
  videos?: { results?: TmdbVideo[] };
  images?: { logos?: { file_path: string }[] };
  similar?: { results: TmdbMovie[] };
  recommendations?: { results: TmdbMovie[] };
};

export type SearchFilters = {
  query?: string;
  genre?: number;
  year?: number;
  minRating?: number;
  sort?: string;
  page?: number;
};

export type SearchResult = {
  results: Movie[];
  totalPages: number;
  totalResults: number;
};

export async function searchMovies(filters: SearchFilters): Promise<SearchResult> {
  const page = Math.max(1, filters.page ?? 1);
  const query = filters.query?.trim();

  if (!query) {
    const data = await tmdbFetch<{
      results: TmdbMovie[];
      total_pages: number;
      total_results: number;
    }>("/discover/movie", {
      page,
      with_genres: filters.genre,
      primary_release_year: filters.year,
      "vote_average.gte": filters.minRating || undefined,
      "vote_count.gte": filters.minRating ? 200 : undefined,
      sort_by: filters.sort || "popularity.desc",
      include_adult: false,
    });

    if (data) {
      return {
        results: data.results.map(normalise),
        totalPages: Math.min(data.total_pages ?? 1, 500),
        totalResults: data.total_results ?? data.results.length,
      };
    }

    let results = SEED_MOVIES;
    if (filters.genre) results = results.filter((m) => m.genre_ids.includes(filters.genre!));
    if (filters.year) results = results.filter((m) => m.release_date.startsWith(String(filters.year)));
    if (filters.minRating) results = results.filter((m) => m.vote_average >= filters.minRating!);

    return { results, totalPages: 1, totalResults: results.length };
  }

  const data = await tmdbFetch<{
    results: TmdbMovie[];
    total_pages: number;
    total_results: number;
  }>("/search/movie", {
    query,
    page,
    include_adult: false,
    primary_release_year: filters.year,
  });

  let results = (data?.results ?? []).map(normalise);

  if (filters.genre) results = results.filter((m) => m.genre_ids.includes(filters.genre!));
  if (filters.minRating) results = results.filter((m) => m.vote_average >= filters.minRating!);

  if (!data) {
    const lowered = query.toLowerCase();
    results = SEED_MOVIES.filter((movie) => movie.title.toLowerCase().includes(lowered));
  }

  return {
    results,
    totalPages: Math.min(data?.total_pages ?? 1, 500),
    totalResults: data?.total_results ?? results.length,
  };
}

