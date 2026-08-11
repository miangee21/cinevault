//src/features/media-items/utils/formatDuration.ts
export function formatDuration(
  totalSeconds: number | undefined | null,
): string {
  if (!totalSeconds || totalSeconds <= 0) return "—";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}
