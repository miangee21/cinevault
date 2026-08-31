//src/features/media-items/components/form/RatingReviewInput.tsx
"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Star, X } from "lucide-react";
import { Textarea } from "@/shared/components/ui/textarea";
import { StarRatingInput } from "@/features/ratings/components/StarRatingInput";
import { cn } from "@/shared/lib/utils";
import { type MediaItemFormValues } from "../../types";

export function RatingReviewInput() {
  const { control, setValue, register } = useFormContext<MediaItemFormValues>();
  const rating = useWatch({ control, name: "rating" });

  const clearRating = () => {
    setValue("rating", undefined, { shouldValidate: true });
    setValue("review", "", { shouldValidate: true });
  };

  return (
    <div className="w-full space-y-3">
      <label className="ml-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Rating & Review{" "}
        <span className="text-muted-foreground/60 px-1 font-medium normal-case">
          (Optional)
        </span>
      </label>

      <div
        className={cn(
          "overflow-hidden rounded-2xl border transition-all duration-500",
          rating && rating > 0
            ? "border-rating/30 bg-[hsl(var(--rating))/0.02] shadow-sm"
            : "border-border/50 bg-[hsl(var(--foreground)/0.02)]",
        )}
      >
        <div className="flex min-h-16 items-center justify-between px-4 py-3 sm:py-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                rating && rating > 0
                  ? "bg-rating/15 text-rating"
                  : "bg-[hsl(var(--foreground)/0.06)] text-muted-foreground",
              )}
            >
              <Star
                className={cn(
                  "size-4",
                  rating && rating > 0 && "fill-rating/20",
                )}
              />
            </div>
            <span
              className={cn(
                "hidden truncate text-sm font-semibold transition-colors sm:inline-block",
                rating && rating > 0
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              Your Score
            </span>
          </div>

          <div className="flex items-center gap-1">
            <StarRatingInput
              value={rating ?? 0}
              onChange={(val) =>
                setValue("rating", val, { shouldValidate: true })
              }
              size="lg"
            />

            {/* Conditional Clear Button */}
            {rating && rating > 0 ? (
              <button
                type="button"
                onClick={clearRating}
                className="ml-1 flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
                title="Clear rating"
              >
                <X className="size-4.5" />
              </button>
            ) : (
              <div className="ml-1 w-8 shrink-0" />
            )}
          </div>
        </div>

        {/* Animated Review Box */}
        {rating && rating > 0 ? (
          <div className="animate-in fade-in slide-in-from-top-2 border-t border-border/50 bg-background/40 px-4 py-4 duration-300">
            <p className="mb-2 ml-1 text-xs font-medium text-muted-foreground">
              Write a short review
            </p>
            <Textarea
              placeholder="What did you think about it?..."
              className="h-24 w-full max-w-full resize-none whitespace-pre-wrap break-all rounded-xl border-border/50 bg-background text-sm shadow-inner focus-visible:ring-rating/30 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/80 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50 transition-colors duration-300"
              {...register("review")}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
