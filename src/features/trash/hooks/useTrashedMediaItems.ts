//src/features/trash/hooks/useTrashedMediaItems.ts
"use client";

import { useEffect } from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { type Id } from "@convex/_generated/dataModel";

export function useTrashedMediaItems(
  categoryId: Id<"categories"> | undefined,
  subcategoryId: Id<"subcategories"> | undefined,
  searchTerm: string,
  pageSize: number,
  currentPage: number,
) {
  // 1. Knot-style: Native accumulated pagination for the trash
  const { results, status, loadMore } = usePaginatedQuery(
    api.trash.getTrashedMediaItemsPaginated,
    {
      categoryId,
      subcategoryId,
      searchTerm: searchTerm || undefined,
    },
    { initialNumItems: pageSize },
  );

  // 2. Fetch more from DB only if the user explicitly visits deeper pages
  const requiredItems = currentPage * pageSize;
  useEffect(() => {
    if (status === "CanLoadMore" && results.length < requiredItems) {
      loadMore(pageSize);
    }
  }, [currentPage, pageSize, status, results.length, loadMore, requiredItems]);

  // 3. Client-side slicing for buttery smooth auto-sliding on restore/delete
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageItems = results.slice(startIndex, endIndex);

  return {
    items: pageItems,
    status,
    isLoading: status === "LoadingFirstPage",
  };
}
