//src/features/media-items/components/dashboard/MediaTable.tsx
"use client";

import { useEffect, useState } from "react";
import { Plus, Search as SearchIcon, List, Grid2X2 } from "lucide-react";
import { Table, TableBody } from "@/shared/components/ui/table";
import { EmptyState } from "@/shared/components/EmptyState";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { TypeTabs } from "./TypeTabs";
import { SearchBar } from "./SearchBar";
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
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export function MediaTable() {
  const [categoryFilter, setCategoryFilter] = useState<
    Id<"categories"> | "all"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("name_asc");
  const [pageSize, setPageSize] = useState<PageSize>("10");
  const [currentPage, setCurrentPage] = useState(1);
  const { widths, resizeColumn } = useColumnWidths();
  const { showDeleteButton, viewMode, setViewMode } = useDashboardPreferences();

  const itemCounts = useQuery(api.mediaItems.getMediaItemCounts);

  const { items, status, loadMore } = useMediaItems(
    categoryFilter === "all" ? undefined : categoryFilter,
    searchTerm,
    sortOption,
  );

  // Items now arrive pre-sorted from Convex — no client-side sort needed.
  const sortedItems = items;
  const isSearching = searchTerm.trim().length > 0;
  const isLoadingFirstPage = status === "LoadingFirstPage";
  const pageSizeNumber = Number(pageSize);

  const [prevFilters, setPrevFilters] = useState({
    categoryFilter,
    searchTerm,
    pageSize,
    sortOption,
  });
  if (
    categoryFilter !== prevFilters.categoryFilter ||
    searchTerm !== prevFilters.searchTerm ||
    pageSize !== prevFilters.pageSize ||
    sortOption !== prevFilters.sortOption
  ) {
    setPrevFilters({ categoryFilter, searchTerm, pageSize, sortOption });
    setCurrentPage(1);
  }

  useEffect(() => {
    const neededCount = currentPage * pageSizeNumber;
    if (sortedItems.length < neededCount && status === "CanLoadMore") {
      loadMore(pageSizeNumber);
    }
  }, [pageSizeNumber, currentPage, sortedItems.length, status, loadMore]);

  const pageItems = sortedItems.slice(
    (currentPage - 1) * pageSizeNumber,
    currentPage * pageSizeNumber,
  );

  const totalItemsCount = isSearching
    ? sortedItems.length
    : categoryFilter === "all"
      ? (itemCounts?.total ?? 0)
      : (itemCounts?.byCategory[categoryFilter] ?? 0);

  const totalPages = Math.max(
    1,
    isSearching
      ? Math.ceil(sortedItems.length / pageSizeNumber) +
          (status === "CanLoadMore" ? 1 : 0)
      : Math.ceil(totalItemsCount / pageSizeNumber),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <TypeTabs value={categoryFilter} onChange={setCategoryFilter} />

        <div className="flex shrink-0 items-center gap-2">
          <SearchBar onSearch={setSearchTerm} />

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
      ) : sortedItems.length === 0 ? (
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
                  {pageItems.map((item, index) => (
                    <MediaTableRow
                      key={item._id}
                      item={item}
                      index={index}
                      showDeleteButton={showDeleteButton}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {pageItems.map((item) => (
                <MediaGridCard
                  key={item._id}
                  item={item}
                  showActionsButton={showDeleteButton}
                />
              ))}
            </div>
          )}

          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            isLoadingMore={status === "LoadingMore"}
          />
        </>
      )}
    </div>
  );
}
