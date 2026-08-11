//src/features/media-items/components/form/SeasonEpisodeInput.tsx
"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/shared/components/ui/input";

interface Season {
  seasonNumber: number;
  totalEpisodes: number;
}

interface SeasonEpisodeInputProps {
  value: Season[];
  onChange: (seasons: Season[]) => void;
}

export function SeasonEpisodeInput({
  value,
  onChange,
}: SeasonEpisodeInputProps) {
  const addSeason = () => {
    const nextNumber =
      value.length > 0 ? Math.max(...value.map((s) => s.seasonNumber)) + 1 : 1;
    onChange([...value, { seasonNumber: nextNumber, totalEpisodes: 1 }]);
  };

  const updateSeason = (index: number, patch: Partial<Season>) => {
    onChange(value.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const removeSeason = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {value.map((season, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Season</span>
            <Input
              type="number"
              min={1}
              value={season.seasonNumber}
              onChange={(e) =>
                updateSeason(index, {
                  seasonNumber: Number(e.target.value) || 1,
                })
              }
              className="h-9 w-16 rounded-full px-3 text-center"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Episodes</span>
            <Input
              type="number"
              min={1}
              value={season.totalEpisodes}
              onChange={(e) =>
                updateSeason(index, {
                  totalEpisodes: Number(e.target.value) || 1,
                })
              }
              className="h-9 w-16 rounded-full px-3 text-center"
            />
          </div>
          <button
            type="button"
            onClick={() => removeSeason(index)}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[hsl(var(--destructive)/0.1)] hover:text-destructive"
            aria-label={`Remove season ${season.seasonNumber}`}
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addSeason}
        className="flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-[hsl(var(--primary)/0.4)] hover:text-primary"
      >
        <Plus className="size-3.5" />
        Add season
      </button>
    </div>
  );
}
