//src/features/media-items/components/detail/ItemDetailView.tsx
"use client";

import { Loader2 } from "lucide-react";
import { useMediaItem } from "../../hooks/useMediaItem";
import { ItemDetailHeader } from "./ItemDetailHeader";
import { ItemPoster } from "./ItemPoster";
import { ItemMetaSection } from "./ItemMetaSection";
import { ProgressEditor } from "./ProgressEditor";
import { StorageEditor } from "./StorageEditor";
import { RatingEditor } from "./RatingEditor";
import { ReviewEditor } from "./ReviewEditor";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useSubcategories } from "@/features/categories/hooks/useSubcategories";
import { type Id } from "@convex/_generated/dataModel";

export function ItemDetailView({ itemId }: { itemId: Id<"mediaItems"> }) {
  const { item, isLoading } = useMediaItem(itemId);
  const { categories } = useCategories();
  const { subcategories } = useSubcategories(item?.categoryId);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-57px)] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!item) {
    return null;
  }

  const category = categories.find((c) => c._id === item.categoryId);
  const itemSubcategories = subcategories.filter((s) =>
    item.subcategoryIds.includes(s._id),
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <ItemDetailHeader
        item={item}
        category={category}
        subcategories={itemSubcategories}
      />

      <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr]">
        <ItemPoster item={item} />

        <div className="space-y-6">
          <ItemMetaSection item={item} />

          <div className="grid gap-6 sm:grid-cols-2">
            <ProgressEditor item={item} />
            <StorageEditor item={item} />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <RatingEditor item={item} />
            <ReviewEditor item={item} />
          </div>
        </div>
      </div>
    </div>
  );
}
