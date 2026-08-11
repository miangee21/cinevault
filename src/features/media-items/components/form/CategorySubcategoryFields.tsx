//src/features/media-items/components/form/CategorySubcategoryFields.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { useSubcategories } from "@/features/categories/hooks/useSubcategories";
import { type MediaItemFormValues } from "../../types";
import { type Id } from "@convex/_generated/dataModel";

export function CategoryField() {
  const { watch, setValue } = useFormContext<MediaItemFormValues>();
  const { categories } = useCategories();
  const categoryId = watch("categoryId") as string | undefined;
  const selectedCategory = categories.find((cat) => cat._id === categoryId);

  const selectCategory = (id: string) => {
    setValue("categoryId", id, { shouldValidate: true });
    setValue("subcategoryIds", [] as any, { shouldValidate: true });
  };

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-foreground">Category</p>
      <Popover>
        <PopoverTrigger
          render={
            <button
              type="button"
              className="flex h-10 w-full items-center justify-between rounded-full border border-border bg-[hsl(var(--foreground)/0.04)] px-4 text-sm text-foreground"
            >
              <span
                className={cn(
                  "truncate",
                  !selectedCategory && "text-muted-foreground",
                )}
              >
                {selectedCategory ? selectedCategory.name : "Select category"}
              </span>
              <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
            </button>
          }
        />
        <PopoverContent className="w-64 p-0">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              <CommandEmpty>No categories found.</CommandEmpty>
              <CommandGroup>
                {categories.map((cat) => {
                  const isSelected = cat._id === categoryId;
                  return (
                    <CommandItem
                      key={cat._id}
                      onSelect={() => selectCategory(cat._id)}
                    >
                      <Check
                        className={cn(
                          "size-4",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {cat.name}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function SubcategoryField() {
  const { watch, setValue } = useFormContext<MediaItemFormValues>();
  const categoryId = watch("categoryId") as string | undefined;
  const subcategoryIds = (watch("subcategoryIds") ?? []) as string[];

  const { subcategories } = useSubcategories(
    categoryId ? (categoryId as Id<"categories">) : undefined,
  );

  const toggleSubcategory = (id: string) => {
    const next = subcategoryIds.includes(id)
      ? subcategoryIds.filter((s) => s !== id)
      : [...subcategoryIds, id];
    setValue("subcategoryIds", next as any, { shouldValidate: true });
  };

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-foreground">
        Subcategories
      </p>
      <Popover>
        <PopoverTrigger
          render={
            <button
              type="button"
              disabled={!categoryId}
              className="flex h-10 w-full items-center justify-between rounded-full border border-border bg-[hsl(var(--foreground)/0.04)] px-4 text-sm text-foreground disabled:opacity-50"
            >
              <span className="truncate text-muted-foreground">
                {subcategoryIds.length > 0
                  ? `${subcategoryIds.length} selected`
                  : "Select subcategories"}
              </span>
              <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
            </button>
          }
        />
        <PopoverContent className="w-64 p-0">
          <Command>
            <CommandInput placeholder="Search subcategories..." />
            <CommandList>
              <CommandEmpty>No subcategories found.</CommandEmpty>
              <CommandGroup>
                {subcategories.map((sub) => {
                  const isSelected = subcategoryIds.includes(sub._id);
                  return (
                    <CommandItem
                      key={sub._id}
                      onSelect={() => toggleSubcategory(sub._id)}
                    >
                      <Check
                        className={cn(
                          "size-4",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {sub.name}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
