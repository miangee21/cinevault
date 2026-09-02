//src/features/trash/components/TrashPageView.tsx
"use client";

import { useState } from "react";
import { TrashHeader } from "./TrashHeader";
import { TrashedMediaTab } from "./TrashedMediaTab";
import { type Id } from "@convex/_generated/dataModel";

export function TrashPageView() {
  const [categoryFilter, setCategoryFilter] = useState<
    Id<"categories"> | "all"
  >("all");
  const [subcategoryFilter, setSubcategoryFilter] = useState<
    Id<"subcategories"> | "all"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleEmptyTrashComplete = () => {
    setSearchQuery("");
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Recycle Bin
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Restore deleted items back to your vault, or empty the bin to
          permanently delete them.
        </p>
      </div>

      <TrashHeader
        categoryFilter={categoryFilter}
        onCategoryChange={(val) => {
          setCategoryFilter(val);
          setSubcategoryFilter("all");
        }}
        subcategoryFilter={subcategoryFilter}
        onSubcategoryChange={setSubcategoryFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onEmptyTrashComplete={handleEmptyTrashComplete}
      />

      <div>
        <TrashedMediaTab
          categoryId={categoryFilter === "all" ? undefined : categoryFilter}
          subcategoryId={
            subcategoryFilter === "all" ? undefined : subcategoryFilter
          }
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}
