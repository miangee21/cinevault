//src/features/media-items/components/form/StorageToggles.tsx
"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { HardDrive, Cloud } from "lucide-react";
import { Switch } from "@/shared/components/ui/switch";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/lib/utils";
import { type MediaItemFormValues } from "../../types";

export function StorageToggles() {
  const { control, setValue, register } = useFormContext<MediaItemFormValues>();

  const hasHard = useWatch({ control, name: "hasHard" });
  const hasCloud = useWatch({ control, name: "hasCloud" });

  return (
    <div className="w-full space-y-3">
      <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Storage Location{" "}
        <span className="text-muted-foreground/60 px-1">(Optional)</span>
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start w-full">
        {/* Hard Drive Card */}
        <div
          className={cn(
            "flex-1 min-w-0 overflow-hidden rounded-2xl border transition-all duration-300",
            hasHard
              ? "border-primary/40 bg-[hsl(var(--storage-hard))/0.05] shadow-sm"
              : "border-border/50 bg-[hsl(var(--foreground)/0.02)]",
          )}
        >
          <div className="flex h-12 items-center justify-between px-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <HardDrive
                className={cn(
                  "size-4.5 shrink-0 transition-colors",
                  hasHard
                    ? "text-[hsl(var(--storage-hard))]"
                    : "text-muted-foreground",
                )}
              />
              <span
                className={cn(
                  "truncate text-sm font-semibold transition-colors",
                  hasHard ? "text-foreground" : "text-muted-foreground",
                )}
              >
                Hard Drive
              </span>
            </div>
            <Switch
              checked={hasHard}
              onCheckedChange={(checked) =>
                setValue("hasHard", checked, { shouldValidate: true })
              }
              className="shrink-0 ml-2"
            />
          </div>

          {hasHard && (
            <div className="animate-in fade-in slide-in-from-top-2 px-3 pb-3 duration-300">
              <Textarea
                placeholder="e.g. samsung-1tb in my room..."
                className="h-20 w-full max-w-full resize-none whitespace-pre-wrap break-all rounded-xl border-border/50 bg-background text-sm shadow-inner focus-visible:ring-primary/20 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/80 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50 transition-colors duration-300"
                {...register("hardDescription")}
              />
            </div>
          )}
        </div>

        {/* Cloud Card */}
        <div
          className={cn(
            "flex-1 min-w-0 overflow-hidden rounded-2xl border transition-all duration-300",
            hasCloud
              ? "border-primary/40 bg-[hsl(var(--storage-cloud))/0.05] shadow-sm"
              : "border-border/50 bg-[hsl(var(--foreground)/0.02)]",
          )}
        >
          <div className="flex h-12 items-center justify-between px-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <Cloud
                className={cn(
                  "size-4.5 shrink-0 transition-colors",
                  hasCloud
                    ? "text-[hsl(var(--storage-cloud))]"
                    : "text-muted-foreground",
                )}
              />
              <span
                className={cn(
                  "truncate text-sm font-semibold transition-colors",
                  hasCloud ? "text-foreground" : "text-muted-foreground",
                )}
              >
                Cloud
              </span>
            </div>
            <Switch
              checked={hasCloud}
              onCheckedChange={(checked) =>
                setValue("hasCloud", checked, { shouldValidate: true })
              }
              className="shrink-0 ml-2"
            />
          </div>

          {hasCloud && (
            <div className="animate-in fade-in slide-in-from-top-2 px-3 pb-3 duration-300">
              <Textarea
                placeholder="e.g. Google Drive / Mega folder..."
                className="h-20 w-full max-w-full resize-none whitespace-pre-wrap break-all rounded-xl border-border/50 bg-background text-sm shadow-inner focus-visible:ring-primary/20 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/80 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50 transition-colors duration-300"
                {...register("cloudDescription")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
