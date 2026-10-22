import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-black text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-ink-100">We could not find that page</h1>
      <p className="mt-2 text-sm text-ink-400">
        The movie may have been removed, or the link might be wrong.
      </p>
      <Link
        href="/"
        className="mt-7 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-500"
      >
        Back to home
      </Link>
    </div>
  );
}
