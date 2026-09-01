//src/features/media-items/components/dashboard/PaginationBar.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

export const PAGE_SIZE_OPTIONS = ["5", "10", "20", "30", "50"] as const;
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  pageSize: PageSize;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: PageSize) => void;
  isLoadingMore?: boolean;
}

function PageSizeSelect({
  value,
  onChange,
}: {
  value: PageSize;
  onChange: (v: PageSize) => void;
}) {
  return (
    <Select value={value} onValueChange={(v) => v && onChange(v as PageSize)}>
      <SelectTrigger className="h-9 w-auto gap-1.5 rounded-full px-3 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PAGE_SIZE_OPTIONS.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {`${opt} / page`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function PaginationBar({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoadingMore,
}: PaginationBarProps) {
  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      <PageSizeSelect value={pageSize} onChange={onPageSizeChange} />

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[hsl(var(--foreground)/0.06)] disabled:pointer-events-none disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </button>

        <span className="min-w-22.5 text-center text-sm text-muted-foreground">
          {isLoadingMore
            ? "Loading..."
            : `Page ${currentPage} of ${Math.max(totalPages, 1)}`}
        </span>

        <button
          type="button"
          disabled={currentPage >= totalPages || isLoadingMore}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[hsl(var(--foreground)/0.06)] disabled:pointer-events-none disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
