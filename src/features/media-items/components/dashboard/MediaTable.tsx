//src/features/media-items/components/dashboard/MediaTable.tsx
"use client";

import { useState } from "react";
import { Plus, Search as SearchIcon, List, Grid2X2 } from "lucide-react";
import { Table, TableBody } from "@/shared/components/ui/table";
import { EmptyState } from "@/shared/components/EmptyState";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { TypeTabs } from "./TypeTabs";
import { SearchBar } from "@/shared/components/SearchBar";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { SortDropdown } from "./SortDropdown";
import { PaginationBar, type PageSize } from "./PaginationBar";
import { MediaTableHeader } from "./MediaTableHeader";
import { MediaTableRow } from "./MediaTableRow";
import { MediaGridCard } from "./MediaGridCard";
import { MediaItemFormDialog } from "../form/MediaItemFormDialog";
import { useMediaItems } from "../../hooks/useMediaItems";
import { useColumnWidths } from "../../hooks/useColumnWidths";
import { useDashboardPreferences } from "@/shared/hooks/useDashboardPreferences";
import { type SortOption } from "../../utils/sortMediaItems";
import { type Id } from "@convex/_generated/dataModel";
import { type MediaItem } from "../../types";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export function MediaTable() {
  const [categoryFilter, setCategoryFilter] = useState<
    Id<"categories"> | "all"
  >("all");
  const [subcategoryFilter, setSubcategoryFilter] = useState<
    Id<"subcategories"> | "all"
  >("all");
  const [searchInput, setSearchInput] = useState("");
  const searchTerm = useDebounce(searchInput, 300);
  const [sortOption, setSortOption] = useState<SortOption>("name_asc");
  const [pageSize, setPageSize] = useState<PageSize>("10");
  const [currentPage, setCurrentPage] = useState(1);
  const { widths, resizeColumn } = useColumnWidths();
  const { showDeleteButton, viewMode, setViewMode } = useDashboardPreferences();
  const itemCounts = useQuery(api.mediaItemQueries.getMediaItemCounts);
  const pageSizeNumber = Number(pageSize);

  const {
    items: pageItems,
    status,
    isLoading,
  } = useMediaItems(
    categoryFilter === "all" ? undefined : categoryFilter,
    subcategoryFilter === "all" ? undefined : subcategoryFilter,
    searchTerm,
    sortOption,
    pageSizeNumber,
    currentPage,
  );

  const isSearching = searchTerm.trim().length > 0;
  const isLoadingFirstPage = isLoading && currentPage === 1;

  // Professional Auto-Heal: Render-phase state update (prevents cascading renders)
  if (!isLoading && pageItems.length === 0 && currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }

  const [prevFilters, setPrevFilters] = useState({
    categoryFilter,
    subcategoryFilter,
    searchTerm,
    pageSize,
    sortOption,
  });
  if (
    categoryFilter !== prevFilters.categoryFilter ||
    subcategoryFilter !== prevFilters.subcategoryFilter ||
    searchTerm !== prevFilters.searchTerm ||
    pageSize !== prevFilters.pageSize ||
    sortOption !== prevFilters.sortOption
  ) {
    setPrevFilters({
      categoryFilter,
      subcategoryFilter,
      searchTerm,
      pageSize,
      sortOption,
    });
    setCurrentPage(1);
  }

  const totalItemsCount =
    categoryFilter === "all"
      ? (itemCounts?.total ?? 0)
      : (itemCounts?.byCategory[categoryFilter] ?? 0);

  const totalPages = Math.max(
    1,
    isSearching
      ? currentPage + (status === "CanLoadMore" ? 1 : 0) // Dynamic pages for search
      : Math.ceil(totalItemsCount / pageSizeNumber),
  );

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1">
          <TypeTabs
            value={categoryFilter}
            onChange={(val) => {
              setCategoryFilter(val);
              setSubcategoryFilter("all");
            }}
            subcategoryValue={subcategoryFilter}
            onSubcategoryChange={setSubcategoryFilter}
          />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <SearchBar
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onClear={() => setSearchInput("")}
            placeholder="Search your vault..."
          />

          <div className="flex h-10 items-center rounded-full border border-border bg-[hsl(var(--foreground)/0.03)] p-1">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex size-8 items-center justify-center rounded-full transition-all ${
                viewMode === "list"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="List view"
              title="List view"
            >
              <List className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex size-8 items-center justify-center rounded-full transition-all ${
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Grid view"
              title="Grid view"
            >
              <Grid2X2 className="size-4" />
            </button>
          </div>

          <SortDropdown value={sortOption} onChange={setSortOption} />
          <MediaItemFormDialog
            mode="create"
            trigger={
              <button
                type="button"
                className="flex h-10 shrink-0 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[hsl(var(--primary)/0.9)]"
              >
                <Plus className="size-4" />
                Add New
              </button>
            }
          />
        </div>
      </div>

      {isSearching && (
        <p className="text-xs text-muted-foreground">
          Showing results for &quot;{searchTerm}&quot; across all categories
        </p>
      )}

      {isLoadingFirstPage ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : pageItems.length === 0 ? (
        <EmptyState
          icon={isSearching ? SearchIcon : Plus}
          title={isSearching ? "No results found" : "No items yet"}
          description={
            isSearching
              ? `Nothing matches "${searchTerm}". Try a different search.`
              : "Add your first movie or series to start tracking your vault."
          }
        />
      ) : (
        <>
          {viewMode === "list" ? (
            <div className="overflow-x-auto rounded-2xl border border-border">
              <Table>
                <colgroup>
                  <col style={{ width: widths.poster }} />
                  <col style={{ width: widths.title }} />
                  <col style={{ width: widths.type }} />
                  <col style={{ width: widths.storage }} />
                  <col style={{ width: widths.status }} />
                  <col style={{ width: widths.rating }} />
                  {showDeleteButton && <col style={{ width: 48 }} />}
                </colgroup>

                <MediaTableHeader
                  onResize={resizeColumn}
                  showActionsColumn={showDeleteButton}
                />

                <TableBody>
                  {pageItems.map((item, index) => {
                    if (!item) return null;
                    return (
                      <MediaTableRow
                        key={item._id}
                        item={item as unknown as MediaItem}
                        index={index}
                        showDeleteButton={showDeleteButton}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {pageItems.map((item) => {
                if (!item) return null;
                return (
                  <MediaGridCard
                    key={item._id}
                    item={item as unknown as MediaItem}
                    showActionsButton={showDeleteButton}
                  />
                );
              })}
            </div>
          )}

          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            isLoadingMore={isLoading && currentPage > 1}
          />
        </>
      )}
    </div>
  );
}
