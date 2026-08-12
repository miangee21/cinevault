//src/features/media-items/utils/sortMediaItems.ts
export const SORT_OPTIONS = [
  { value: "name_asc", label: "Name (A–Z)" },
  { value: "name_desc", label: "Name (Z–A)" },
  { value: "rating_desc", label: "Rating (High–Low)" },
  { value: "rating_asc", label: "Rating (Low–High)" },
  { value: "completed_first", label: "Completed First" },
  { value: "in_progress_first", label: "In Progress First" },
  { value: "not_started_first", label: "Not Started First" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];
