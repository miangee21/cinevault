//src/features/media-items/utils/sortMediaItems.ts
import { calculateProgress } from "./calculateProgress";
import { type MediaItem } from "../types";

export const SORT_OPTIONS = [
  { value: "name_asc", label: "Name (A–Z)" },
  { value: "name_desc", label: "Name (Z–A)" },
  { value: "rating_desc", label: "Rating (High–Low)" },
  { value: "rating_asc", label: "Rating (Low–High)" },
  { value: "progress_asc", label: "Progress (Not Started → Completed)" },
  { value: "progress_desc", label: "Progress (Completed → Not Started)" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

function getProgressValue(item: MediaItem): number {
  const percent = calculateProgress({
    kind: item.kind,
    totalDurationSeconds: item.totalDurationSeconds,
    progressSeconds: item.progressSeconds,
    seasons: item.seasons,
    progressSeason: item.progressSeason,
    progressEpisode: item.progressEpisode,
  });
  if (percent !== null) return percent;
  // Items with no calculable % fall back to status ordering
  if (item.status === "completed") return 100;
  if (item.status === "in_progress") return 50;
  return 0;
}

export function sortMediaItems(
  items: MediaItem[],
  sortOption: SortOption,
): MediaItem[] {
  const sorted = [...items];

  switch (sortOption) {
    case "name_asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "name_desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "rating_desc":
      return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case "rating_asc":
      return sorted.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
    case "progress_asc":
      return sorted.sort((a, b) => getProgressValue(a) - getProgressValue(b));
    case "progress_desc":
      return sorted.sort((a, b) => getProgressValue(b) - getProgressValue(a));
    default:
      return sorted;
  }
}
