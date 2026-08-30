//src/features/media-items/components/form/SeriesFormFields.tsx
"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { SeasonEpisodeInput } from "./SeasonEpisodeInput";
import { type SeriesFormValues } from "../../types";

export function SeriesSeasonsField() {
  const { watch, setValue } = useFormContext<SeriesFormValues>();
  const seasons = watch("seasons") ?? [];

  return (
    <div className="w-64">
      <p className="mb-1.5 text-sm font-medium text-foreground">Seasons</p>
      <SeasonEpisodeInput
        value={seasons}
        onChange={(next) => setValue("seasons", next, { shouldValidate: true })}
      />
    </div>
  );
}

export function SeriesProgressField() {
  const { watch, setValue } = useFormContext<SeriesFormValues>();
  const [timeText, setTimeText] = useState("");

  const status = watch("status");
  const seasons = watch("seasons") ?? [];
  const progressSeason = watch("progressSeason");
  const progressEpisode = watch("progressEpisode");
  const currentSeasonData = seasons.find(
    (s) => s.seasonNumber === progressSeason,
  );

  useEffect(() => {
    if (!progressSeason || !progressEpisode) return;
    const base = `S${progressSeason}E${progressEpisode}`;
    const combined = timeText.trim() ? `${base} - ${timeText.trim()}` : base;
    setValue("progressDescription", combined, { shouldValidate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressSeason, progressEpisode, timeText]);

  if (status !== "in_progress") return null;

  if (seasons.length === 0) {
    return (
      <p className="w-60 text-xs text-muted-foreground">
        Add at least one season to track progress.
      </p>
    );
  }

  return (
    <div className="ml-4 w-64 space-y-3 rounded-2xl border border-border p-3">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">
            Current season
          </p>
          <Select
            value={progressSeason !== undefined ? String(progressSeason) : ""}
            onValueChange={(value) => {
              if (!value) return;
              setValue("progressSeason", Number(value), {
                shouldValidate: true,
              });
            }}
          >
            <SelectTrigger className="h-9 rounded-full px-4">
              <SelectValue placeholder="Season">
                {(value: string | null) =>
                  value ? `Season ${value}` : "Season"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {seasons.map((s) => (
                <SelectItem key={s.seasonNumber} value={String(s.seasonNumber)}>
                  Season {s.seasonNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">
            Current episode
          </p>
          <Input
            type="number"
            min={1}
            max={currentSeasonData?.totalEpisodes}
            placeholder="Episode"
            value={progressEpisode ?? ""}
            disabled={!progressSeason}
            onChange={(e) => {
              const raw = Number(e.target.value) || 1;
              const capped = currentSeasonData
                ? Math.min(raw, currentSeasonData.totalEpisodes)
                : raw;
              setValue("progressEpisode", capped, {
                shouldValidate: true,
              });
            }}
            className="h-9 rounded-full px-4"
          />
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">
          Time in episode (optional)
        </p>
        <Input
          type="text"
          placeholder="e.g. 20m 2s"
          value={timeText}
          onChange={(e) => setTimeText(e.target.value)}
          className="h-9 rounded-full px-4"
        />
      </div>
    </div>
  );
}
