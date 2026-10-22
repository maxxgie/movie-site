import type { Metadata } from "next";

import { ReviewsWall } from "@/components/reviews-wall";
import { getReviews } from "@/lib/reviews-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Every review written on the site.",
};

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-10">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-ink-100">Reviews</h1>
        <p className="mt-1.5 text-sm text-ink-400">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"} written on this site.
        </p>
      </header>

      <ReviewsWall initialReviews={reviews} />
    </div>
  );
}
