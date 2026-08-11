//src/features/ratings/components/StarRatingInput.tsx
"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface StarRatingInputProps {
  value?: number; // 0–10
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

const SIZE_MAP = { sm: "size-4", md: "size-5", lg: "size-7" };

export function StarRatingInput({
  value = 0,
  onChange,
  readOnly = false,
  size = "md",
  showValue = true,
}: StarRatingInputProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? value;

  const setRating = (starIndex: number, half: "left" | "right") =>
    half === "left" ? starIndex * 2 - 1 : starIndex * 2;

  return (
    <div
      className="flex items-center gap-0.5"
      onMouseLeave={() => setHoverValue(null)}
    >
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const filledOutOfTwo = Math.min(
          2,
          Math.max(0, displayValue - (starIndex - 1) * 2),
        );
        const fillPercent = (filledOutOfTwo / 2) * 100;

        return (
          <div key={starIndex} className={cn("relative", SIZE_MAP[size])}>
            <Star className={cn(SIZE_MAP[size], "text-border")} />
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercent}%` }}
            >
              <Star
                className={cn(SIZE_MAP[size], "fill-primary text-primary")}
              />
            </div>

            {!readOnly && onChange && (
              <div className="absolute inset-0 flex">
                <button
                  type="button"
                  className="h-full w-1/2"
                  aria-label={`Rate ${starIndex * 2 - 1} out of 10`}
                  onClick={() => onChange(setRating(starIndex, "left"))}
                  onMouseEnter={() =>
                    setHoverValue(setRating(starIndex, "left"))
                  }
                />
                <button
                  type="button"
                  className="h-full w-1/2"
                  aria-label={`Rate ${starIndex * 2} out of 10`}
                  onClick={() => onChange(setRating(starIndex, "right"))}
                  onMouseEnter={() =>
                    setHoverValue(setRating(starIndex, "right"))
                  }
                />
              </div>
            )}
          </div>
        );
      })}

      {showValue && value > 0 && (
        <span className="ml-1.5 font-mono-data text-xs text-muted-foreground">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
