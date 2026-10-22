"use client";

import Image from "next/image";
import { useState } from "react";

import { initials, titleGradient } from "@/lib/utils";

type PosterImageProps = {
  path: string | null | undefined;
  title: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
};

export function PosterImage({
  path,
  title,
  className = "",
  imageClassName = "",
  sizes = "(max-width: 640px) 42vw, (max-width: 1024px) 24vw, 200px",
  priority = false,
}: PosterImageProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(path) && !failed;

  return (
    <div className={`relative overflow-hidden bg-ink-800 ${className}`}>
      {showImage ? (
        <Image
          src={`https://image.tmdb.org/t/p/w500${path}`}
          alt={title}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
          className={`object-cover ${imageClassName}`}
        />
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center"
          style={{ background: titleGradient(title) }}
        >
          <span className="text-2xl font-black tracking-tight text-white/95 drop-shadow">
            {initials(title)}
          </span>
          <span className="line-clamp-3 text-[11px] font-semibold leading-tight text-white/85">
            {title}
          </span>
        </div>
      )}
    </div>
  );
}
