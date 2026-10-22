import { promises as fs } from "node:fs";
import path from "node:path";

import type { Review, ReviewSummary } from "@/lib/types";

// Read through an alias so DATA_DIR can be changed at runtime (e.g. in Docker)
// instead of being frozen into the build.
const env = process.env;

const DATA_DIR = env.DATA_DIR ?? path.join(process.cwd(), "data");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");

let cache: Review[] | null = null;
let writeChain: Promise<unknown> = Promise.resolve();

async function readAll(): Promise<Review[]> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(REVIEWS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    cache = Array.isArray(parsed) ? (parsed as Review[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

async function writeAll(reviews: Review[]) {
  cache = reviews;
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf8");
}

function queue<T>(task: () => Promise<T>): Promise<T> {
  const next = writeChain.then(task, task);
  writeChain = next.catch(() => undefined);
  return next;
}

export async function getReviews(movieId?: number): Promise<Review[]> {
  const reviews = await readAll();
  const filtered =
    typeof movieId === "number" ? reviews.filter((review) => review.movieId === movieId) : reviews;
  return [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export type NewReview = {
  movieId: number;
  movieTitle: string;
  posterPath?: string | null;
  userName?: string;
  rating: number;
  body: string;
};

export async function addReview(input: NewReview): Promise<Review> {
  return queue(async () => {
    const reviews = await readAll();
    const review: Review = {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      movieId: input.movieId,
      movieTitle: input.movieTitle,
      posterPath: input.posterPath ?? null,
      userName: input.userName?.trim() || "Anonymous",
      rating: input.rating,
      body: input.body.trim(),
      createdAt: new Date().toISOString(),
    };
    await writeAll([review, ...reviews]);
    return review;
  });
}

export async function deleteReview(id: string): Promise<boolean> {
  return queue(async () => {
    const reviews = await readAll();
    const next = reviews.filter((review) => review.id !== id);
    if (next.length === reviews.length) return false;
    await writeAll(next);
    return true;
  });
}

export async function summariseReviews(movieId: number): Promise<ReviewSummary> {
  const reviews = await getReviews(movieId);
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let total = 0;

  for (const review of reviews) {
    distribution[review.rating] = (distribution[review.rating] ?? 0) + 1;
    total += review.rating;
  }

  return {
    count: reviews.length,
    average: reviews.length ? total / reviews.length : 0,
    distribution,
  };
}
