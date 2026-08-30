//src/features/media-items/hooks/useMediaItems.ts
"use client";

import { usePaginatedQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { type Id } from "@convex/_generated/dataModel";
import { type SortOption } from "../utils/sortMediaItems";

export function useMediaItems(
  categoryId: Id<"categories"> | undefined,
  searchTerm: string,
  sortOption: SortOption,
) {
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.mediaItems.getMediaItemsPaginated,
    { categoryId, searchTerm: searchTerm || undefined, sortOption },
    { initialNumItems: 10 },
  );

  return {
    items: results,
    status, // "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted"
    isLoading,
    loadMore,
  };
}
