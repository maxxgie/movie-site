import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-white/5 bg-ink-950 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600 text-xs font-black text-ink-100">
              C
            </span>
            <span className="text-base font-black tracking-tight text-ink-100">CineVault</span>
          </div>
          <p className="mt-2 max-w-md text-xs leading-relaxed text-ink-500">
            A personal streaming front-end powered by TMDB metadata. Movie data and artwork
            belong to TMDB &amp; its partners. Stream sources are provided by you.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-ink-400">
          <Link href="/" className="transition hover:text-ink-100">Home</Link>
          <Link href="/browse" className="transition hover:text-ink-100">Browse</Link>
          <Link href="/my-list" className="transition hover:text-ink-100">My List</Link>
          <Link href="/reviews" className="transition hover:text-ink-100">Reviews</Link>
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-ink-100"
          >
            TMDB
          </a>
        </div>
      </div>
    </footer>
  );
}
