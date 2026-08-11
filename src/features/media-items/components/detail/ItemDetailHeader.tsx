//src/features/media-items/components/detail/ItemDetailHeader.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { IconGlyph } from "@/features/categories/components/IconGlyph";
import { MediaItemFormDialog } from "../form/MediaItemFormDialog";
import { DeleteItemDialog } from "./DeleteItemDialog";
import { type MediaItem } from "../../types";
import { type Category, type Subcategory } from "@/features/categories/types";

interface ItemDetailHeaderProps {
  item: MediaItem;
  category?: Category;
  subcategories: Subcategory[];
}

export function ItemDetailHeader({
  item,
  category,
  subcategories,
}: ItemDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to dashboard
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold text-foreground">
            {item.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--primary)/0.1)] px-3 py-1 text-xs font-medium text-primary">
                <IconGlyph name={category.icon} className="size-3.5" />
                {category.name}
              </span>
            )}
            {subcategories.map((sub) => (
              <span
                key={sub._id}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                <IconGlyph name={sub.icon} className="size-3.5" />
                {sub.name}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MediaItemFormDialog
            mode="edit"
            item={item}
            trigger={
              <button
                type="button"
                className="flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-[hsl(var(--foreground)/0.06)]"
              >
                <Pencil className="size-4" />
                Edit
              </button>
            }
          />
          <DeleteItemDialog
            itemId={item._id}
            title={item.title}
            onDeleted={() => router.push("/dashboard")}
            trigger={
              <button
                type="button"
                className="flex h-10 items-center gap-2 rounded-full border border-[hsl(var(--destructive)/0.4)] px-4 text-sm font-medium text-destructive transition-colors hover:bg-[hsl(var(--destructive)/0.08)]"
              >
                <Trash2 className="size-4" />
                Delete
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}
