//src/featutres/media-items/utils/calculateProgress.ts
interface Season {
  seasonNumber: number;
  totalEpisodes: number;
}

interface ProgressInput {
  kind: "movie" | "series";
  totalDurationSeconds?: number;
  progressSeconds?: number;
  seasons?: Season[];
  progressSeason?: number;
  progressEpisode?: number;
}

export function calculateProgress({
  kind,
  totalDurationSeconds,
  progressSeconds,
  seasons,
  progressSeason,
  progressEpisode,
}: ProgressInput): number | null {
  if (kind === "movie") {
    if (!totalDurationSeconds || totalDurationSeconds <= 0) return null;
    if (progressSeconds === undefined) return null;
    const percent = (progressSeconds / totalDurationSeconds) * 100;
    return Math.min(100, Math.max(0, Math.round(percent)));
  }

  // series
  if (!seasons || seasons.length === 0) return null;
  if (progressSeason === undefined || progressEpisode === undefined)
    return null;

  const sorted = [...seasons].sort((a, b) => a.seasonNumber - b.seasonNumber);
  const totalEpisodes = sorted.reduce((sum, s) => sum + s.totalEpisodes, 0);
  if (totalEpisodes <= 0) return null;

  let completedEpisodes = 0;
  for (const season of sorted) {
    if (season.seasonNumber < progressSeason) {
      completedEpisodes += season.totalEpisodes;
    } else if (season.seasonNumber === progressSeason) {
      completedEpisodes += Math.min(progressEpisode, season.totalEpisodes);
    }
  }

  const percent = (completedEpisodes / totalEpisodes) * 100;
  return Math.min(100, Math.max(0, Math.round(percent)));
}
