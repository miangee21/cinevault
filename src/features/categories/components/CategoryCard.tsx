//src/features/categories/components/CategoryCard.tsx
"use client";

import { useState } from "react";
import { ChevronDown, Pencil } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { IconGlyph } from "./IconGlyph";
import { CategoryFormDialog } from "./CategoryFormDialog";
import { SubcategoryList } from "./SubcategoryList";
import { useCategoryItemCount } from "../hooks/useCategories";
import { type Category } from "../types";

export function CategoryCard({ category }: { category: Category }) {
  const [expanded, setExpanded] = useState(false);
  const { count } = useCategoryItemCount(category._id);

  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-3 p-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.12)] text-primary">
          <IconGlyph name={category.icon} className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base font-semibold text-foreground">
            {category.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {count} item{count === 1 ? "" : "s"}
          </p>
        </div>

        <CategoryFormDialog
          mode="edit"
          category={category}
          trigger={
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[hsl(var(--foreground)/0.06)] hover:text-foreground"
              aria-label={`Edit ${category.name}`}
            >
              <Pencil className="size-4" />
            </button>
          }
        />

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[hsl(var(--foreground)/0.06)] hover:text-foreground"
          aria-label={
            expanded ? "Collapse subcategories" : "Expand subcategories"
          }
        >
          <ChevronDown
            className={cn(
              "size-4 transition-transform",
              expanded && "rotate-180",
            )}
          />
        </button>
      </div>

      {expanded && (
        <div className="border-t border-border px-4 pb-4 pt-3">
          <SubcategoryList categoryId={category._id} />
        </div>
      )}
    </div>
  );
}
