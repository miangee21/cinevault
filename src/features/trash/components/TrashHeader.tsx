//src/features/trash/components/TrashHeader.tsx
"use client";

import { Trash2, List, Grid2X2 } from "lucide-react";
import { SearchBar } from "@/shared/components/SearchBar";
import { EmptyTrashDialog } from "./EmptyTrashDialog";
import { cn } from "@/shared/lib/utils";
import { useDashboardPreferences } from "@/shared/hooks/useDashboardPreferences";
import { TypeTabs } from "@/features/media-items/components/dashboard/TypeTabs";
import { type Id } from "@convex/_generated/dataModel";

interface TrashHeaderProps {
  categoryFilter: Id<"categories"> | "all";
  onCategoryChange: (val: Id<"categories"> | "all") => void;
  subcategoryFilter: Id<"subcategories"> | "all";
  onSubcategoryChange: (val: Id<"subcategories"> | "all") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEmptyTrashComplete: () => void;
}

export function TrashHeader({
  categoryFilter,
  onCategoryChange,
  subcategoryFilter,
  onSubcategoryChange,
  searchQuery,
  onSearchChange,
  onEmptyTrashComplete,
}: TrashHeaderProps) {
  const { viewMode, setViewMode } = useDashboardPreferences();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div className="flex min-w-0 flex-1">
        <TypeTabs
          value={categoryFilter}
          onChange={onCategoryChange}
          subcategoryValue={subcategoryFilter}
          onSubcategoryChange={onSubcategoryChange}
          isTrashView={true}
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
        <div className="flex h-10 shrink-0 items-center rounded-full border border-border bg-[hsl(var(--foreground)/0.03)] p-1">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={cn(
              "flex size-8 items-center justify-center rounded-full transition-all",
              viewMode === "list"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-label="List view"
            title="List view"
          >
            <List className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={cn(
              "flex size-8 items-center justify-center rounded-full transition-all",
              viewMode === "grid"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-label="Grid view"
            title="Grid view"
          >
            <Grid2X2 className="size-4" />
          </button>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={() => onSearchChange("")}
          placeholder="Search trashed media..."
          className="flex-1 sm:flex-none"
        />

        <EmptyTrashDialog
          onEmptied={onEmptyTrashComplete}
          trigger={
            <button
              type="button"
              className="flex h-10 shrink-0 items-center gap-2 rounded-full bg-destructive/10 px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
              aria-label="Empty Bin"
            >
              <Trash2 className="size-4" />
              <span className="hidden sm:inline">Empty Bin</span>
            </button>
          }
        />
      </div>
    </div>
  );
}
