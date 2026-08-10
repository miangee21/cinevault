//src/features/categories/hooks/useSubcategories.ts
"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { type Id } from "@convex/_generated/dataModel";

export function useSubcategories(categoryId: Id<"categories"> | undefined) {
  const subcategories = useQuery(
    api.subcategories.getSubcategories,
    categoryId ? { categoryId } : "skip",
  );

  return {
    subcategories: subcategories ?? [],
    isLoading: subcategories === undefined && categoryId !== undefined,
  };
}

export function useSubcategoryItemCount(id: Id<"subcategories"> | undefined) {
  const count = useQuery(
    api.subcategories.getSubcategoryItemCount,
    id ? { id } : "skip",
  );

  return {
    count: count ?? 0,
    isLoading: count === undefined && id !== undefined,
  };
}

export function useCreateSubcategory() {
  return useMutation(api.subcategories.createSubcategory);
}

export function useUpdateSubcategory() {
  return useMutation(api.subcategories.updateSubcategory);
}

export function useDeleteSubcategory() {
  return useMutation(api.subcategories.deleteSubcategory);
}
