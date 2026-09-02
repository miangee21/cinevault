//src/features/trash/components/TrashedMediaGridCard.tsx
"use client";

import { Cloud, Film, HardDrive, RefreshCcw, Trash2 } from "lucide-react";
import { RestoreDialog, HardDeleteDialog } from "./TrashActionDialogs";
import { useRestoreMediaItem } from "../hooks/useRestoreAction";
import { useHardDeleteMediaItem } from "../hooks/useHardDeleteAction";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { StarRatingInput } from "@/features/ratings/components/StarRatingInput";
import { StatusBadge } from "@/features/media-items/components/dashboard/StatusBadge";
import { type MediaItem } from "@/features/media-items/types";

interface TrashedMediaGridCardProps {
  item: MediaItem;
}

export function TrashedMediaGridCard({ item }: TrashedMediaGridCardProps) {
  const restoreMedia = useRestoreMediaItem();
  const hardDeleteMedia = useHardDeleteMediaItem();

  const handleRestore = async () => {
    await restoreMedia({ id: item._id });
  };

  const handleHardDelete = async () => {
    await hardDeleteMedia({ id: item._id });
  };

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-3/4 overflow-hidden bg-[hsl(var(--foreground)/0.06)] opacity-75 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0">
        {item.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.posterUrl}
            alt={item.title}
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Film className="size-10 text-muted-foreground/50" />
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/60 to-transparent opacity-80" />

        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          <span className="rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
            {item.kind === "movie" ? "Movie" : "Series"}
          </span>
        </div>

        <div className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-black/70 p-1 opacity-0 backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100">
          <RestoreDialog
            title={item.title}
            onRestore={handleRestore}
            trigger={
              <button
                type="button"
                className="flex size-7 items-center justify-center rounded-full text-white transition-colors hover:bg-[hsl(var(--primary)/0.6)]"
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
                className="flex size-7 items-center justify-center rounded-full text-white transition-colors hover:bg-destructive/80"
                aria-label={`Hard delete ${item.title}`}
              >
                <Trash2 className="size-3.5" />
              </button>
            }
          />
        </div>
      </div>

      <div className="space-y-1 p-3.5 opacity-80 transition-opacity duration-300 group-hover:opacity-100">
        <div className="min-w-0">
          <Tooltip>
            <TooltipTrigger
              render={
                <h3 className="line-clamp-2 min-h-8 text-sm font-semibold leading-5 text-foreground cursor-default">
                  {item.title}
                </h3>
              }
            />
            <TooltipContent>{item.title}</TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-1.5">
          <div className="w-fit">
            <StatusBadge item={item} />
          </div>

          <Tooltip>
            <TooltipTrigger
              render={
                <div>
                  <StarRatingInput
                    value={item.rating ?? 0}
                    onChange={() => {}}
                    size="sm"
                    readOnly
                  />
                </div>
              }
            />
            <TooltipContent className="max-w-xs">
              {item.review?.trim() || "No review"}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex min-h-7 items-center gap-2">
          {item.hasHard && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <div className="flex size-7 items-center justify-center rounded-full text-primary transition-colors hover:bg-[hsl(var(--foreground)/0.06)]">
                    <HardDrive className="size-4 text-storage-hard" />
                  </div>
                }
              />
              <TooltipContent className="max-w-xs">
                {item.hardDescription?.trim() || "No hard drive description"}
              </TooltipContent>
            </Tooltip>
          )}

          {item.hasCloud && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <div className="flex size-7 items-center justify-center rounded-full text-primary transition-colors hover:bg-[hsl(var(--foreground)/0.06)]">
                    <Cloud className="size-4 text-storage-cloud" />
                  </div>
                }
              />
              <TooltipContent className="max-w-xs">
                {item.cloudDescription?.trim() || "No cloud description"}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </article>
  );
}
