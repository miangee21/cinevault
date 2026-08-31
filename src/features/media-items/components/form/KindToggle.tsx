//src/features/media-items/components/form/KindToggle.tsx
"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Film, Tv } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { type MediaItemFormValues } from "../../types";

export function KindToggle() {
  const { control, setValue, getValues } =
    useFormContext<MediaItemFormValues>();
  const kind = useWatch({ control, name: "kind" });

  const handleKindChange = (nextKind: "movie" | "series") => {
    if (kind === nextKind) return;
    setValue("kind", nextKind, { shouldValidate: true });

    // Auto-initialize series season array if empty
    if (nextKind === "series") {
      const currentSeasons = getValues("seasons");
      if (!currentSeasons || currentSeasons.length === 0) {
        setValue("seasons", [{ seasonNumber: 1, totalEpisodes: 1 }], {
          shouldValidate: true,
        });
      }
    }
  };

  return (
    <div className="w-full space-y-2">
      <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Media Type <span className="text-destructive">*</span>
      </label>

      <div className="relative flex h-12 w-full rounded-full border border-border/50 bg-[hsl(var(--foreground)/0.03)] p-1 shadow-inner">
        {/* Animated Background Pill */}
        <div
          className={cn(
            "absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-full bg-background shadow-md transition-transform duration-300 ease-out",
            kind === "movie" ? "translate-x-0" : "translate-x-full",
          )}
        />

        <button
          type="button"
          onClick={() => handleKindChange("movie")}
          className={cn(
            "relative z-10 flex w-1/2 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors duration-200",
            kind === "movie"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground/80",
          )}
        >
          <Film className="size-4" />
          Movie
        </button>

        <button
          type="button"
          onClick={() => handleKindChange("series")}
          className={cn(
            "relative z-10 flex w-1/2 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors duration-200",
            kind === "series"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground/80",
          )}
        >
          <Tv className="size-4" />
          Series
        </button>
      </div>
    </div>
  );
}
