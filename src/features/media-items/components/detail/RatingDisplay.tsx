//src/features/media-items/components/detail/RatingDisplay.tsx
import { StarRatingInput } from "@/features/ratings/components/StarRatingInput";
import { type MediaItem } from "../../types";

export function RatingDisplay({ item }: { item: MediaItem }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border/50 bg-[hsl(var(--foreground)/0.015)] p-3.5 transition-colors hover:bg-[hsl(var(--foreground)/0.03)]">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Rating
        </p>
      </div>
      <div className="flex flex-1 items-center">
        <StarRatingInput value={item.rating} readOnly size="md" />
      </div>
    </div>
  );
}
