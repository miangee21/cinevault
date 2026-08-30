"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import * as LucideIcons from "lucide-react";
import { CustomScrollbar } from "@/shared/components/CustomScrollbar";

export const CURATED_ICONS = [
  // Formats / mediums
  "Clapperboard",
  "Film",
  "Tv",
  "Tv2",
  "Video",
  "Camera",
  "Popcorn",
  "Ticket",
  "Disc3",
  "Album",
  "PlayCircle",
  "MonitorPlay",

  // Genres / moods
  "Ghost",
  "Skull",
  "Swords",
  "Wand2",
  "Rocket",
  "Bomb",
  "Flame",
  "Heart",
  "HeartCrack",
  "Laugh",
  "Drama",
  "Sparkles",
  "Zap",
  "Crown",
  "Shield",
  "Gem",
  "Music",
  "Mic2",
  "PartyPopper",

  // Themes / settings
  "Globe",
  "Globe2",
  "MapPin",
  "Compass",
  "Mountain",
  "Building2",
  "Landmark",
  "Trees",
  "Waves",
  "Sun",
  "Moon",
  "Star",
  "Rainbow",

  // People / groups
  "Users",
  "User",
  "Baby",
  "Cat",
  "Dog",

  // Language / region flags-as-concepts
  "Flag",
  "Languages",
  "BookOpen",

  // Status / meta
  "Clock",
  "History",
  "TrendingUp",
  "Award",
  "Trophy",
  "FolderHeart",
  "Bookmark",
  "Eye",
  "EyeOff",

  // System (used internally, e.g. Uncategorized)
  "FolderX",
] as const;

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  disabled?: boolean;
}

export function IconPicker({ value, onChange, disabled }: IconPickerProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredIcons = CURATED_ICONS.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
        <input
          type="text"
          placeholder="Search icons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={disabled}
          className="w-full bg-background/50 ring-1 ring-border/50 focus:ring-2 focus:ring-primary/60 h-10 rounded-xl pl-9 pr-4 text-sm font-medium outline-none transition-all placeholder:text-muted-foreground/50"
        />
      </div>

      <CustomScrollbar className="grid grid-cols-6 sm:grid-cols-7 gap-2 max-h-44 p-1 pr-2">
        {filteredIcons.map((iconName) => {
          const IconComponent = LucideIcons[
            iconName as keyof typeof LucideIcons
          ] as React.ElementType;
          if (!IconComponent) return null;
          const isSelected = value === iconName;

          return (
            <button
              key={iconName}
              type="button"
              disabled={disabled}
              onClick={() => onChange(iconName)}
              title={iconName}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 border",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-md scale-110"
                  : "bg-background border-border/40 text-muted-foreground hover:bg-muted hover:border-border hover:text-foreground",
                disabled && "opacity-50 pointer-events-none",
              )}
            >
              <IconComponent
                className={cn(
                  "w-5 h-5",
                  isSelected && "animate-in zoom-in duration-300",
                )}
              />
            </button>
          );
        })}
        {filteredIcons.length === 0 && (
          <div className="col-span-full py-4 text-center text-sm text-muted-foreground">
            No icons found for &quot;{searchTerm}&quot;
          </div>
        )}
      </CustomScrollbar>
    </div>
  );
}
