"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { CloseIcon, MenuIcon, SearchIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/cn";
import { useWatchlist } from "@/providers/watchlist-provider";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/my-list", label: "My List" },
  { href: "/reviews", label: "Reviews" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { items } = useWatchlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = (searchRef.current?.value ?? "").trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
    setMenuOpen(false);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink-950/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-sm font-black text-ink-100 shadow-glow">
            C
          </span>
          <span className="hidden text-lg font-black tracking-tight text-ink-100 sm:block">
            CineVault
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                isActive(link.href)
                  ? "text-ink-100"
                  : "text-ink-400 hover:text-ink-100",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submit} className="ml-auto hidden max-w-sm flex-1 md:block">
          <label className="relative block">
            <span className="sr-only">Search movies</span>
            <SearchIcon
              width={16}
              height={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <input
              ref={searchRef}
              type="search"
              placeholder="Search movies, genres..."
              className="w-full rounded-full border border-white/10 bg-ink-900/80 py-2 pl-9 pr-4 text-sm text-ink-100 placeholder:text-ink-500 transition focus:border-brand-600 focus:outline-none"
            />
          </label>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link
            href="/my-list"
            aria-label="My list"
            className="relative grid h-9 w-9 place-items-center rounded-full text-ink-300 transition hover:bg-white/10 hover:text-ink-100"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21 12 16l-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
            </svg>
            {items.length > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-ink-100">
                {items.length}
              </span>
            ) : null}
          </Link>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-300 transition hover:bg-white/10 hover:text-ink-100 lg:hidden"
          >
            {menuOpen ? <CloseIcon width={20} height={20} /> : <MenuIcon width={20} height={20} />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-white/5 bg-ink-950 px-4 pb-4 pt-3 lg:hidden">
          <form onSubmit={submit} className="mb-3 md:hidden">
            <label className="relative block">
              <span className="sr-only">Search movies</span>
              <SearchIcon
                width={16}
                height={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <input
                ref={searchRef}
                type="search"
                placeholder="Search movies..."
                className="w-full rounded-full border border-white/10 bg-ink-900/80 py-2 pl-9 pr-4 text-sm text-ink-100 placeholder:text-ink-500 focus:border-brand-600 focus:outline-none"
              />
            </label>
          </form>
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition",
                  isActive(link.href) ? "bg-white/5 text-ink-100" : "text-ink-300 hover:text-ink-100",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
