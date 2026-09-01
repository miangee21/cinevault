//src/features/media-items/components/dashboard/TypeTabs.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Search } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { type Id } from "@convex/_generated/dataModel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

interface TypeTabsProps {
  value: Id<"categories"> | "all";
  onChange: (value: Id<"categories"> | "all") => void;
  subcategoryValue: Id<"subcategories"> | "all";
  onSubcategoryChange: (value: Id<"subcategories"> | "all") => void;
}

function CategoryTabNode({
  category,
  isActive,
  onClick,
  subcategoryValue,
  onSubcategoryChange,
}: {
  category: { id: Id<"categories">; name: string; count?: number };
  isActive: boolean;
  onClick: () => void;
  subcategoryValue: Id<"subcategories"> | "all";
  onSubcategoryChange: (value: Id<"subcategories"> | "all") => void;
}) {
  const subcategories =
    useQuery(api.subcategories.getSubcategories, { categoryId: category.id }) ||
    [];
  const hasSubcategories = subcategories.length > 0;
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = subcategories.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className={cn(
        "flex items-center rounded-full transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-transparent text-muted-foreground hover:bg-[hsl(var(--foreground)/0.06)]",
      )}
    >
      <button
        type="button"
        onClick={() => {
          onClick();
          onSubcategoryChange("all");
        }}
        className={cn(
          "shrink-0 whitespace-nowrap py-1.5 text-sm font-medium transition-colors flex items-center",
          hasSubcategories ? "pl-3.5 pr-2" : "px-3.5",
          isActive ? "text-primary-foreground" : "hover:text-foreground",
        )}
      >
        {category.name}
        {category.count !== undefined && (
          <span
            className={cn(
              "ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums leading-none transition-colors",
              isActive
                ? "bg-primary-foreground/20 text-primary-foreground ring-1 ring-primary-foreground/10"
                : "bg-[hsl(var(--foreground)/0.08)] text-foreground/70 ring-1 ring-[hsl(var(--foreground)/0.06)]",
            )}
          >
            {category.count}
          </span>
        )}
      </button>

      {hasSubcategories && (
        <>
          <div
            className={cn(
              "w-px h-4 mx-0.5 opacity-30",
              isActive ? "bg-primary-foreground" : "bg-border",
            )}
          />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              render={
                <button
                  type="button"
                  className={cn(
                    "flex items-center justify-center shrink-0 rounded-r-full pr-2 pl-1 py-1.5 transition-colors",
                    isActive
                      ? "text-primary-foreground hover:text-primary-foreground/80"
                      : "hover:text-foreground",
                  )}
                >
                  <ChevronDown className="size-4" />
                </button>
              }
            />
            <PopoverContent
              className="w-56 p-2 rounded-xl shadow-dropdown border-border bg-popover"
              align="start"
            >
              <div className="relative mb-2">
                <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search subcategories..."
                  className="h-8 w-full rounded-md border border-border bg-[hsl(var(--foreground)/0.03)] pl-8 pr-3 text-xs outline-none focus:border-[hsl(var(--primary)/0.5)]"
                />
              </div>
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto scrollbar-none">
                <button
                  onClick={() => {
                    onClick();
                    onSubcategoryChange("all");
                    setOpen(false);
                  }}
                  className={cn(
                    "flex items-center justify-between px-2 py-1.5 text-sm rounded-md transition-colors",
                    subcategoryValue === "all" && isActive
                      ? "bg-accent text-accent-foreground font-medium"
                      : "hover:bg-[hsl(var(--foreground)/0.06)] hover:text-foreground",
                  )}
                >
                  <span>All {category.name}</span>
                </button>
                {filtered.map((sub) => (
                  <button
                    key={sub._id}
                    onClick={() => {
                      onClick();
                      onSubcategoryChange(sub._id);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between px-2 py-1.5 text-sm rounded-md transition-colors",
                      subcategoryValue === sub._id
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-[hsl(var(--foreground)/0.06)] hover:text-foreground",
                    )}
                  >
                    <span className="truncate">{sub.name}</span>
                    <span className="text-[10px] bg-[hsl(var(--foreground)/0.06)] px-1.5 py-0.5 rounded-full text-muted-foreground shrink-0">
                      {sub.itemCount || 0}
                    </span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </>
      )}
    </div>
  );
}

export function TypeTabs({
  value,
  onChange,
  subcategoryValue,
  onSubcategoryChange,
}: TypeTabsProps) {
  const { categories, isLoading } = useCategories();
  const itemCounts = useQuery(api.mediaItemQueries.getMediaItemCounts);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [categories.length]);

  const scrollBy = (amount: number) =>
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });

  if (isLoading || categories.length === 0) return null;
  const tabs: {
    id: Id<"categories"> | "all";
    name: string;
    count?: number;
  }[] = [
    {
      id: "all",
      name: "All",
      count: value === "all" ? itemCounts?.total : undefined,
    },
    ...categories.map((c) => ({
      id: c._id,
      name: c.name,
      count: value === c._id ? itemCounts?.byCategory[c._id] : undefined,
    })),
  ];

  return (
    <div className="relative flex min-w-0 flex-1 items-center">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollBy(-160)}
          className="absolute left-0 z-10 flex size-7 items-center justify-center rounded-full bg-background shadow-md ring-1 ring-border"
          aria-label="Scroll left"
        >
          <ChevronLeft className="size-3.5" />
        </button>
      )}

      <div
        ref={scrollRef}
        className={cn(
          "flex items-center gap-1.5 overflow-x-auto scroll-smooth px-1 scrollbar-none [&::-webkit-scrollbar]:hidden",
          canScrollLeft && "pl-9",
          canScrollRight && "pr-9",
        )}
      >
        {tabs.map((tab) => {
          const isActive = value === tab.id;
          if (tab.id === "all") {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  onChange(tab.id);
                  onSubcategoryChange("all");
                }}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors flex items-center",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-[hsl(var(--foreground)/0.06)] hover:text-foreground",
                )}
              >
                {tab.name}
                {tab.count !== undefined && (
                  <span
                    className={cn(
                      "ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums leading-none transition-colors",
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground ring-1 ring-primary-foreground/10"
                        : "bg-[hsl(var(--foreground)/0.08)] text-foreground/70 ring-1 ring-[hsl(var(--foreground)/0.06)]",
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          }

          return (
            <CategoryTabNode
              key={tab.id}
              category={{ id: tab.id, name: tab.name, count: tab.count }}
              isActive={isActive}
              onClick={() => onChange(tab.id)}
              subcategoryValue={subcategoryValue}
              onSubcategoryChange={onSubcategoryChange}
            />
          );
        })}
      </div>

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollBy(160)}
          className="absolute right-0 z-10 flex size-7 items-center justify-center rounded-full bg-background shadow-md ring-1 ring-border"
          aria-label="Scroll right"
        >
          <ChevronRight className="size-3.5" />
        </button>
      )}
    </div>
  );
}
