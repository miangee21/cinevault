//src/features/media-items/components/form/SeasonEpisodeManager.tsx
"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { CustomScrollbar } from "@/shared/components/CustomScrollbar";
import { cn } from "@/shared/lib/utils";
import { type SeriesFormValues, type Season } from "../../types";

export function SeasonEpisodeManager() {
  const { control, setValue } = useFormContext<SeriesFormValues>();
  const seasons = useWatch({ control, name: "seasons" }) ?? [];

  const addSeason = () => {
    const nextNumber =
      seasons.length > 0
        ? Math.max(...seasons.map((s) => s.seasonNumber)) + 1
        : 1;
    setValue(
      "seasons",
      [...seasons, { seasonNumber: nextNumber, totalEpisodes: 1 }],
      {
        shouldValidate: true,
      },
    );
  };

  const updateSeason = (index: number, patch: Partial<Season>) => {
    const next = seasons.map((s, i) => (i === index ? { ...s, ...patch } : s));
    setValue("seasons", next, { shouldValidate: true });
  };

  const removeSeason = (index: number) => {
    if (seasons.length <= 1) return; // Series must have at least 1 season
    setValue(
      "seasons",
      seasons.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

  return (
    <div className="w-full space-y-3">
      <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Seasons & Episodes <span className="text-destructive">*</span>
      </label>

      <div className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-[hsl(var(--foreground)/0.02)] p-4 shadow-sm">
        <CustomScrollbar
          className={cn(
            "flex flex-col gap-3 transition-all duration-300",
            seasons.length > 2 ? "max-h-26 pr-2" : "max-h-full pr-0",
          )}
        >
          {seasons.map((season, index) => (
            <div key={index} className="flex shrink-0 items-center gap-3">
              <div className="flex flex-1 items-center gap-2">
                <span className="w-14 text-xs font-medium text-muted-foreground">
                  Season
                </span>
                <Input
                  type="number"
                  min={1}
                  value={season.seasonNumber || ""}
                  onChange={(e) =>
                    updateSeason(index, {
                      seasonNumber: Number(e.target.value) || 1,
                    })
                  }
                  className="h-10 w-full rounded-full bg-background px-4 text-center shadow-sm"
                />
              </div>

              <div className="flex flex-1 items-center gap-2">
                <span className="w-16 text-xs font-medium text-muted-foreground">
                  Episodes
                </span>
                <Input
                  type="number"
                  min={1}
                  value={season.totalEpisodes || ""}
                  onChange={(e) =>
                    updateSeason(index, {
                      totalEpisodes: Number(e.target.value) || 1,
                    })
                  }
                  className="h-10 w-full rounded-full bg-background px-4 text-center shadow-sm"
                />
              </div>

              <button
                type="button"
                onClick={() => removeSeason(index)}
                disabled={seasons.length <= 1}
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                aria-label="Remove season"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </CustomScrollbar>

        <button
          type="button"
          onClick={addSeason}
          className="group mt-2 flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-full border border-dashed border-border/60 bg-transparent text-sm font-semibold text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
        >
          <Plus className="size-4 transition-transform group-hover:scale-110" />
          Add Season
        </button>
      </div>
    </div>
  );
}
