import { NextResponse } from "next/server";

import { addReview, getReviews } from "@/lib/reviews-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const movieIdParam = searchParams.get("movieId");
  const movieId = movieIdParam ? Number(movieIdParam) : undefined;

  const reviews = await getReviews(Number.isFinite(movieId) ? movieId : undefined);
  return NextResponse.json({ reviews });
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const body = payload as Partial<{
    movieId: number;
    movieTitle: string;
    posterPath: string | null;
    userName: string;
    rating: number;
    body: string;
  }>;

  const movieId = Number(body.movieId);
  const movieTitle = String(body.movieTitle ?? "").trim();
  const rating = Number(body.rating);
  const text = String(body.body ?? "").trim();
  const userName = String(body.userName ?? "").trim();

  if (!Number.isFinite(movieId) || movieId <= 0) {
    return NextResponse.json({ error: "A valid movieId is required." }, { status: 400 });
  }
  if (!movieTitle) {
    return NextResponse.json({ error: "A movieTitle is required." }, { status: 400 });
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
  }
  if (text.length < 3) {
    return NextResponse.json({ error: "Please write a little more about the movie." }, { status: 400 });
  }
  if (text.length > 2000) {
    return NextResponse.json({ error: "Reviews are limited to 2000 characters." }, { status: 400 });
  }

  try {
    const review = await addReview({
      movieId,
      movieTitle,
      posterPath: body.posterPath ?? null,
      userName: userName.slice(0, 40) || "Anonymous",
      rating: Math.round(rating),
      body: text,
    });
    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("[reviews] failed to persist review", error);
    return NextResponse.json(
      { error: "Could not save the review on this host. Check that the data directory is writable." },
      { status: 500 },
    );
  }
}
