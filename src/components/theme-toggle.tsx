"use client";

import { MoonIcon, SunIcon } from "@/components/icons";
import { useTheme } from "@/providers/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
      className="grid h-9 w-9 place-items-center rounded-full text-ink-300 transition hover:bg-white/10 hover:text-ink-100"
    >
      {theme === "dark" ? (
        <SunIcon width={18} height={18} />
      ) : (
        <MoonIcon width={18} height={18} />
      )}
    </button>
  );
}
