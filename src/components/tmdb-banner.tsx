"use client";

import { createJsonStore, useJsonStore } from "@/lib/storage";

const store = createJsonStore<boolean>("movie-site:tmdb-banner-dismissed", false);

export function TmdbBanner() {
  const [dismissed, setDismissed] = useJsonStore(store, true);

  if (dismissed) return null;

  return (
    <div className="border-b border-brand-600/30 bg-brand-600/10 px-4 py-3 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-[1600px] items-start gap-3">
        <p className="flex-1 text-xs leading-relaxed text-ink-200">
          <span className="font-bold text-brand-400">Heads up:</span> no TMDB API key is
          configured, so the site is showing the bundled sample catalog. Add{" "}
          <code className="rounded bg-black/40 px-1 py-0.5 font-mono text-[11px] text-brand-400">
            TMDB_API_KEY
          </code>{" "}
          to <code className="font-mono text-[11px]">.env.local</code> and restart to load the full
          catalogue.
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-ink-300 transition hover:bg-white/10 hover:text-ink-100"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
