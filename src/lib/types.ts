export type Genre = {
  id: number;
  name: string;
};

export type Movie = {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  genres?: Genre[];
  original_language: string;
  adult: boolean;
  popularity?: number;
};

export type CastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

export type CrewMember = {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
};

export type Trailer = {
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
};

export type MovieDetail = Movie & {
  tagline?: string;
  runtime: number;
  status: string;
  budget: number;
  revenue: number;
  homepage?: string | null;
  imdb_id?: string | null;
  cast: CastMember[];
  crew: CrewMember[];
  trailers: Trailer[];
  similar: Movie[];
  recommendations: Movie[];
  logo_path: string | null;
};

export type Review = {
  id: string;
  movieId: number;
  movieTitle: string;
  posterPath: string | null;
  userName: string;
  rating: number;
  body: string;
  createdAt: string;
};

export type ReviewSummary = {
  count: number;
  average: number;
  distribution: Record<number, number>;
};
