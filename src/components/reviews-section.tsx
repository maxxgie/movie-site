"use client";

import { useCallback, useState } from "react";

import { ReviewForm } from "@/components/review-form";
import { StarRating } from "@/components/star-rating";
import { formatRelativeTime } from "@/lib/utils";
import type { Review, ReviewSummary } from "@/lib/types";

type ReviewsSectionProps = {
  movieId: number;
  movieTitle: string;
  posterPath: string | null;
  initialReviews: Review[];
  initialSummary: ReviewSummary;
};

export function ReviewsSection({
  movieId,
  movieTitle,
  posterPath,
  initialReviews,
  initialSummary,
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [summary, setSummary] = useState(initialSummary);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const response = await fetch(`/api/reviews?movieId=${movieId}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) return;

      setReviews(data.reviews ?? []);

      const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let total = 0;
      for (const review of data.reviews ?? []) {
        distribution[review.rating] = (distribution[review.rating] ?? 0) + 1;
        total += review.rating;
      }
      setSummary({
        count: (data.reviews ?? []).length,
        average: (data.reviews ?? []).length ? total / (data.reviews ?? []).length : 0,
        distribution,
      });
    } catch {
      // Keep the server-rendered list if the refresh fails.
    }
  }, [movieId]);

  const remove = async (id: string) => {
    setError("");
    try {
      const response = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data?.error ?? "Could not delete that review.");
        return;
      }
      setReviews((current) => current.filter((review) => review.id !== id));
      void refresh();
    } catch {
      setError("Network error while deleting.");
    }
  };

  return (
    <section id="reviews" className="space-y-6">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-black text-ink-100">
            {summary.count ? summary.average.toFixed(1) : "—"}
          </span>
          <div>
            <StarRating value={Math.round(summary.average)} readOnly size={16} />
            <p className="mt-1 text-xs text-ink-400">
              {summary.count} {summary.count === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>

        {summary.count > 0 ? (
          <div className="hidden flex-1 flex-col gap-1 sm:flex">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = summary.distribution[star] ?? 0;
              const percent = summary.count ? (count / summary.count) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-[11px] text-ink-400">
                  <span className="w-3">{star}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-brand-600" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="w-5 text-right tabular-nums">{count}</span>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      <ReviewForm
        movieId={movieId}
        movieTitle={movieTitle}
        posterPath={posterPath}
        onCreated={refresh}
      />

      {error ? <p className="text-xs text-brand-400">{error}</p> : null}

      {reviews.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/10 px-5 py-8 text-center text-sm text-ink-400">
          No reviews yet - be the first to write one.
        </p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="rounded-2xl border border-white/10 bg-ink-900/50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-600/20 text-sm font-bold text-brand-400">
                      {(review.userName || "A").slice(0, 1).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink-100">{review.userName}</p>
                      <p className="text-[11px] text-ink-500">{formatRelativeTime(review.createdAt)}</p>
                    </div>
                  </div>
                  <StarRating value={review.rating} readOnly size={14} className="mt-2.5" />
                </div>

                <button
                  type="button"
                  onClick={() => remove(review.id)}
                  aria-label="Delete review"
                  className="rounded-lg p-2 text-ink-500 transition hover:bg-white/10 hover:text-brand-500"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-.8 13a2 2 0 0 1-2 1.9H7.8a2 2 0 0 1-2-1.9L5 6" />
                  </svg>
                </button>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-200">{review.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
