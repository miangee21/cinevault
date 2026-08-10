//src/features/categories/hooks/useCategories.ts
"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { type Id } from "@convex/_generated/dataModel";

export function useCategories() {
  const categories = useQuery(api.categories.getCategories);

  return {
    categories: categories ?? [],
    isLoading: categories === undefined,
  };
}

export function useCategoryItemCount(id: Id<"categories"> | undefined) {
  const count = useQuery(
    api.categories.getCategoryItemCount,
    id ? { id } : "skip",
  );

  return {
    count: count ?? 0,
    isLoading: count === undefined && id !== undefined,
  };
}

export function useCreateCategory() {
  return useMutation(api.categories.createCategory);
}

export function useUpdateCategory() {
  return useMutation(api.categories.updateCategory);
}

export function useDeleteCategory() {
  return useMutation(api.categories.deleteCategory);
}
