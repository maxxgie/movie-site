"use client";

import { useState } from "react";

import { StarIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

type StarRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
  className?: string;
};

export function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 18,
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className={cn("flex items-center gap-0.5", className)} role="radiogroup">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(active);
        const Icon = (
          <StarIcon
            filled={filled}
            width={size}
            height={size}
            className={filled ? "text-brand-500" : "text-ink-500"}
          />
        );

        if (readOnly || !onChange) {
          return (
            <span key={star} className="inline-flex">
              {Icon}
            </span>
          );
        }

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === Math.round(value)}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            className="transition-transform hover:scale-115 focus:outline-none"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onFocus={() => setHovered(star)}
            onBlur={() => setHovered(0)}
            onClick={() => onChange(star)}
          >
            {Icon}
          </button>
        );
      })}
    </div>
  );
}
