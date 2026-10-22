"use client";

import Link from "next/link";

import { PosterImage } from "@/components/poster-image";
import { formatYear } from "@/lib/utils";
import { useWatchlist } from "@/providers/watchlist-provider";

export function MyListView() {
  const { items, remove } = useWatchlist();

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 px-6 py-24 text-center">
        <h2 className="text-xl font-bold text-ink-100">Your list is empty</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-400">
          Tap the + badge on any poster to save a movie here. Your list is stored in this browser,
          so it stays with you on whichever device you sign in from.
        </p>
        <Link
          href="/browse"
          className="mt-6 inline-block rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-500"
        >
          Browse movies
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
      {items.map((item) => (
        <article key={item.id} className="group relative">
          <Link href={`/movie/${item.id}`}>
            <div className="relative overflow-hidden rounded-xl ring-1 ring-white/5 transition duration-300 group-hover:ring-brand-600/60 group-hover:shadow-glow">
              <PosterImage
                path={item.posterPath}
                title={item.title}
                className="aspect-[2/3]"
                sizes="(max-width: 640px) 42vw, (max-width: 1024px) 22vw, 195px"
                imageClassName="transition duration-500 group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition duration-300 group-hover:opacity-100">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white/95 text-black shadow-xl">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.3-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
                  </svg>
                </span>
              </span>
            </div>
            <div className="mt-2.5 px-0.5">
              <h3 className="truncate text-sm font-semibold text-ink-100">{item.title}</h3>
              <p className="mt-0.5 flex items-center gap-2 text-xs text-ink-400">
                <span>{formatYear(item.releaseDate)}</span>
                {item.voteAverage > 0 ? (
                  <>
                    <span className="text-ink-600">•</span>
                    <span className="inline-flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-brand-500">
                        <path d="m12 3.6 2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 16.88l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L12 3.6Z" />
                      </svg>
                      {item.voteAverage.toFixed(1)}
                    </span>
                  </>
                ) : null}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => remove(item.id)}
            aria-label={`Remove ${item.title} from my list`}
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-black/70 text-ink-200 opacity-0 backdrop-blur transition hover:bg-black hover:text-brand-500 group-hover:opacity-100"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </article>
      ))}
    </div>
  );
}
