"use client";

import { useEffect, useRef } from "react";

import { CloseIcon } from "@/components/icons";

type TrailerModalProps = {
  trailerKey: string;
  title: string;
  onClose: () => void;
};

export function TrailerModal({ trailerKey, title, onClose }: TrailerModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} trailer`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl animate-fade-up"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close trailer"
          className="absolute -top-11 right-0 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <CloseIcon width={18} height={18} />
        </button>
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
            title={`${title} trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}
