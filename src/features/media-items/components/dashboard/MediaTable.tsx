//src/features/media-items/components/dashboard/MediaTable.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search as SearchIcon } from "lucide-react";
import { Table, TableBody } from "@/shared/components/ui/table";
import { EmptyState } from "@/shared/components/EmptyState";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { TypeTabs } from "./TypeTabs";
import { SearchBar } from "./SearchBar";
import { SortDropdown } from "./SortDropdown";
import { PaginationBar, type PageSize } from "./PaginationBar";
import { MediaTableHeader } from "./MediaTableHeader";
import { MediaTableRow } from "./MediaTableRow";
import { MediaItemFormDialog } from "../form/MediaItemFormDialog";

import { useMediaItems } from "../../hooks/useMediaItems";
import { useColumnWidths } from "../../hooks/useColumnWidths";
import { sortMediaItems, type SortOption } from "../../utils/sortMediaItems";
import { type Id } from "@convex/_generated/dataModel";

export function MediaTable() {
  const [categoryFilter, setCategoryFilter] = useState<
    Id<"categories"> | "all"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("name_asc");
  const [pageSize, setPageSize] = useState<PageSize>("20");
  const [currentPage, setCurrentPage] = useState(1);
  const { widths, resizeColumn } = useColumnWidths();

  const { items, status, loadMore } = useMediaItems(
    categoryFilter === "all" ? undefined : categoryFilter,
    searchTerm,
  );

  const sortedItems = useMemo(
    () => sortMediaItems(items, sortOption),
    [items, sortOption],
  );
  const isSearching = searchTerm.trim().length > 0;
  const isLoadingFirstPage = status === "LoadingFirstPage";
  const pageSizeNumber = pageSize === "all" ? undefined : Number(pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, searchTerm, pageSize]);

  useEffect(() => {
    if (pageSize === "all") {
      if (status === "CanLoadMore") loadMore(200);
      return;
    }
    if (!pageSizeNumber) return;
    const neededCount = currentPage * pageSizeNumber;
    if (sortedItems.length < neededCount && status === "CanLoadMore") {
      loadMore(pageSizeNumber);
    }
  }, [
    pageSize,
    pageSizeNumber,
    currentPage,
    sortedItems.length,
    status,
    loadMore,
  ]);

  const pageItems = pageSizeNumber
    ? sortedItems.slice(
        (currentPage - 1) * pageSizeNumber,
        currentPage * pageSizeNumber,
      )
    : sortedItems;

  const totalPages = pageSizeNumber
    ? Math.max(1, Math.ceil(sortedItems.length / pageSizeNumber))
    : 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TypeTabs value={categoryFilter} onChange={setCategoryFilter} />

        <div className="flex items-center gap-2">
          <SearchBar onSearch={setSearchTerm} />
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
          <div className="overflow-x-auto rounded-2xl border border-border">
            <Table>
              <colgroup>
                <col style={{ width: widths.poster }} />
                <col style={{ width: widths.title }} />
                <col style={{ width: widths.type }} />
                <col style={{ width: widths.storage }} />
                <col style={{ width: widths.status }} />
                <col style={{ width: widths.rating }} />
              </colgroup>
              <MediaTableHeader onResize={resizeColumn} />
              <TableBody>
                {pageItems.map((item, index) => (
                  <MediaTableRow key={item._id} item={item} index={index} />
                ))}
              </TableBody>
            </Table>
          </div>

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
