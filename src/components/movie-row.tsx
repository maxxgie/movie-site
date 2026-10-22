"use client";

import { useRef } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { MovieCard } from "@/components/movie-card";
import type { Movie } from "@/lib/types";

type MovieRowProps = {
  title: string;
  movies: Movie[];
  href?: string;
};

export function MovieRow({ title, movies, href }: MovieRowProps) {
  const scroller = useRef<HTMLDivElement>(null);

  if (!movies.length) return null;

  const scroll = (direction: 1 | -1) => {
    const node = scroller.current;
    if (!node) return;
    const amount = Math.max(node.clientWidth * 0.8, 320);
    node.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  return (
    <section className="group/row relative">
      <div className="mb-3 flex items-baseline justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <h2 className="text-lg font-bold tracking-tight text-ink-100 sm:text-xl">{title}</h2>
        {href ? (
          <a
            href={href}
            className="text-xs font-medium text-ink-400 transition hover:text-brand-500"
          >
            Explore all →
          </a>
        ) : null}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          className="absolute -left-1 top-0 z-20 hidden h-full w-10 items-center justify-center bg-gradient-to-r from-ink-950 via-ink-950/80 to-transparent text-ink-200 opacity-0 transition group-hover/row:opacity-100 md:flex"
        >
          <ChevronLeftIcon width={24} height={24} />
        </button>

        <div
          ref={scroller}
          className="scrollbar-none flex gap-3 overflow-x-auto scroll-smooth px-4 pb-2 sm:gap-4 sm:px-6 lg:px-10"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          className="absolute -right-1 top-0 z-20 hidden h-full w-10 items-center justify-center bg-gradient-to-l from-ink-950 via-ink-950/80 to-transparent text-ink-200 opacity-0 transition group-hover/row:opacity-100 md:flex"
        >
          <ChevronRightIcon width={24} height={24} />
        </button>
      </div>
    </section>
  );
}
