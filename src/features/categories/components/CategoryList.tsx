//src/features/categories/components/CategoryList.tsx
"use client";

import { FolderPlus, Plus } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { CategoryCard } from "./CategoryCard";
import { CategoryFormDialog } from "./CategoryFormDialog";
import { useCategories } from "../hooks/useCategories";

function AddCategoryButton({ label }: { label: string }) {
  return (
    <CategoryFormDialog
      mode="create"
      trigger={
        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 text-sm font-semibold text-[hsl(var(--primary-foreground))] transition-colors hover:bg-[hsl(var(--primary)/0.9)]"
        >
          <Plus className="size-4" />
          {label}
        </button>
      }
    />
  );
}

export function CategoryList() {
  const { categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-19 animate-pulse rounded-2xl bg-[hsl(var(--foreground)/0.05)]"
          />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <EmptyState
        icon={FolderPlus}
        title="No categories yet"
        description="Create your first category to start organizing your movies and series."
        action={<AddCategoryButton label="Create category" />}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <AddCategoryButton label="New category" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
      </div>
    </div>
  );
}
