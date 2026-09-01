//src/features/media-items/components/dashboard/StatusBadge.tsx
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";
import { type MediaItem } from "../../types";
import { formatDuration } from "../../utils/formatDuration";

const STATUS_CONFIG = {
  not_started: {
    label: "Not Started",
    textClass: "text-status-not-started",
    bgClass: "bg-status-not-started",
  },
  in_progress: {
    label: "In Progress",
    textClass: "text-status-in-progress",
    bgClass: "bg-status-in-progress",
  },
  completed: {
    label: "Completed",
    textClass: "text-status-completed",
    bgClass: "bg-status-completed",
  },
} as const;

interface StatusBadgeProps {
  item: MediaItem;
}

export function StatusBadge({ item }: StatusBadgeProps) {
  const config = STATUS_CONFIG[item.status];

  const badge = (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        config.bgClass,
        config.textClass,
      )}
    >
      {config.label}
    </span>
  );

  let tooltipText: string = config.label; // Explicitly typed as string for dynamic values

  if (item.status === "in_progress") {
    const parts = [];

    // Movie logic (Hours/Mins)
    if (item.kind === "movie" && item.progressSeconds) {
      parts.push(formatDuration(item.progressSeconds));
    }
    // Series logic (S, E)
    else if (item.kind === "series") {
      if (item.progressSeason) parts.push(`S${item.progressSeason}`);
      if (item.progressEpisode) parts.push(`E${item.progressEpisode}`);
    }

    // Description at the end
    if (item.progressDescription?.trim()) {
      parts.push(item.progressDescription.trim());
    }

    if (parts.length > 0) {
      tooltipText = parts.join(", ");
    } else {
      tooltipText = "In Progress";
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={<span className="inline-block cursor-default">{badge}</span>}
      />
      <TooltipContent className="max-w-xs capitalize font-medium">
        {tooltipText}
      </TooltipContent>
    </Tooltip>
  );
}
