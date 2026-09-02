//src/features/trash/components/TrashedMediaTableRow.tsx
"use client";

import { Film, Tv, Trash2, RefreshCcw } from "lucide-react";
import { RestoreDialog, HardDeleteDialog } from "./TrashActionDialogs";
import { useRestoreMediaItem } from "../hooks/useRestoreAction";
import { useHardDeleteMediaItem } from "../hooks/useHardDeleteAction";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { StarRatingInput } from "@/features/ratings/components/StarRatingInput";
import { StatusBadge } from "@/features/media-items/components/dashboard/StatusBadge";
import { StorageBadges } from "@/features/media-items/components/dashboard/StorageBadges";
import { cn } from "@/shared/lib/utils";
import { type MediaItem } from "@/features/media-items/types";

interface TrashedMediaTableRowProps {
  item: MediaItem;
  index: number;
}

export function TrashedMediaTableRow({
  item,
  index,
}: TrashedMediaTableRowProps) {
  const restoreMedia = useRestoreMediaItem();
  const hardDeleteMedia = useHardDeleteMediaItem();
  const isOdd = index % 2 === 1;

  const handleRestore = async () => {
    await restoreMedia({ id: item._id });
  };

  const handleHardDelete = async () => {
    await hardDeleteMedia({ id: item._id });
  };

  return (
    <TableRow
      className={cn(
        "group transition-colors hover:bg-accent/50",
        isOdd && "bg-[hsl(var(--foreground)/0.03)]",
      )}
    >
      <TableCell>
        <div className="flex h-14 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[hsl(var(--foreground)/0.06)] opacity-70 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0">
          {item.posterUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.posterUrl}
              alt={item.title}
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <Film className="size-4 text-muted-foreground" />
          )}
        </div>
      </TableCell>

      <TableCell className="max-w-0">
        <Tooltip>
          <TooltipTrigger
            render={
              <span className="block max-w-60 truncate text-sm font-medium text-foreground opacity-80 group-hover:opacity-100 cursor-default">
                {item.title}
              </span>
            }
          />
          <TooltipContent>{item.title}</TooltipContent>
        </Tooltip>
      </TableCell>

      <TableCell>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          {item.kind === "movie" ? (
            <Film className="size-3.5" />
          ) : (
            <Tv className="size-3.5" />
          )}
          {item.kind === "movie" ? "Movie" : "Series"}
        </span>
      </TableCell>

      <TableCell>
        <div className="opacity-80 group-hover:opacity-100 transition-opacity">
          <StorageBadges
            hasHard={item.hasHard}
            hardDescription={item.hardDescription}
            hasCloud={item.hasCloud}
            cloudDescription={item.cloudDescription}
          />
        </div>
      </TableCell>

      <TableCell>
        <div className="opacity-80 group-hover:opacity-100 transition-opacity">
          <StatusBadge item={item} />
        </div>
      </TableCell>

      <TableCell>
        <div className="opacity-80 group-hover:opacity-100 transition-opacity">
          {item.review ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <span className="inline-flex cursor-default">
                    <StarRatingInput
                      value={item.rating}
                      readOnly
                      size="sm"
                      showValue={false}
                    />
                  </span>
                }
              />
              <TooltipContent className="max-w-xs">
                {item.review}
              </TooltipContent>
            </Tooltip>
          ) : (
            <StarRatingInput
              value={item.rating}
              readOnly
              size="sm"
              showValue={false}
            />
          )}
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center justify-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <RestoreDialog
            title={item.title}
            onRestore={handleRestore}
            trigger={
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[hsl(var(--primary)/0.1)] hover:text-primary"
                aria-label={`Restore ${item.title}`}
              >
                <RefreshCcw className="size-3.5" />
              </button>
            }
          />

          <HardDeleteDialog
            title={item.title}
            onDelete={handleHardDelete}
            trigger={
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[hsl(var(--destructive)/0.1)] hover:text-destructive"
                aria-label={`Hard delete ${item.title}`}
              >
                <Trash2 className="size-3.5" />
              </button>
            }
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
