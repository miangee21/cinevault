//src/features/media-items/hooks/useMediaItems.ts
"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { type Id } from "@convex/_generated/dataModel";
import { type SortOption } from "../utils/sortMediaItems";

export function useMediaItems(
  categoryId: Id<"categories"> | undefined,
  subcategoryId: Id<"subcategories"> | undefined,
  searchTerm: string,
  sortOption: SortOption,
  pageSize: number,
  currentPage: number,
) {
  const [cursors, setCursors] = useState<Record<number, string | null>>({
    1: null,
  });
  const [prevFilters, setPrevFilters] = useState({
    categoryId,
    subcategoryId,
    searchTerm,
    sortOption,
    pageSize,
  });

  // 1. Professionally reset cursors when filters change (React Recommended Derived State)
  if (
    categoryId !== prevFilters.categoryId ||
    subcategoryId !== prevFilters.subcategoryId ||
    searchTerm !== prevFilters.searchTerm ||
    sortOption !== prevFilters.sortOption ||
    pageSize !== prevFilters.pageSize
  ) {
    setPrevFilters({
      categoryId,
      subcategoryId,
      searchTerm,
      sortOption,
      pageSize,
    });
    setCursors({ 1: null });
  }

  const currentCursor =
    cursors[currentPage] !== undefined ? cursors[currentPage] : null;

  const queryResult = useQuery(api.mediaItems.getMediaItemsPaginated, {
    categoryId,
    subcategoryId,
    searchTerm: searchTerm || undefined,
    sortOption,
    paginationOpts: {
      numItems: pageSize,
      cursor: currentCursor,
    },
  });

  // 2. Pre-store next page cursor during render (Safe derivation, zero useEffect cascading)
  if (queryResult && !queryResult.isDone) {
    const nextCursor = queryResult.continueCursor;
    if (cursors[currentPage + 1] !== nextCursor) {
      setCursors((prev) => ({ ...prev, [currentPage + 1]: nextCursor }));
    }
  }

  return {
    items: queryResult?.page || [],
    status:
      queryResult === undefined
        ? "LoadingFirstPage"
        : queryResult.isDone
          ? "Exhausted"
          : "CanLoadMore",
    isLoading: queryResult === undefined,
  };
}
