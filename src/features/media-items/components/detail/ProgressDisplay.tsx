//src/features/media-items/components/detail/ProgressDisplay.tsx
import { StatusBadge } from "../dashboard/StatusBadge";
import { calculateProgress } from "../../utils/calculateProgress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { type MediaItem } from "../../types";

export function ProgressDisplay({ item }: { item: MediaItem }) {
  const progress = calculateProgress({
    kind: item.kind,
    totalDurationSeconds: item.totalDurationSeconds,
    progressSeconds: item.progressSeconds,
    seasons: item.seasons,
    progressSeason: item.progressSeason,
    progressEpisode: item.progressEpisode,
  });

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border/50 bg-[hsl(var(--foreground)/0.015)] p-3.5 transition-colors hover:bg-[hsl(var(--foreground)/0.03)]">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Progress
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <StatusBadge item={item} />
          {progress !== null && (
            <span className="text-xs font-medium text-muted-foreground">
              {progress}%
            </span>
          )}
        </div>

        {item.status === "in_progress" &&
        (item.progressSeconds ||
          item.progressSeason ||
          item.progressEpisode ||
          item.progressDescription) ? (
          <div className="flex flex-col gap-1">
            {item.kind === "movie" && !!item.progressSeconds && (
              <span className="text-sm font-medium text-foreground">
                Time Watched: {Math.floor(item.progressSeconds / 3600)}h{" "}
                {Math.floor((item.progressSeconds % 3600) / 60)}m
              </span>
            )}

            {item.kind === "series" &&
              (!!item.progressSeason || !!item.progressEpisode) && (
                <span className="text-sm font-medium text-foreground">
                  Current Position:{" "}
                  {item.progressSeason ? `Season ${item.progressSeason}` : ""}{" "}
                  {item.progressEpisode
                    ? `Episode ${item.progressEpisode}`
                    : ""}
                </span>
              )}

            {item.progressDescription && (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <span className="truncate block text-sm text-muted-foreground text-left cursor-default">
                      {item.progressDescription}
                    </span>
                  }
                />
                <TooltipContent className="max-w-xs wrap-break-word">
                  {item.progressDescription}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
