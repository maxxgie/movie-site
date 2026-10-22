"use client";

import Link from "next/link";
import { useState } from "react";

import { DeleteReviewButton } from "@/components/delete-review-button";
import { PosterImage } from "@/components/poster-image";
import { StarRating } from "@/components/star-rating";
import { formatRelativeTime } from "@/lib/utils";
import type { Review } from "@/lib/types";

export function ReviewsWall({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState(initialReviews);

  if (!reviews.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 px-6 py-24 text-center">
        <h2 className="text-xl font-bold text-ink-100">No reviews yet</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-400">
          Open any movie and leave the first review. Everyone who visits will see it here.
        </p>
        <Link
          href="/browse"
          className="mt-6 inline-block rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-500"
        >
          Find a movie
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <li
          key={review.id}
          className="rounded-2xl border border-white/10 bg-ink-900/50 p-5 transition hover:border-white/20"
        >
          <div className="flex items-start gap-4">
            <Link href={`/movie/${review.movieId}`} className="shrink-0">
              <PosterImage
                path={review.posterPath}
                title={review.movieTitle}
                className="h-24 w-16 rounded-lg"
                sizes="64px"
              />
            </Link>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/movie/${review.movieId}`}
                    className="text-base font-bold text-ink-100 transition hover:text-brand-500"
                  >
                    {review.movieTitle}
                  </Link>
                  <p className="mt-0.5 text-xs text-ink-500">
                    {review.userName} • {formatRelativeTime(review.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <StarRating value={review.rating} readOnly size={14} />
                  <DeleteReviewButton
                    id={review.id}
                    onDeleted={() =>
                      setReviews((current) => current.filter((entry) => entry.id !== review.id))
                    }
                  />
                </div>
              </div>

              <p className="mt-2.5 whitespace-pre-wrap text-sm leading-relaxed text-ink-200">
                {review.body}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
