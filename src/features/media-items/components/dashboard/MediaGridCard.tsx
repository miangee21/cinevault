//src/features/media-items/components/dashboard/MediaGridCard.tsx
"use client";

import { useRouter } from "next/navigation";
import { Cloud, Film, HardDrive, Pencil, Trash2 } from "lucide-react";
import { DeleteItemDialog } from "../detail/DeleteItemDialog";
import { MediaItemFormDialog } from "../form/MediaItemFormDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { StarRatingInput } from "@/features/ratings/components/StarRatingInput";
import { StatusBadge } from "./StatusBadge";
import { type MediaItem } from "../../types";

interface MediaGridCardProps {
  item: MediaItem;
  showActionsButton: boolean;
}

export function MediaGridCard({ item, showActionsButton }: MediaGridCardProps) {
  const router = useRouter();

  return (
    <article
      onClick={() => router.push(`/item/${item._id}`)}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-2/3 overflow-hidden bg-[hsl(var(--foreground)/0.06)]">
        {item.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.posterUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Film className="size-10 text-muted-foreground/50" />
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-overlay/50 to-transparent opacity-70" />

        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          <span className="rounded-full bg-overlay/55 px-2.5 py-1 text-[11px] font-medium text-overlay-foreground backdrop-blur-md">
            {item.kind === "movie" ? "Movie" : "Series"}
          </span>
        </div>

        {showActionsButton && (
          <div
            className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-black/55 p-1 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <MediaItemFormDialog
              mode="edit"
              item={item}
              trigger={
                <button
                  type="button"
                  className="flex size-7 items-center justify-center rounded-full text-white transition-colors hover:bg-overlay-foreground/15"
                  aria-label={`Edit ${item.title}`}
                >
                  <Pencil className="size-3.5" />
                </button>
              }
            />

            <DeleteItemDialog
              itemId={item._id}
              title={item.title}
              trigger={
                <button
                  type="button"
                  className="flex size-7 items-center justify-center rounded-full text-white transition-colors hover:bg-destructive/80"
                  aria-label={`Delete ${item.title}`}
                >
                  <Trash2 className="size-3.5" />
                </button>
              }
            />
          </div>
        )}
      </div>

      <div className="space-y-1 p-3.5">
        <div className="min-w-0">
          <Tooltip>
            <TooltipTrigger
              render={
                <h3 className="line-clamp-2 min-h-8 text-sm font-semibold leading-5 text-foreground">
                  {item.title}
                </h3>
              }
            />
            <TooltipContent>{item.title}</TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-1.5">
          <Tooltip>
            <TooltipTrigger
              render={
                <div onClick={(e) => e.stopPropagation()} className="w-fit">
                  <StatusBadge status={item.status} />
                </div>
              }
            />
            <TooltipContent className="max-w-xs">
              {item.progressDescription?.trim() || "No status description"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <div onClick={(e) => e.stopPropagation()}>
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

        <div
          onClick={(e) => e.stopPropagation()}
          className="flex min-h-7 items-center gap-2"
        >
          {item.hasHard && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <div className="flex size-7 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10">
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
                  <div className="flex size-7 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10">
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
