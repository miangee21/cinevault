//src/features/media-items/components/form/MovieFormFields.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { Textarea } from "@/shared/components/ui/textarea";
import { Input } from "@/shared/components/ui/input";
import { type MediaItemFormValues } from "../../types";

export function MovieDurationField() {
  const { watch, setValue } = useFormContext<MediaItemFormValues>();
  const totalDurationSeconds = watch("totalDurationSeconds" as any) as
    number | undefined;
  const totalHours = totalDurationSeconds
    ? Math.floor(totalDurationSeconds / 3600)
    : undefined;
  const totalMinutes = totalDurationSeconds
    ? Math.floor((totalDurationSeconds % 3600) / 60)
    : undefined;

  const setTotalDuration = (hours: number, minutes: number) => {
    const total = hours * 3600 + minutes * 60;
    setValue("totalDurationSeconds" as any, total > 0 ? total : undefined, {
      shouldValidate: true,
    });
  };

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-foreground">
        Total duration (optional)
      </p>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={0}
          placeholder="Hours"
          defaultValue={totalHours}
          onChange={(e) =>
            setTotalDuration(Number(e.target.value) || 0, totalMinutes ?? 0)
          }
          className="h-10 w-24 rounded-full px-4"
        />
        <Input
          type="number"
          min={0}
          max={59}
          placeholder="Minutes"
          defaultValue={totalMinutes}
          onChange={(e) =>
            setTotalDuration(totalHours ?? 0, Number(e.target.value) || 0)
          }
          className="h-10 w-24 rounded-full px-4"
        />
      </div>
    </div>
  );
}

export function MovieProgressField() {
  const { register, watch, setValue } = useFormContext<MediaItemFormValues>();
  const status = watch("status");
  const totalDurationSeconds = watch("totalDurationSeconds" as any) as
    number | undefined;
  const progressSeconds = watch("progressSeconds" as any) as number | undefined;
  const progressHours = progressSeconds
    ? Math.floor(progressSeconds / 3600)
    : undefined;
  const progressMinutes = progressSeconds
    ? Math.floor((progressSeconds % 3600) / 60)
    : undefined;

  const setProgressDuration = (hours: number, minutes: number) => {
    const total = hours * 3600 + minutes * 60;
    setValue("progressSeconds" as any, total > 0 ? total : undefined, {
      shouldValidate: true,
    });
  };

  if (status !== "in_progress") return null;

  return (
    <div className="space-y-2 rounded-2xl border border-border p-3">
      <div>
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">
          Progress description
        </p>
        <Textarea
          placeholder="e.g. 32m 45s in"
          className="rounded-xl text-xs"
          rows={2}
          {...register("progressDescription" as any)}
        />
      </div>

      {totalDurationSeconds ? (
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">
            Progress (time watched)
          </p>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              placeholder="Hours"
              defaultValue={progressHours}
              onChange={(e) =>
                setProgressDuration(
                  Number(e.target.value) || 0,
                  progressMinutes ?? 0,
                )
              }
              className="h-9 w-20 rounded-full px-3"
            />
            <Input
              type="number"
              min={0}
              max={59}
              placeholder="Minutes"
              defaultValue={progressMinutes}
              onChange={(e) =>
                setProgressDuration(
                  progressHours ?? 0,
                  Number(e.target.value) || 0,
                )
              }
              className="h-9 w-20 rounded-full px-3"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
