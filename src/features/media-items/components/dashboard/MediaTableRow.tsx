//src/features/media-items/components/dashboard/MediaTableRow.tsx
"use client";

import { useRouter } from "next/navigation";
import { Film, Tv } from "lucide-react";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { StarRatingInput } from "@/features/ratings/components/StarRatingInput";
import { StatusBadge } from "./StatusBadge";
import { StorageBadges } from "./StorageBadges";
import { cn } from "@/shared/lib/utils";
import { type MediaItem } from "../../types";

interface MediaTableRowProps {
  item: MediaItem;
  index: number;
}

export function MediaTableRow({ item, index }: MediaTableRowProps) {
  const router = useRouter();
  const isOdd = index % 2 === 1;

  return (
    <TableRow
      onClick={() => router.push(`/item/${item._id}`)}
      className={cn(
        "cursor-pointer transition-colors hover:bg-accent/50",
        isOdd && "bg-[hsl(var(--foreground)/0.075)]",
      )}
    >
      <TableCell>
        <div className="flex h-14 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[hsl(var(--foreground)/0.06)]">
          {item.posterUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.posterUrl}
              alt={item.title}
              className="h-full w-full object-cover"
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
              <span className="block max-w-60 truncate text-sm font-medium text-foreground">
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
        <StorageBadges
          hasHard={item.hasHard}
          hardDescription={item.hardDescription}
          hasCloud={item.hasCloud}
          cloudDescription={item.cloudDescription}
        />
      </TableCell>

      <TableCell>
        <StatusBadge
          status={item.status}
          progressDescription={item.progressDescription}
        />
      </TableCell>

      <TableCell>
        {item.review ? (
          <Tooltip>
            <TooltipTrigger
              render={
                <span className="inline-flex">
                  <StarRatingInput
                    value={item.rating}
                    readOnly
                    size="sm"
                    showValue={false}
                  />
                </span>
              }
            />
            <TooltipContent className="max-w-xs">{item.review}</TooltipContent>
          </Tooltip>
        ) : (
          <StarRatingInput
            value={item.rating}
            readOnly
            size="sm"
            showValue={false}
          />
        )}
      </TableCell>
    </TableRow>
  );
}
