//src/features/media-items/components/detail/StorageDisplay.tsx
import { HardDrive, Cloud } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { type MediaItem } from "../../types";

export function StorageDisplay({ item }: { item: MediaItem }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border/50 bg-[hsl(var(--foreground)/0.015)] p-3.5 transition-colors hover:bg-[hsl(var(--foreground)/0.03)]">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Storage
        </p>
      </div>
      <div className="flex flex-col gap-2 text-xs pt-1 overflow-hidden">
        <div className="flex items-center gap-2">
          <HardDrive
            className={`size-3.5 shrink-0 ${item.hasHard ? "text-[hsl(var(--storage-hard))]" : "text-storage-inactive"}`}
          />
          <Tooltip>
            <TooltipTrigger
              render={
                <span
                  className={
                    item.hasHard
                      ? "truncate font-medium text-foreground text-left cursor-default block"
                      : "text-muted-foreground"
                  }
                >
                  {item.hasHard
                    ? item.hardDescription || "On hard drive"
                    : "Not on hard drive"}
                </span>
              }
            />
            {item.hasHard && item.hardDescription && (
              <TooltipContent className="max-w-xs wrap-break-word">
                {item.hardDescription}
              </TooltipContent>
            )}
          </Tooltip>
        </div>
        <div className="flex items-center gap-2">
          <Cloud
            className={`size-3.5 shrink-0 ${item.hasCloud ? "text-[hsl(var(--storage-cloud))]" : "text-storage-inactive"}`}
          />
          <Tooltip>
            <TooltipTrigger
              render={
                <span
                  className={
                    item.hasCloud
                      ? "truncate font-medium text-foreground text-left cursor-default block"
                      : "text-muted-foreground"
                  }
                >
                  {item.hasCloud
                    ? item.cloudDescription || "On cloud"
                    : "Not on cloud"}
                </span>
              }
            />
            {item.hasCloud && item.cloudDescription && (
              <TooltipContent className="max-w-xs wrap-break-word">
                {item.cloudDescription}
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
