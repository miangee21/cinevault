//src/features/media-items/components/form/Step3Progress.tsx
"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { StatusSelector } from "./StatusSelector";
import { SeasonEpisodeManager } from "./SeasonEpisodeManager";
import { type MediaItemFormValues, type Season } from "../../types";

export function Step3Progress() {
  const {
    control,
    setValue,
    register,
    formState: { errors },
  } = useFormContext<MediaItemFormValues>();

  const kind = useWatch({ control, name: "kind" });
  const status = useWatch({ control, name: "status" });

  const totalDurationSeconds = useWatch({
    control,
    name: "totalDurationSeconds",
  });
  const progressSeconds = useWatch({ control, name: "progressSeconds" });

  const seasons = (useWatch({ control, name: "seasons" }) ?? []) as Season[];
  const progressSeason = useWatch({ control, name: "progressSeason" });
  const progressEpisode = useWatch({ control, name: "progressEpisode" });

  const seasonError = (errors as Record<string, { message?: string }>)
    .progressSeason?.message;
  const episodeError = (errors as Record<string, { message?: string }>)
    .progressEpisode?.message;

  // Time conversion helpers
  const totalH = totalDurationSeconds
    ? Math.floor(totalDurationSeconds / 3600)
    : "";
  const totalM = totalDurationSeconds
    ? Math.floor((totalDurationSeconds % 3600) / 60)
    : "";
  const progH = progressSeconds ? Math.floor(progressSeconds / 3600) : "";
  const progM = progressSeconds
    ? Math.floor((progressSeconds % 3600) / 60)
    : "";

  const handleTotal = (h: number, m: number) => {
    const total = h * 3600 + m * 60;
    setValue("totalDurationSeconds", total > 0 ? total : undefined, {
      shouldValidate: true,
    });
  };

  const handleProg = (h: number, m: number) => {
    const total = h * 3600 + m * 60;
    setValue("progressSeconds", total > 0 ? total : undefined, {
      shouldValidate: true,
    });
  };

  const currentSeasonData = seasons.find(
    (s) => s.seasonNumber === progressSeason,
  );

  return (
    <div className="animate-in fade-in slide-in-from-right-4 flex flex-col gap-6 duration-300 sm:flex-row sm:items-start">
      {/* Left Column (Static) */}
      <div className="flex flex-1 flex-col gap-6">
        <StatusSelector />

        {kind === "movie" ? (
          <div className="w-full space-y-2">
            <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Duration{" "}
              <span className="px-1 normal-case text-muted-foreground/60">
                (Optional)
              </span>
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  type="number"
                  min={0}
                  placeholder="Hours"
                  value={totalH}
                  onChange={(e) =>
                    handleTotal(
                      Number(e.target.value) || 0,
                      Number(totalM) || 0,
                    )
                  }
                  className="h-12 w-full rounded-full border-border/50 bg-[hsl(var(--foreground)/0.02)] px-5 font-medium shadow-sm transition-all focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <span className="text-muted-foreground">:</span>
              <div className="flex-1">
                <Input
                  type="number"
                  min={0}
                  max={59}
                  placeholder="Minutes"
                  value={totalM}
                  onChange={(e) =>
                    handleTotal(
                      Number(totalH) || 0,
                      Number(e.target.value) || 0,
                    )
                  }
                  className="h-12 w-full rounded-full border-border/50 bg-[hsl(var(--foreground)/0.02)] px-5 font-medium shadow-sm transition-all focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        ) : (
          <SeasonEpisodeManager />
        )}
      </div>

      {/* Right Column (Conditional: Only for In Progress) */}
      <div className="flex flex-1 flex-col gap-6">
        {status === "in_progress" ? (
          <div className="animate-in fade-in slide-in-from-top-2 rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-sm duration-300">
            <h4 className="mb-4 text-sm font-semibold text-primary">
              In Progress Details
            </h4>

            {kind === "movie" ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Time Watched <span className="text-destructive">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      min={0}
                      placeholder="Hours"
                      value={progH}
                      onChange={(e) =>
                        handleProg(
                          Number(e.target.value) || 0,
                          Number(progM) || 0,
                        )
                      }
                      className="h-10 w-full rounded-full border-border/50 bg-background px-4 font-medium shadow-sm focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="text-muted-foreground">:</span>
                    <Input
                      type="number"
                      min={0}
                      max={59}
                      placeholder="Minutes"
                      value={progM}
                      onChange={(e) =>
                        handleProg(
                          Number(progH) || 0,
                          Number(e.target.value) || 0,
                        )
                      }
                      className="h-10 w-full rounded-full border-border/50 bg-background px-4 font-medium shadow-sm focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  {errors.progressDescription && !progressSeconds && (
                    <p className="ml-1 mt-1 text-[10px] font-medium text-destructive">
                      {errors.progressDescription.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Description{" "}
                    <span className="px-1 normal-case text-muted-foreground/60">
                      (Or time)
                    </span>
                  </label>
                  <Textarea
                    placeholder="e.g. 32m 45s in"
                    className="min-h-16 resize-none rounded-xl border-border/50 bg-background text-sm shadow-sm focus-visible:ring-primary/20"
                    {...register("progressDescription")}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1 space-y-2">
                    <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Season <span className="text-destructive">*</span>
                    </label>
                    <Select
                      value={
                        progressSeason !== undefined
                          ? String(progressSeason)
                          : ""
                      }
                      onValueChange={(val) =>
                        setValue("progressSeason", Number(val), {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger className="h-10 w-full rounded-full border-border/50 bg-background px-4 font-medium shadow-sm focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent
                        side="bottom"
                        className="rounded-xl border-border/50"
                      >
                        {seasons.map((s) => (
                          <SelectItem
                            key={s.seasonNumber}
                            value={String(s.seasonNumber)}
                            className="rounded-lg"
                          >
                            Season {s.seasonNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {seasonError && (
                      <p className="ml-1 mt-1 text-[10px] font-medium text-destructive">
                        {seasonError}
                      </p>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Episode <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="number"
                      min={1}
                      max={currentSeasonData?.totalEpisodes}
                      placeholder="Ep"
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
                      className="h-10 w-full rounded-full border-border/50 bg-background px-4 font-medium shadow-sm focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    />
                    {episodeError && (
                      <p className="ml-1 mt-1 text-[10px] font-medium text-destructive">
                        {episodeError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Time in episode{" "}
                    <span className="px-1 normal-case text-muted-foreground/60">
                      (Optional)
                    </span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. 20m 2s"
                    className="h-10 w-full rounded-full border-border/50 bg-background px-4 font-medium shadow-sm focus:ring-2 focus:ring-primary/20"
                    {...register("progressDescription")}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full min-h-50 flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-[hsl(var(--foreground)/0.01)] text-center">
            <span className="text-sm font-medium text-muted-foreground">
              No progress tracking needed for
              <br /> {status === "not_started"
                ? "Not Started"
                : "Completed"}{" "}
              items.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
