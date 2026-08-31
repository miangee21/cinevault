//src/features/media-items/components/form/SubcategorySelector.tsx
"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Check, Tags, ChevronsUpDown } from "lucide-react";
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
import { useSubcategories } from "@/features/categories/hooks/useSubcategories";
import { type MediaItemFormValues } from "../../types";
import { type Id } from "@convex/_generated/dataModel";

export function SubcategorySelector() {
  const { control, setValue } = useFormContext<MediaItemFormValues>();

  const categoryId = useWatch({ control, name: "categoryId" }) as
    Id<"categories"> | undefined;
  const subcategoryIds = (useWatch({ control, name: "subcategoryIds" }) ??
    []) as string[];

  const { subcategories, isLoading } = useSubcategories(categoryId);

  const toggleSubcategory = (id: string) => {
    const next = subcategoryIds.includes(id)
      ? subcategoryIds.filter((s) => s !== id)
      : [...subcategoryIds, id];
    setValue("subcategoryIds", next, { shouldValidate: true });
  };

  const getDisplayText = () => {
    if (!categoryId) return "Select a category first";
    if (isLoading) return "Loading...";
    if (subcategoryIds.length === 0) return "Select subcategories";
    if (subcategoryIds.length === 1) {
      return (
        subcategories.find((s) => s._id === subcategoryIds[0])?.name ??
        "1 selected"
      );
    }
    return `${subcategoryIds.length} selected`;
  };

  return (
    <div className="w-full space-y-2">
      <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Subcategories{" "}
        <span className="text-muted-foreground/60 px-1">(Optional)</span>
      </label>

      <Popover>
        <PopoverTrigger
          type="button"
          disabled={!categoryId}
          className={cn(
            "flex h-12 w-full items-center justify-between rounded-full border border-border/50 bg-[hsl(var(--foreground)/0.02)] px-4 text-sm font-medium shadow-sm transition-all hover:bg-[hsl(var(--foreground)/0.04)] focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
            subcategoryIds.length === 0 && "text-muted-foreground",
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <Tags className="size-4 shrink-0 opacity-70" />
            <span className="truncate">{getDisplayText()}</span>
          </div>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          sideOffset={8}
          className="w-(--radix-popover-trigger-width) overflow-hidden rounded-2xl border border-border/50 bg-popover p-0 shadow-dropdown"
        >
          <Command>
            <CommandInput
              placeholder="Search subcategories..."
              className="h-11"
            />
            <CommandList className="max-h-48 overflow-y-auto p-1">
              <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
                No subcategories found.
              </CommandEmpty>
              <CommandGroup>
                {subcategories.map((sub) => {
                  const isSelected = subcategoryIds.includes(sub._id);
                  return (
                    <CommandItem
                      key={sub._id}
                      value={sub.name}
                      onSelect={() => toggleSubcategory(sub._id)}
                      className="cursor-pointer rounded-xl py-2.5 pl-3 pr-4 transition-colors hover:bg-[hsl(var(--foreground)/0.04)] aria-selected:bg-[hsl(var(--foreground)/0.04)]"
                    >
                      <div
                        className={cn(
                          "mr-3 flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/30",
                        )}
                      >
                        {isSelected && <Check className="size-3" />}
                      </div>
                      <span
                        className={cn(
                          "font-medium",
                          isSelected && "text-foreground",
                        )}
                      >
                        {sub.name}
                      </span>
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
