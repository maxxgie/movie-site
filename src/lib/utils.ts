export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";


export function backdropUrl(path: string | null | undefined, size = "w1280") {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function formatRuntime(minutes?: number | null) {
  if (!minutes || minutes < 1) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function formatYear(date?: string | null) {
  if (!date) return "—";
  return date.slice(0, 4);
}

export function formatMoney(amount?: number | null) {
  if (!amount || amount <= 0) return "—";
  return `$${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function formatRelativeTime(iso: string) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const seconds = Math.floor((Date.now() - then) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = m.toString().padStart(2, "0");
  const ss = s.toString().padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

export function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0m";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function titleGradient(title: string) {
  const palettes = [
    ["#f43f5e", "#7c3aed"],
    ["#0ea5e9", "#6366f1"],
    ["#f59e0b", "#ef4444"],
    ["#10b981", "#0ea5e9"],
    ["#a855f7", "#ec4899"],
    ["#f97316", "#eab308"],
    ["#14b8a6", "#22c55e"],
    ["#ef4444", "#f59e0b"],
  ];
  const hash = [...title].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const [from, to] = palettes[hash % palettes.length];
  return `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;
}

export function initials(title: string) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}
