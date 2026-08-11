//src/features/categories/components/IconPicker.tsx
"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { IconGlyph } from "./IconGlyph";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import { CATEGORY_ICONS, type CategoryIconName } from "../constants/iconList";

interface IconPickerProps {
  value: string;
  onChange: (icon: CategoryIconName) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredIcons = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return CATEGORY_ICONS;
    return CATEGORY_ICONS.filter((icon) => icon.toLowerCase().includes(term));
  }, [search]);

  const handleSelect = (icon: CategoryIconName) => {
    onChange(icon);
    setOpen(false);
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-[hsl(var(--foreground)/0.04)] text-foreground transition-colors hover:bg-[hsl(var(--foreground)/0.08)]"
            aria-label="Choose an icon"
          >
            <IconGlyph name={value} className="size-5" />
          </button>
        }
      />

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Choose an icon</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search icons..."
            className="rounded-full pl-10"
            autoFocus
          />
        </div>

        <div className="grid max-h-72 grid-cols-6 gap-2 overflow-y-auto pt-2 pb-1 pr-1">
          {filteredIcons.map((icon) => {
            const isSelected = icon === value;
            return (
              <button
                key={icon}
                type="button"
                onClick={() => handleSelect(icon)}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-xl border transition-colors",
                  isSelected
                    ? "border-primary bg-[hsl(var(--primary)/0.12)] text-primary"
                    : "border-border text-muted-foreground hover:border-[hsl(var(--primary)/0.4)] hover:text-foreground",
                )}
                aria-label={icon}
              >
                <IconGlyph name={icon} className="size-5" />
              </button>
            );
          })}

          {filteredIcons.length === 0 && (
            <p className="col-span-6 py-6 text-center text-sm text-muted-foreground">
              No icons match &quot;{search}&quot;
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
