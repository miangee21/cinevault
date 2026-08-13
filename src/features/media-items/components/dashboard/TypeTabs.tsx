//src/features/media-items/components/dashboard/TypeTabs.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { type Id } from "@convex/_generated/dataModel";

interface TypeTabsProps {
  value: Id<"categories"> | "all";
  onChange: (value: Id<"categories"> | "all") => void;
}

export function TypeTabs({ value, onChange }: TypeTabsProps) {
  const { categories, isLoading } = useCategories();
  const itemCounts = useQuery(api.mediaItems.getMediaItemCounts);
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
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
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
