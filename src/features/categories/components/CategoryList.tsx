//src/features/categories/components/CategoryList.tsx
"use client";

import { useState } from "react";
import {
  FolderPlus,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { CategoryCard } from "./CategoryCard";
import { CategoryFormDialog } from "./CategoryFormDialog";
import { useCategories } from "../hooks/useCategories";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { SearchBar } from "@/shared/components/SearchBar";

function AddCategoryButton({ label }: { label: string }) {
  return (
    <CategoryFormDialog
      mode="create"
      trigger={
        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[hsl(var(--primary)/0.9)] shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          {label}
        </button>
      }
    />
  );
}

export function CategoryList() {
  const { categories, isLoading } = useCategories();

  // Pagination & Search States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-2xl bg-muted/50 border border-border/50"
          />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <EmptyState
        icon={FolderPlus}
        title="No categories yet"
        description="Create your first category to start organizing your shows."
        action={<AddCategoryButton label="Create category" />}
      />
    );
  }

  // Filter Logic
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  // Client-Side Pagination Logic
  const totalPages = Math.ceil(filteredCategories.length / pageSize) || 1;
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const paginatedCategories = filteredCategories.slice(
    startIndex,
    startIndex + pageSize,
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-end items-center gap-3">
        <SearchBar
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          onClear={() => {
            setSearchQuery("");
            setCurrentPage(1);
          }}
        />
        <AddCategoryButton label="New category" />
      </div>

      {categories.length > 0 && filteredCategories.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No categories found matching &quot;{searchQuery}&quot;.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-start">
          {paginatedCategories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      )}

      {/* Professional Pagination Controls */}
      {filteredCategories.length > 5 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-4 border-t border-border/50">
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1); // Reset to page 1 on size change
              }}
              className="appearance-none h-9 rounded-xl border border-border/60 bg-background pl-3 pr-8 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer hover:bg-muted/50"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
            </button>
            <span className="text-sm font-semibold text-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
