import type { Movie } from "@/lib/types";

/**
 * Bundled catalog used when no TMDB API key is configured (or when TMDB is
 * unreachable). Ids are real TMDB movie ids, so the entries automatically
 * upgrade to live TMDB data as soon as a key is present.
 */
type Seed = {
  id: number;
  title: string;
  year: number;
  overview: string;
  genres: number[];
  runtime: number;
  vote_average: number;
};

const SEEDS: Seed[] = [
  {
    id: 550,
    title: "Fight Club",
    year: 1999,
    overview:
      "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
    genres: [18, 53],
    runtime: 139,
    vote_average: 8.4,
  },
  {
    id: 680,
    title: "Pulp Fiction",
    year: 1994,
    overview:
      "A burger-loving hit man, a philosophical hit-woman and a drug-addled gangster's most bizarre story ever told.",
    genres: [53, 80],
    runtime: 154,
    vote_average: 8.5,
  },
  {
    id: 13,
    title: "Forrest Gump",
    year: 1994,
    overview:
      "A man with a low IQ accomplishes great things in life while dealing with the consequences of his childhood.",
    genres: [18, 10749],
    runtime: 142,
    vote_average: 8.5,
  },
  {
    id: 278,
    title: "The Shawshank Redemption",
    year: 1994,
    overview:
      "Imprisoned for a crime he did not commit, banker Andy Dufresne forms an unlikely friendship with fellow inmate Red.",
    genres: [18, 80],
    runtime: 142,
    vote_average: 8.7,
  },
  {
    id: 238,
    title: "The Godfather",
    year: 1972,
    overview:
      "The ageing patriarch of an organised crime dynasty transfers control of his empire to his reluctant son.",
    genres: [18, 80],
    runtime: 175,
    vote_average: 8.7,
  },
  {
    id: 424,
    title: "Schindler's List",
    year: 1993,
    overview:
      "In German-occupied Poland, Oskar Schindler becomes concerned for his Jewish workforce and uses his money and influence to save them.",
    genres: [18, 36, 10752],
    runtime: 195,
    vote_average: 8.6,
  },
  {
    id: 389,
    title: "12 Angry Men",
    year: 1957,
    overview:
      "A jury holdout attempts to prevent a miscarriage of justice by forcing colleagues to reconsider the evidence.",
    genres: [18],
    runtime: 97,
    vote_average: 8.5,
  },
  {
    id: 155,
    title: "The Dark Knight",
    year: 2008,
    overview:
      "Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and DA Harvey Dent.",
    genres: [18, 28, 80, 53],
    runtime: 152,
    vote_average: 8.5,
  },
  {
    id: 27205,
    title: "Inception",
    year: 2010,
    overview:
      "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
    genres: [28, 878, 12],
    runtime: 148,
    vote_average: 8.4,
  },
  {
    id: 496243,
    title: "Parasite",
    year: 2019,
    overview:
      "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood.",
    genres: [35, 53, 18],
    runtime: 132,
    vote_average: 8.5,
  },
  {
    id: 157336,
    title: "Interstellar",
    year: 2014,
    overview:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    genres: [12, 18, 878],
    runtime: 169,
    vote_average: 8.5,
  },
  {
    id: 299534,
    title: "Avengers: Endgame",
    year: 2019,
    overview:
      "After the devastating events of Infinity War, the remaining Avengers assemble once more to reverse Thanos' actions.",
    genres: [12, 878, 28],
    runtime: 181,
    vote_average: 8.3,
  },
  {
    id: 244786,
    title: "The Avengers",
    year: 2012,
    overview:
      "Earth's mightiest heroes must learn to fight together to stop a global threat.",
    genres: [12, 878, 28],
    runtime: 143,
    vote_average: 7.7,
  },
  {
    id: 862,
    title: "Toy Story",
    year: 1995,
    overview:
      "A cowboy doll is threatened when a new spaceman action figure supplants him.",
    genres: [16, 10751, 35],
    runtime: 81,
    vote_average: 8,
  },
  {
    id: 128,
    title: "The Lord of the Rings: The Fellowship of the Ring",
    year: 2001,
    overview:
      "A meek Hobbit and eight companions set out to destroy the One Ring.",
    genres: [12, 14, 28],
    runtime: 178,
    vote_average: 8.3,
  },
  {
    id: 120,
    title: "The Lord of the Rings: The Two Towers",
    year: 2002,
    overview:
      "While Frodo and Sam edge closer to Mordor, the divided fellowship makes a stand.",
    genres: [12, 14, 28],
    runtime: 179,
    vote_average: 8.2,
  },
  {
    id: 121,
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
    overview:
      "Gandalf and Aragorn lead the World of Men against Sauron's army.",
    genres: [12, 14, 28],
    runtime: 201,
    vote_average: 8.3,
  },
  {
    id: 941,
    title: "Mad Max: Fury Road",
    year: 2015,
    overview:
      "An apocalyptic story set in the furthest reaches of our planet, in a stark desert landscape.",
    genres: [28, 12],
    runtime: 120,
    vote_average: 7.6,
  },
  {
    id: 245891,
    title: "John Wick",
    year: 2014,
    overview:
      "A hitman comes out of retirement to take on the crew of a crime boss who murdered his dog.",
    genres: [28, 80, 53],
    runtime: 101,
    vote_average: 7.4,
  },
  {
    id: 205596,
    title: "The Imitation Game",
    year: 2014,
    overview:
      "During World War II, the British secret service recruits Alan Turing to break the Nazi Enigma code.",
    genres: [18, 36, 9648],
    runtime: 113,
    vote_average: 8.2,
  },
  {
    id: 769,
    title: "GoodFellas",
    year: 1990,
    overview:
      "The story of Henry Hill and his life in the mafia, covering his relationship with his wife and partners.",
    genres: [18, 80],
    runtime: 145,
    vote_average: 8.5,
  },
  {
    id: 637,
    title: "Life Is Beautiful",
    year: 1997,
    overview:
      "A Jewish father sets out to make sure his son does not know the horrors of the Holocaust.",
    genres: [18, 35],
    runtime: 116,
    vote_average: 8.5,
  },
  {
    id: 1124,
    title: "The Prestige",
    year: 2006,
    overview:
      "Two stage magicians engage in a bitter rivalry to create the ultimate illusion.",
    genres: [18, 878, 9648],
    runtime: 130,
    vote_average: 8.2,
  },
  {
    id: 807,
    title: "Se7en",
    year: 1995,
    overview:
      "Two detectives hunt a serial killer who uses the seven deadly sins in his work.",
    genres: [9648, 80, 53],
    runtime: 127,
    vote_average: 8.3,
  },
  {
    id: 78,
    title: "Blade Runner",
    year: 1982,
    overview:
      "In the smog-choked dystopian Los Angeles of 2019, blade runner Rick Deckard is called out of retirement to terminate a quartet of replicants.",
    genres: [878, 18, 53],
    runtime: 117,
    vote_average: 7.9,
  },
  {
    id: 348,
    title: "Alien",
    year: 1979,
    overview:
      "The crew of a commercial spacecraft encounters a deadly lifeform after investigating an unknown transmission.",
    genres: [27, 878],
    runtime: 117,
    vote_average: 8.5,
  },
  {
    id: 105,
    title: "Back to the Future",
    year: 1985,
    overview:
      "A teenager is accidentally sent thirty years into the past in a time-travelling DeLorean.",
    genres: [878, 12, 35],
    runtime: 116,
    vote_average: 8.5,
  },
  {
    id: 280,
    title: "Terminator 2: Judgment Day",
    year: 1991,
    overview:
      "A cyborg from the future attempts to protect a young boy and his mother from a robotic assassin.",
    genres: [28, 53, 878],
    runtime: 138,
    vote_average: 8.6,
  },
  {
    id: 4935,
    title: "Howl's Moving Castle",
    year: 2004,
    overview:
      "A young woman cursed with an old body seeks out a wizard and lives in a giant moving castle.",
    genres: [14, 16, 12],
    runtime: 119,
    vote_average: 8.4,
  },
  {
    id: 118340,
    title: "Guardians of the Galaxy",
    year: 2014,
    overview:
      "A group of intergalactic criminals must pull together to stop a fanatical warrior with a mind to destroy the galaxy.",
    genres: [12, 28, 878],
    runtime: 121,
    vote_average: 8,
  },
  {
    id: 429,
    title: "The Goodfellas",
    year: 1990,
    overview:
      "A group of friends from New York turn to a life of crime, mafia ties and betrayal.",
    genres: [18, 80],
    runtime: 145,
    vote_average: 8.5,
  },
];

export const SEED_MOVIES: Movie[] = SEEDS.map((seed) => ({
  id: seed.id,
  title: seed.title,
  original_title: seed.title,
  overview: seed.overview,
  poster_path: null,
  backdrop_path: null,
  release_date: `${seed.year}-01-01`,
  vote_average: seed.vote_average,
  vote_count: 1000,
  genre_ids: seed.genres,
  original_language: "en",
  adult: false,
  popularity: seed.vote_average * 100,
}));

export function findSeedMovie(id: number) {
  return SEED_MOVIES.find((movie) => movie.id === id);
}
