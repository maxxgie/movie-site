"use client";

import { createContext, useCallback, useContext, useMemo } from "react";

import { createJsonStore, useJsonStore } from "@/lib/storage";

export type WatchlistItem = {
  id: number;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  voteAverage: number;
  releaseDate: string;
  addedAt: string;
};

export type ProgressEntry = {
  id: number;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  time: number;
  duration: number;
  updatedAt: string;
};

type WatchlistContextValue = {
  items: WatchlistItem[];
  progress: Record<number, ProgressEntry>;
  has: (id: number) => boolean;
  add: (item: Omit<WatchlistItem, "addedAt">) => void;
  remove: (id: number) => void;
  toggle: (item: Omit<WatchlistItem, "addedAt">) => void;
  saveProgress: (entry: Omit<ProgressEntry, "updatedAt">) => void;
  getProgress: (id: number) => ProgressEntry | undefined;
};

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

const WATCHLIST_KEY = "movie-site:watchlist";
const PROGRESS_KEY = "movie-site:progress";

const EMPTY_ITEMS: WatchlistItem[] = [];
const EMPTY_PROGRESS: Record<number, ProgressEntry> = {};

const watchlistStore = createJsonStore<WatchlistItem[]>(WATCHLIST_KEY, EMPTY_ITEMS);
const progressStore = createJsonStore<Record<number, ProgressEntry>>(PROGRESS_KEY, EMPTY_PROGRESS);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useJsonStore(watchlistStore, EMPTY_ITEMS);
  const [progress, setProgress] = useJsonStore(progressStore, EMPTY_PROGRESS);

  const add = useCallback(
    (item: Omit<WatchlistItem, "addedAt">) => {
      const current = watchlistStore.read();
      if (current.some((entry) => entry.id === item.id)) return;
      setItems([{ ...item, addedAt: new Date().toISOString() }, ...current]);
    },
    [setItems],
  );

  const remove = useCallback(
    (id: number) => {
      setItems(watchlistStore.read().filter((entry) => entry.id !== id));
    },
    [setItems],
  );

  const toggle = useCallback(
    (item: Omit<WatchlistItem, "addedAt">) => {
      const current = watchlistStore.read();
      if (current.some((entry) => entry.id === item.id)) {
        setItems(current.filter((entry) => entry.id !== item.id));
        return;
      }
      setItems([{ ...item, addedAt: new Date().toISOString() }, ...current]);
    },
    [setItems],
  );

  const saveProgress = useCallback(
    (entry: Omit<ProgressEntry, "updatedAt">) => {
      const current = progressStore.read();
      setProgress({
        ...current,
        [entry.id]: { ...entry, updatedAt: new Date().toISOString() },
      });
    },
    [setProgress],
  );

  const has = useCallback((id: number) => items.some((entry) => entry.id === id), [items]);
  const getProgress = useCallback((id: number) => progress[id], [progress]);

  const value = useMemo(
    () => ({
      items,
      progress,
      has,
      add,
      remove,
      toggle,
      saveProgress,
      getProgress,
    }),
    [items, progress, has, add, remove, toggle, saveProgress, getProgress],
  );

  return (
    <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used inside a WatchlistProvider");
  }
  return context;
}
