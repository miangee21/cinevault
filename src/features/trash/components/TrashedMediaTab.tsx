//src/features/trash/components/TrashedMediaTab.tsx
"use client";

import { useState } from "react";
import { Search as SearchIcon, Film } from "lucide-react";
import { Table, TableBody } from "@/shared/components/ui/table";
import { EmptyState } from "@/shared/components/EmptyState";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useTrashedMediaItems } from "../hooks/useTrashedMediaItems";
import { useColumnWidths } from "@/features/media-items/hooks/useColumnWidths";
import { useDashboardPreferences } from "@/shared/hooks/useDashboardPreferences";
import {
  PaginationBar,
  type PageSize,
} from "@/features/media-items/components/dashboard/PaginationBar";
import { MediaTableHeader } from "@/features/media-items/components/dashboard/MediaTableHeader";
import { TrashedMediaTableRow } from "./TrashedMediaTableRow";
import { TrashedMediaGridCard } from "./TrashedMediaGridCard";
import { type MediaItem } from "@/features/media-items/types";
import { type Id } from "@convex/_generated/dataModel";

interface TrashedMediaTabProps {
  categoryId?: Id<"categories">;
  subcategoryId?: Id<"subcategories">;
  searchQuery: string;
}

export function TrashedMediaTab({
  categoryId,
  subcategoryId,
  searchQuery,
}: TrashedMediaTabProps) {
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [pageSize, setPageSize] = useState<PageSize>("10");
  const [currentPage, setCurrentPage] = useState(1);
  const { widths, resizeColumn } = useColumnWidths();
  const { viewMode } = useDashboardPreferences();

  const pageSizeNumber = Number(pageSize);

  // Professional Filter Reset: Render-phase state update
  const [prevFilters, setPrevFilters] = useState({
    categoryId,
    subcategoryId,
    debouncedSearch,
    pageSize,
  });

  if (
    categoryId !== prevFilters.categoryId ||
    subcategoryId !== prevFilters.subcategoryId ||
    debouncedSearch !== prevFilters.debouncedSearch ||
    pageSize !== prevFilters.pageSize
  ) {
    setPrevFilters({
      categoryId,
      subcategoryId,
      debouncedSearch,
      pageSize,
    });
    setCurrentPage(1);
  }

  const { items, status, isLoading } = useTrashedMediaItems(
    categoryId,
    subcategoryId,
    debouncedSearch,
    pageSizeNumber,
    currentPage,
  );

  const isSearching = debouncedSearch.trim().length > 0;
  const isLoadingFirstPage = isLoading && currentPage === 1;
  const totalPages = Math.max(
    1,
    currentPage + (status === "CanLoadMore" ? 1 : 0),
  );

  // Professional Auto-Heal: Render-phase state update (prevents cascading renders)
  if (!isLoading && items.length === 0 && currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }

  return (
    <div className="space-y-4">
      {isLoadingFirstPage ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={isSearching ? SearchIcon : Film}
          title={isSearching ? "No results found" : "No media in trash"}
          description={
            isSearching
              ? `Nothing matches "${debouncedSearch}" in the trash.`
              : "Deleted movies and series will appear here. They stay safe until you empty the bin."
          }
          className="min-h-[50vh]"
        />
      ) : (
        <>
          {viewMode === "list" ? (
            <div className="overflow-x-auto rounded-2xl border border-border bg-card">
              <Table>
                <colgroup>
                  <col style={{ width: widths.poster }} />
                  <col style={{ width: widths.title }} />
                  <col style={{ width: widths.type }} />
                  <col style={{ width: widths.storage }} />
                  <col style={{ width: widths.status }} />
                  <col style={{ width: widths.rating }} />
                  <col style={{ width: 100 }} />
                </colgroup>

                <MediaTableHeader
                  onResize={resizeColumn}
                  showActionsColumn={true}
                />

                <TableBody>
                  {items.map((item, index) => {
                    if (!item) return null;
                    return (
                      <TrashedMediaTableRow
                        key={item._id}
                        item={item as unknown as MediaItem}
                        index={index}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {items.map((item) => {
                if (!item) return null;
                return (
                  <TrashedMediaGridCard
                    key={item._id}
                    item={item as unknown as MediaItem}
                  />
                );
              })}
            </div>
          )}

          <div className="pt-2">
            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              isLoadingMore={isLoading && currentPage > 1}
            />
          </div>
        </>
      )}
    </div>
  );
}
