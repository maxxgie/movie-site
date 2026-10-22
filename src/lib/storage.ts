"use client";

import { useCallback, useSyncExternalStore } from "react";

type Listener = () => void;

export type JsonStore<T> = {
  read: () => T;
  write: (value: T) => void;
  subscribe: (listener: Listener) => () => void;
};

/**
 * A tiny external store backed by localStorage. Using useSyncExternalStore keeps
 * the value in sync with the browser (including other tabs) without setState
 * inside effects.
 */
export function createJsonStore<T>(key: string, initial: T): JsonStore<T> {
  const listeners = new Set<Listener>();
  let cache: { raw: string | null; value: T } | null = null;

  const read = (): T => {
    if (typeof window === "undefined") return initial;

    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(key);
    } catch {
      return initial;
    }

    if (!cache || cache.raw !== raw) {
      let value = initial;
      if (raw) {
        try {
          value = JSON.parse(raw) as T;
        } catch {
          value = initial;
        }
      }
      cache = { raw, value };
    }

    return cache.value;
  };

  const write = (value: T) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be unavailable (private mode, quota). The UI still works.
    }
    cache = null;
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    window.addEventListener("storage", listener);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", listener);
    };
  };

  return { read, write, subscribe };
}

export function useJsonStore<T>(store: JsonStore<T>, serverSnapshot: T) {
  const value = useSyncExternalStore(store.subscribe, store.read, () => serverSnapshot);
  const setValue = useCallback((next: T) => store.write(next), [store]);
  return [value, setValue] as const;
}
