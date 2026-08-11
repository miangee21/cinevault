//src/features/media-items/components/detail/ItemMetaSection.tsx
import { Film, Tv, Clock, Layers } from "lucide-react";
import { calculateProgress } from "../../utils/calculateProgress";
import { formatDuration } from "../../utils/formatDuration";
import { type MediaItem } from "../../types";

export function ItemMetaSection({ item }: { item: MediaItem }) {
  const progress = calculateProgress({
    kind: item.kind,
    totalDurationSeconds: item.totalDurationSeconds,
    progressSeconds: item.progressSeconds,
    seasons: item.seasons,
    progressSeason: item.progressSeason,
    progressEpisode: item.progressEpisode,
  });

  return (
    <div className="rounded-2xl border border-border p-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-2.5">
          {item.kind === "movie" ? (
            <Film className="size-4 text-muted-foreground" />
          ) : (
            <Tv className="size-4 text-muted-foreground" />
          )}
          <div>
            <p className="text-xs text-muted-foreground">Type</p>
            <p className="text-sm font-medium text-foreground">
              {item.kind === "movie" ? "Movie" : "Series"}
            </p>
          </div>
        </div>

        {item.kind === "movie" && item.totalDurationSeconds && (
          <div className="flex items-center gap-2.5">
            <Clock className="size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="text-sm font-medium text-foreground">
                {formatDuration(item.totalDurationSeconds)}
              </p>
            </div>
          </div>
        )}

        {item.kind === "series" && item.seasons && item.seasons.length > 0 && (
          <div className="flex items-center gap-2.5">
            <Layers className="size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Seasons</p>
              <p className="text-sm font-medium text-foreground">
                {item.seasons.length}
              </p>
            </div>
          </div>
        )}

        {progress !== null && (
          <div className="flex items-center gap-2.5">
            <div className="size-3.5 rounded-full border-2 border-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Progress</p>
              <p className="text-sm font-medium text-foreground">{progress}%</p>
            </div>
          </div>
        )}
      </div>

      {item.kind === "series" && item.seasons && item.seasons.length > 0 && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Season breakdown
          </p>
          <div className="flex flex-wrap gap-2">
            {[...item.seasons]
              .sort((a, b) => a.seasonNumber - b.seasonNumber)
              .map((s) => (
                <span
                  key={s.seasonNumber}
                  className="rounded-full bg-[hsl(var(--foreground)/0.05)] px-3 py-1 text-xs text-foreground"
                >
                  Season {s.seasonNumber}: {s.totalEpisodes} episodes
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
