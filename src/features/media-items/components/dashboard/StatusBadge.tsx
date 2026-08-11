//src/features/media-items/components/dashboard/StatusBadge.tsx
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";

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
  status: "not_started" | "in_progress" | "completed";
  progressDescription?: string;
}

export function StatusBadge({ status, progressDescription }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

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

  if (status === "in_progress" && progressDescription) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={<span className="inline-block">{badge}</span>}
        />
        <TooltipContent>{progressDescription}</TooltipContent>
      </Tooltip>
    );
  }

  return badge;
}
