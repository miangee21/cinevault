//src/features/categories/components/SubcategoryList.tsx
"use client";

import { Pencil, Plus } from "lucide-react";
import { IconGlyph } from "./IconGlyph";
import { SubcategoryFormDialog } from "./SubcategoryFormDialog";
import { useSubcategories } from "../hooks/useSubcategories";
import { type Id } from "@convex/_generated/dataModel";

interface SubcategoryListProps {
  categoryId: Id<"categories">;
}

export function SubcategoryList({ categoryId }: SubcategoryListProps) {
  const { subcategories, isLoading } = useSubcategories(categoryId);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isLoading && (
        <span className="text-xs text-muted-foreground">Loading...</span>
      )}

      {!isLoading && subcategories.length === 0 && (
        <span className="text-xs text-muted-foreground">
          No subcategories yet.
        </span>
      )}

      {subcategories.map((sub) => (
        <SubcategoryFormDialog
          key={sub._id}
          mode="edit"
          categoryId={categoryId}
          subcategory={sub}
          trigger={
            <button
              type="button"
              className="group flex items-center gap-1.5 rounded-full border border-border py-1.5 pl-3 pr-2.5 text-xs font-medium text-foreground transition-colors hover:border-[hsl(var(--primary)/0.4)]"
            >
              <IconGlyph
                name={sub.icon}
                className="size-3.5 text-muted-foreground"
              />
              {sub.name}
              <Pencil className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          }
        />
      ))}

      <SubcategoryFormDialog
        mode="create"
        categoryId={categoryId}
        trigger={
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-[hsl(var(--primary)/0.4)] hover:text-primary"
          >
            <Plus className="size-3.5" />
            Add
          </button>
        }
      />
    </div>
  );
}
