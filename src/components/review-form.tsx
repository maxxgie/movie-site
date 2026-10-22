"use client";

import { useState } from "react";

import { StarRating } from "@/components/star-rating";

type ReviewFormProps = {
  movieId: number;
  movieTitle: string;
  posterPath: string | null;
  onCreated: () => void;
};

export function ReviewForm({ movieId, movieTitle, posterPath, onCreated }: ReviewFormProps) {
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (rating < 1) {
      setStatus("error");
      setMessage("Pick a star rating first.");
      return;
    }
    if (body.trim().length < 3) {
      setStatus("error");
      setMessage("Write a few words about the movie.");
      return;
    }

    setStatus("saving");
    setMessage("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId, movieTitle, posterPath, userName, rating, body }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data?.error ?? "Could not save your review.");
        return;
      }

      setBody("");
      setRating(0);
      setStatus("idle");
      onCreated();
    } catch {
      setStatus("error");
      setMessage("Network error - please try again.");
    }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-ink-900/60 p-5">
      <h3 className="text-base font-bold text-ink-100">Write a review</h3>
      <p className="mt-1 text-xs text-ink-400">
        Share what you thought of <span className="text-ink-200">{movieTitle}</span>.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-ink-400">Your rating</span>
          <StarRating value={rating} onChange={setRating} size={20} />
        </div>

        <input
          type="text"
          value={userName}
          onChange={(event) => setUserName(event.target.value)}
          placeholder="Your name (optional)"
          maxLength={40}
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-ink-950/70 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-500 focus:border-brand-600 focus:outline-none"
        />
      </div>

      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={4}
        maxLength={2000}
        placeholder="What worked? What didn't? No spoilers for the ending, please."
        className="mt-3 w-full resize-y rounded-lg border border-white/10 bg-ink-950/70 px-3 py-2.5 text-sm text-ink-100 placeholder:text-ink-500 focus:border-brand-600 focus:outline-none"
      />

      <div className="mt-3 flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-bold text-ink-100 transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "saving" ? "Posting..." : "Post review"}
        </button>

        {message ? (
          <span className={status === "error" ? "text-xs text-brand-400" : "text-xs text-emerald-400"}>
            {message}
          </span>
        ) : null}
      </div>
    </form>
  );
}
