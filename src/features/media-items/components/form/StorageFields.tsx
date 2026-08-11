//src/features/media-items/components/form/StorageFields.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { HardDrive, Cloud } from "lucide-react";
import { Switch } from "@/shared/components/ui/switch";
import { Textarea } from "@/shared/components/ui/textarea";
import { type MediaItemFormValues } from "../../types";

export function HardDriveField() {
  const { watch, setValue, register } = useFormContext<MediaItemFormValues>();
  const hasHard = watch("hasHard");

  return (
    <div>
      <div className="flex items-center justify-between gap-2 rounded-full border border-border px-3 py-2">
        <div className="flex items-center gap-1.5">
          <HardDrive className="size-3.5 shrink-0 text-[hsl(var(--storage-hard))]" />
          <span className="text-xs font-medium text-foreground">
            Hard Drive
          </span>
        </div>
        <Switch
          checked={hasHard}
          onCheckedChange={(checked) =>
            setValue("hasHard", checked, { shouldValidate: true })
          }
        />
      </div>
      {hasHard && (
        <Textarea
          placeholder="e.g. samsung-1tb"
          className="mt-2 rounded-xl text-xs"
          rows={2}
          {...register("hardDescription")}
        />
      )}
    </div>
  );
}

export function CloudField() {
  const { watch, setValue, register } = useFormContext<MediaItemFormValues>();
  const hasCloud = watch("hasCloud");

  return (
    <div>
      <div className="flex items-center justify-between gap-2 rounded-full border border-border px-3 py-2">
        <div className="flex items-center gap-1.5">
          <Cloud className="size-3.5 shrink-0 text-[hsl(var(--storage-cloud))]" />
          <span className="text-xs font-medium text-foreground">Cloud</span>
        </div>
        <Switch
          checked={hasCloud}
          onCheckedChange={(checked) =>
            setValue("hasCloud", checked, { shouldValidate: true })
          }
        />
      </div>
      {hasCloud && (
        <Textarea
          placeholder="e.g. Drive folder"
          className="mt-2 rounded-xl text-xs"
          rows={2}
          {...register("cloudDescription")}
        />
      )}
    </div>
  );
}
