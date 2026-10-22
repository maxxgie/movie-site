import Link from "next/link";

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

type PaginationProps = {
  page: number;
  totalPages: number;
  params: Record<string, string>;
};

function buildHref(page: number, params: Record<string, string>) {
  const search = new URLSearchParams(params);
  if (page > 1) search.set("page", String(page));
  else search.delete("page");
  const query = search.toString();
  return query ? `?${query}` : "?";
}

export function Pagination({ page, totalPages, params }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let index = start; index <= end; index += 1) pages.push(index);

  const linkClass =
    "grid h-9 min-w-9 place-items-center rounded-lg px-2 text-sm font-semibold transition";

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5">
      <Link
        href={buildHref(Math.max(1, page - 1), params)}
        aria-disabled={page <= 1}
        className={cn(
          linkClass,
          "text-ink-300 hover:bg-white/10 hover:text-ink-100",
          page <= 1 && "pointer-events-none opacity-40",
        )}
      >
        <ChevronLeftIcon width={16} height={16} />
      </Link>

      {pages[0] > 1 ? (
        <>
          <Link href={buildHref(1, params)} className={cn(linkClass, "text-ink-300 hover:bg-white/10 hover:text-ink-100")}>
            1
          </Link>
          <span className="px-1 text-ink-600">…</span>
        </>
      ) : null}

      {pages.map((item) => (
        <Link
          key={item}
          href={buildHref(item, params)}
          className={cn(
            linkClass,
            item === page
              ? "bg-brand-600 text-white"
              : "text-ink-300 hover:bg-white/10 hover:text-ink-100",
          )}
        >
          {item}
        </Link>
      ))}

      {pages[pages.length - 1] < totalPages ? (
        <>
          <span className="px-1 text-ink-600">…</span>
          <Link
            href={buildHref(totalPages, params)}
            className={cn(linkClass, "text-ink-300 hover:bg-white/10 hover:text-ink-100")}
          >
            {totalPages}
          </Link>
        </>
      ) : null}

      <Link
        href={buildHref(Math.min(totalPages, page + 1), params)}
        aria-disabled={page >= totalPages}
        className={cn(
          linkClass,
          "text-ink-300 hover:bg-white/10 hover:text-ink-100",
          page >= totalPages && "pointer-events-none opacity-40",
        )}
      >
        <ChevronRightIcon width={16} height={16} />
      </Link>
    </nav>
  );
}
