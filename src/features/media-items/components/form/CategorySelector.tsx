//src/features/media-items/components/form/CategorySelector.tsx
"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Check, ChevronsUpDown, FolderOpen } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import { cn } from "@/shared/lib/utils";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { type MediaItemFormValues } from "../../types";

export function CategorySelector() {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<MediaItemFormValues>();
  const { categories, isLoading } = useCategories();

  const categoryId = useWatch({ control, name: "categoryId" });
  const selectedCategory = categories.find((cat) => cat._id === categoryId);

  const handleSelect = (id: string) => {
    setValue("categoryId", id, { shouldValidate: true });
    // Reset subcategories when category changes
    setValue("subcategoryIds", [], { shouldValidate: true });
  };

  return (
    <div className="w-full space-y-2">
      <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Category <span className="text-destructive">*</span>
      </label>

      <Popover>
        <PopoverTrigger
          type="button"
          className={cn(
            "flex h-12 w-full items-center justify-between rounded-full border border-border/50 bg-[hsl(var(--foreground)/0.02)] px-4 text-sm font-medium shadow-sm transition-all hover:bg-[hsl(var(--foreground)/0.04)] focus:outline-none focus:ring-2 focus:ring-primary/20",
            !selectedCategory && "text-muted-foreground",
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <FolderOpen className="size-4 shrink-0 opacity-70" />
            <span className="truncate">
              {isLoading
                ? "Loading..."
                : selectedCategory
                  ? selectedCategory.name
                  : "Select category"}
            </span>
          </div>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          sideOffset={8}
          className="w-(--radix-popover-trigger-width) overflow-hidden rounded-2xl border border-border/50 bg-popover p-0 shadow-dropdown"
        >
          <Command>
            <CommandInput placeholder="Search categories..." className="h-11" />
            <CommandList className="max-h-48 overflow-y-auto p-1">
              <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
                No category found.
              </CommandEmpty>
              <CommandGroup>
                {categories.map((cat) => {
                  const isSelected = cat._id === categoryId;
                  return (
                    <CommandItem
                      key={cat._id}
                      value={cat.name}
                      onSelect={() => handleSelect(cat._id)}
                      className="cursor-pointer rounded-xl py-2.5 pl-3 pr-4 transition-colors hover:bg-[hsl(var(--foreground)/0.04)] aria-selected:bg-[hsl(var(--foreground)/0.04)]"
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4 shrink-0 text-primary transition-opacity duration-200",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <span
                        className={cn(
                          "font-medium",
                          isSelected && "text-primary",
                        )}
                      >
                        {cat.name}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {errors.categoryId && (
        <p className="ml-1 text-[10px] font-medium text-destructive">
          {errors.categoryId.message as string}
        </p>
      )}
    </div>
  );
}
