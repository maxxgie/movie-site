"use client";

import { useState } from "react";

export function DeleteReviewButton({ id, onDeleted }: { id: string; onDeleted: () => void }) {
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    setBusy(true);
    try {
      await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      onDeleted();
    } catch {
      // ignore - list refreshes on next load
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={remove}
      disabled={busy}
      aria-label="Delete review"
      className="rounded-lg p-2 text-ink-500 transition hover:bg-white/10 hover:text-brand-500 disabled:opacity-50"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-.8 13a2 2 0 0 1-2 1.9H7.8a2 2 0 0 1-2-1.9L5 6" />
      </svg>
    </button>
  );
}
