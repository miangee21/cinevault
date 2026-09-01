//src/features/media-items/components/detail/ItemDetailView.tsx
"use client";

import { Loader2 } from "lucide-react";
import { useMediaItem } from "../../hooks/useMediaItem";
import { ItemDetailHeader } from "./ItemDetailHeader";
import { ItemPoster } from "./ItemPoster";
import { ItemMetaSection } from "./ItemMetaSection";
import { ProgressDisplay } from "./ProgressDisplay";
import { StorageDisplay } from "./StorageDisplay";
import { RatingDisplay } from "./RatingDisplay";
import { ReviewDisplay } from "./ReviewDisplay";
import { CustomScrollbar } from "@/shared/components/CustomScrollbar";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useSubcategories } from "@/features/categories/hooks/useSubcategories";
import { type Id } from "@convex/_generated/dataModel";

export function ItemDetailView({ itemId }: { itemId: Id<"mediaItems"> }) {
  const { item, isLoading } = useMediaItem(itemId);
  const { categories } = useCategories();
  const { subcategories } = useSubcategories(item?.categoryId);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-72px)] w-full items-center justify-center bg-background">
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
    <CustomScrollbar className="h-[calc(100vh-72px)] w-full bg-background">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <ItemDetailHeader
          item={item}
          category={category}
          subcategories={itemSubcategories}
        />

        <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr]">
          <ItemPoster item={item} />

          <div className="space-y-4">
            <ItemMetaSection item={item} />

            <div className="grid grid-cols-2 gap-3">
              <ProgressDisplay item={item} />
              <StorageDisplay item={item} />
              <RatingDisplay item={item} />
              <ReviewDisplay item={item} />
            </div>
          </div>
        </div>
      </div>
    </CustomScrollbar>
  );
}
