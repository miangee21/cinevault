//src/features/media-items/components/details/ReviewEditor.tsx
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { type MediaItem } from "../../types";

export function ReviewDisplay({ item }: { item: MediaItem }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border/50 bg-[hsl(var(--foreground)/0.015)] p-3.5 transition-colors hover:bg-[hsl(var(--foreground)/0.03)]">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Review
        </p>
      </div>
      <div className="flex-1 overflow-hidden pt-1">
        <Tooltip>
          <TooltipTrigger
            render={
              <p
                className={
                  item.review
                    ? "truncate block text-xs leading-relaxed text-foreground text-left cursor-default"
                    : "text-xs italic text-muted-foreground"
                }
              >
                {item.review || "No review written yet."}
              </p>
            }
          />
          {item.review && (
            <TooltipContent className="max-w-xs wrap-break-word">
              {item.review}
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </div>
  );
}
