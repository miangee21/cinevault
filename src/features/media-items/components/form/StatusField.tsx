//src/features/media-items/components/form/StatusField.tsx
"use client";

import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { type MediaItemFormValues } from "../../types";

export const STATUS_OPTIONS = [
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export function StatusField() {
  const { watch, setValue } = useFormContext<MediaItemFormValues>();
  const status = watch("status");

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-foreground">Status</p>
      <Select
        value={status}
        onValueChange={(value) => {
          if (!value) return;
          setValue("status", value as MediaItemFormValues["status"], {
            shouldValidate: true,
          });
        }}
      >
        <SelectTrigger className="h-10 w-full rounded-full px-4">
          <SelectValue placeholder="Select status">
            {(value: string | null) =>
              STATUS_OPTIONS.find((opt) => opt.value === value)?.label ??
              "Select status"
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
