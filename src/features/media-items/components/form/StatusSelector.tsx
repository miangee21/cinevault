//src/features/media-items/components/form/StatusSelector.tsx
"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { CircleDashed, CircleDot, CheckCircle2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { type MediaItemFormValues } from "../../types";

const STATUS_OPTIONS = [
  {
    value: "not_started",
    label: "Not Started",
    icon: CircleDashed,
    color: "text-status-not-started",
  },
  {
    value: "in_progress",
    label: "In Progress",
    icon: CircleDot,
    color: "text-status-in-progress",
  },
  {
    value: "completed",
    label: "Completed",
    icon: CheckCircle2,
    color: "text-status-completed",
  },
] as const;

export function StatusSelector() {
  const { control, setValue } = useFormContext<MediaItemFormValues>();
  const status = useWatch({ control, name: "status" });

  return (
    <div className="w-full space-y-2">
      <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Status <span className="text-destructive">*</span>
      </label>

      <Select
        value={status}
        onValueChange={(val) =>
          setValue("status", val as MediaItemFormValues["status"], {
            shouldValidate: true,
          })
        }
      >
        <SelectTrigger className="h-12 w-full rounded-full border-border/50 bg-[hsl(var(--foreground)/0.02)] px-4 font-medium shadow-sm transition-all hover:bg-[hsl(var(--foreground)/0.04)] focus:ring-2 focus:ring-primary/20">
          <SelectValue placeholder="Select status">
            {(() => {
              const selected = STATUS_OPTIONS.find((o) => o.value === status);
              if (!selected) return "Select status";
              const Icon = selected.icon;
              return (
                <div className="flex items-center gap-2.5">
                  <Icon className={cn("size-4", selected.color)} />
                  <span>{selected.label}</span>
                </div>
              );
            })()}
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          side="bottom"
          sideOffset={8}
          className="rounded-2xl p-1.5 shadow-dropdown border-border/50"
        >
          {STATUS_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="cursor-pointer rounded-xl py-2.5 pl-3 pr-8 transition-colors hover:bg-[hsl(var(--foreground)/0.04)] focus:bg-[hsl(var(--foreground)/0.04)]"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn("size-4.5", opt.color)} />
                  <span className="font-medium">{opt.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
