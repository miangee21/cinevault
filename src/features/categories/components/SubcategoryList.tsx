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
              className="group flex items-center gap-1.5 rounded-full border border-border py-1.5 pl-3 pr-2.5 text-xs font-medium text-foreground transition-colors hover:border-[hsl(var(--primary)/0.4)] hover:bg-muted/30"
            >
              <IconGlyph
                name={sub.icon}
                className="size-3.5 text-muted-foreground"
              />
              <span>{sub.name}</span>
              {(sub.itemCount ?? 0) > 0 && (
                <span className="flex items-center justify-center text-[10px] font-bold text-muted-foreground bg-muted/60 border border-border/50 px-1.5 py-0.5 rounded-md ml-0.5 min-w-5">
                  {sub.itemCount}
                </span>
              )}
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
