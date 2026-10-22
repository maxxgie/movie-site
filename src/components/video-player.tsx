"use client";

import Hls from "hls.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  FullscreenIcon,
  PauseIcon,
  PlayIcon,
  SettingsIcon,
  VolumeIcon,
  VolumeOffIcon,
} from "@/components/icons";
import { cn } from "@/lib/cn";
import { formatTime } from "@/lib/utils";
import type { StreamSource } from "@/lib/sources";
import { useWatchlist } from "@/providers/watchlist-provider";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

function browserCanPlayHls() {
  if (typeof document === "undefined") return true;
  try {
    return (
      document.createElement("video").canPlayType("application/vnd.apple.mpegurl") !== "" ||
      Hls.isSupported()
    );
  } catch {
    return false;
  }
}

type VideoPlayerProps = {
  movieId: number;
  title: string;
  posterPath: string | null;
  backdropPath?: string | null;
  sources: StreamSource[];
  trailerKey?: string | null;
};

export function VideoPlayer({
  movieId,
  title,
  posterPath,
  backdropPath = null,
  sources,
  trailerKey,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSaved = useRef(0);

  const { getProgress, saveProgress } = useWatchlist();

  const [activeSourceId, setActiveSourceId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [menu, setMenu] = useState<"none" | "source">("none");
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  const hlsSupported = useMemo(() => browserCanPlayHls(), []);

  const activeSource = useMemo(() => {
    if (!sources.length) return null;
    return sources.find((source) => source.id === activeSourceId) ?? sources[0];
  }, [activeSourceId, sources]);

  // Attach the active source to the <video> element.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeSource || activeSource.type === "youtube") return;

    let hls: Hls | null = null;

    if (activeSource.type === "hls") {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = activeSource.url;
      } else if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: true, capLevelToPlayerSize: true });
        hls.loadSource(activeSource.url);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (!data.fatal) return;
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls?.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls?.recoverMediaError();
          } else {
            setPlaybackError("This stream could not be loaded.");
            hls?.destroy();
          }
        });
      }
    } else {
      video.src = activeSource.url;
    }

    return () => {
      hls?.destroy();
    };
  }, [activeSource]);

  // Resume where the viewer left off.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => {
      setDuration(video.duration || 0);
      const saved = getProgress(movieId);
      if (saved && saved.time > 5 && saved.duration > 0 && saved.time < video.duration - 15) {
        video.currentTime = saved.time;
        setCurrentTime(saved.time);
      }
    };

    video.addEventListener("loadedmetadata", onLoaded);
    return () => video.removeEventListener("loadedmetadata", onLoaded);
  }, [getProgress, movieId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const persistProgress = useCallback(
    (time: number, total: number) => {
      if (!total) return;
      const now = Date.now();
      if (now - lastSaved.current < 5000) return;
      lastSaved.current = now;
      saveProgress({
        id: movieId,
        title,
        posterPath,
        backdropPath,
        time,
        duration: total,
      });
    },
    [backdropPath, movieId, posterPath, saveProgress, title],
  );

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  }, []);

  const seekBy = useCallback((delta: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(Math.max(video.currentTime + delta, 0), video.duration || 0);
  }, []);

  const seekToRatio = useCallback((clientX: number) => {
    const video = videoRef.current;
    const rect = barRef.current?.getBoundingClientRect();
    if (!video || !rect || !video.duration) return;
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    video.currentTime = ratio * video.duration;
  }, []);

  const toggleFullscreen = useCallback(() => {
    const node = containerRef.current;
    if (!node) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void node.requestFullscreen?.();
    }
  }, []);

  const cycleSpeed = useCallback(() => {
    const index = SPEEDS.indexOf(speed);
    setSpeed(SPEEDS[(index + 1) % SPEEDS.length]);
  }, [speed]);

  // Keyboard shortcuts.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;

      switch (event.key) {
        case " ":
        case "k":
          event.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
        case "l":
          seekBy(10);
          break;
        case "ArrowLeft":
        case "j":
          seekBy(-10);
          break;
        case "ArrowUp":
          event.preventDefault();
          setVolume((value) => Math.min(1, value + 0.1));
          break;
        case "ArrowDown":
          event.preventDefault();
          setVolume((value) => Math.max(0, value - 0.1));
          break;
        case "m":
          setMuted((value) => !value);
          break;
        case "f":
          toggleFullscreen();
          break;
        case "s":
          cycleSpeed();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cycleSpeed, seekBy, toggleFullscreen, togglePlay]);

  // Keep the volume in sync with the media element.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume;
    video.muted = muted;
  }, [muted, volume]);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setControlsVisible(false);
      setMenu("none");
    }, 3000);
  }, []);

  // Auto-hide the controls shortly after load.
  useEffect(() => {
    hideTimer.current = setTimeout(() => {
      setControlsVisible(false);
      setMenu("none");
    }, 3000);
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const error = playbackError ?? (activeSource?.type === "hls" && !hlsSupported
    ? "HLS playback is not supported in this browser."
    : null);

  const youtubeSource = activeSource?.type === "youtube" ? activeSource : null;
  const fallbackTrailer = !sources.length && trailerKey ? trailerKey : null;

  if (youtubeSource || fallbackTrailer) {
    const embedKey = youtubeSource ? youtubeSource.url : fallbackTrailer!;
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
        <iframe
          src={
            youtubeSource
              ? `${embedKey}${embedKey.includes("?") ? "&" : "?"}autoplay=1&rel=0`
              : `https://www.youtube-nocookie.com/embed/${embedKey}?autoplay=1&rel=0&modestbranding=1`
          }
          title={`${title} player`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  if (!sources.length) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-ink-900 p-8 text-center">
        <h3 className="text-lg font-bold text-ink-100">No stream configured for this title</h3>
        <p className="max-w-md text-sm text-ink-400">
          Add a source for this movie id in <code className="text-brand-400">data/sources.json</code>,
          then reload the page. You can point it at any HLS or MP4 file you host.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "group/player relative aspect-video w-full overflow-hidden bg-black shadow-2xl",
        fullscreen ? "rounded-none" : "rounded-2xl",
      )}
      onMouseMove={showControls}
      onMouseLeave={() => playing && setControlsVisible(false)}
      onContextMenu={(event) => event.preventDefault()}
    >
      <video
        ref={videoRef}
        poster={posterPath ? `https://image.tmdb.org/t/p/w780${posterPath}` : undefined}
        className="h-full w-full bg-black object-contain"
        playsInline
        onClick={togglePlay}
        onPlay={() => {
          setPlaying(true);
          setPlaybackError(null);
        }}
        onPause={() => setPlaying(false)}
        onWaiting={() => setWaiting(true)}
        onPlaying={() => setWaiting(false)}
        onTimeUpdate={(event) => {
          const video = event.currentTarget;
          setCurrentTime(video.currentTime);
          persistProgress(video.currentTime, video.duration);
        }}
        onEnded={() => setPlaying(false)}
      />

      {waiting && !error ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-brand-500" />
        </div>
      ) : null}

      {!playing && !error ? (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Play"
          className="absolute inset-0 grid place-items-center bg-black/25 transition hover:bg-black/10"
        >
          <span className="grid h-20 w-20 place-items-center rounded-full bg-white/95 text-black shadow-2xl transition hover:scale-105">
            <PlayIcon width={30} height={30} />
          </span>
        </button>
      ) : null}

      {error ? (
        <div className="absolute inset-0 grid place-items-center bg-black/80 p-6 text-center">
          <div>
            <p className="text-sm font-semibold text-brand-400">Playback error</p>
            <p className="mt-2 text-sm text-ink-300">{error}</p>
            <button
              type="button"
              onClick={() => {
                setPlaybackError(null);
                const next = sources[(sources.indexOf(activeSource!) + 1) % sources.length];
                setActiveSourceId(next.id);
              }}
              className="mt-4 rounded-lg bg-white px-5 py-2 text-sm font-bold text-black transition hover:bg-white/85"
            >
              Try another source
            </button>
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-4 pb-4 pt-10 transition-opacity duration-300 sm:px-6",
          controlsVisible ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div
          ref={barRef}
          onClick={(event) => seekToRatio(event.clientX)}
          className="group/bar relative h-1.5 w-full cursor-pointer rounded-full bg-white/25 transition-all hover:h-2"
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.floor(duration)}
          aria-valuenow={Math.floor(currentTime)}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-brand-600"
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition group-hover/bar:opacity-100"
            style={{ left: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-3 flex items-center gap-3 text-white">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
            className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/15"
          >
            {playing ? <PauseIcon width={20} height={20} /> : <PlayIcon width={20} height={20} />}
          </button>

          <div className="group/vol flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMuted((value) => !value)}
              aria-label={muted ? "Unmute" : "Mute"}
              className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/15"
            >
              {muted || volume === 0 ? (
                <VolumeOffIcon width={18} height={18} />
              ) : (
                <VolumeIcon width={18} height={18} />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(event) => {
                setVolume(Number(event.target.value));
                setMuted(false);
              }}
              aria-label="Volume"
              className="h-1 w-0 cursor-pointer appearance-none rounded-full bg-white/30 opacity-0 transition-all duration-200 group-hover/vol:w-20 group-hover/vol:opacity-100 sm:w-20 sm:opacity-100"
            />
          </div>

          <span className="select-none text-xs font-medium tabular-nums text-white/85">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <span className="hidden text-xs text-white/60 sm:inline">{title}</span>

          <div className="ml-auto flex items-center gap-1">
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenu((value) => (value === "source" ? "none" : "source"))}
                aria-label="Select source"
                className="flex h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-white/90 transition hover:bg-white/15"
              >
                <SettingsIcon width={17} height={17} />
                <span className="hidden sm:inline">
                  {activeSource?.quality ?? activeSource?.type.toUpperCase()}
                </span>
              </button>

              {menu === "source" ? (
                <div className="absolute bottom-11 right-0 w-64 overflow-hidden rounded-xl border border-white/10 bg-ink-900/95 shadow-2xl backdrop-blur">
                  <p className="border-b border-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-ink-400">
                    Sources
                  </p>
                  {sources.map((source) => (
                    <button
                      key={source.id}
                      type="button"
                      onClick={() => {
                        setActiveSourceId(source.id);
                        setPlaybackError(null);
                        setMenu("none");
                      }}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-xs transition hover:bg-white/10",
                        source.id === activeSource?.id && "bg-brand-600/15 text-brand-400",
                      )}
                    >
                      <span className="truncate">{source.label}</span>
                      <span className="shrink-0 text-[10px] uppercase text-ink-500">
                        {source.quality ?? source.type}
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={cycleSpeed}
              aria-label="Playback speed"
              className="hidden h-9 items-center rounded-lg px-2 text-xs font-bold text-white/90 transition hover:bg-white/15 sm:flex"
            >
              {speed}x
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label="Fullscreen"
              className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/15"
            >
              <FullscreenIcon width={18} height={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
