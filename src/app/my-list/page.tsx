import type { Metadata } from "next";

import { MyListView } from "@/components/my-list-view";

export const metadata: Metadata = {
  title: "My List",
  description: "Movies you saved to watch later.",
};

export default function MyListPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-ink-100">My List</h1>
        <p className="mt-1.5 text-sm text-ink-400">
          Everything you saved, stored locally in this browser.
        </p>
      </header>

      <MyListView />
    </div>
  );
}
