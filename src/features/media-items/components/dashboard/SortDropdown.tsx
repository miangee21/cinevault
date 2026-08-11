//src/features/media-items/components/dashboard/SortDropdown.tsx
"use client";

import { useState } from "react";
import { ArrowUpDown, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";
import { SORT_OPTIONS, type SortOption } from "../../utils/sortMediaItems";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const current = SORT_OPTIONS.find((o) => o.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="flex h-10 shrink-0 items-center gap-2 rounded-full border border-border bg-[hsl(var(--foreground)/0.04)] px-4 text-sm text-foreground"
          >
            <ArrowUpDown className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="whitespace-nowrap">
              {current?.label ?? "Sort"}
            </span>
          </button>
        }
      />
      <PopoverContent align="end" className="w-72 p-1">
        {SORT_OPTIONS.map((opt) => {
          const isSelected = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-[hsl(var(--foreground)/0.06)]",
                isSelected ? "font-medium text-primary" : "text-foreground",
              )}
            >
              <Check
                className={cn(
                  "size-3.5 shrink-0",
                  isSelected ? "opacity-100" : "opacity-0",
                )}
              />
              {opt.label}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
