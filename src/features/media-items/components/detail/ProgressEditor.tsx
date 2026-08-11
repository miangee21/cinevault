//src/features/media-items/components/detail/ProgressEditor.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { StatusBadge } from "../dashboard/StatusBadge";
import { calculateProgress } from "../../utils/calculateProgress";
import { useUpdateMediaItem } from "../../hooks/useUpdateMediaItem";
import { type MediaItem } from "../../types";

const STATUS_OPTIONS = [
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export function ProgressEditor({ item }: { item: MediaItem }) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const updateMediaItem = useUpdateMediaItem();

  const [status, setStatus] = useState(item.status);
  const [progressDescription, setProgressDescription] = useState(
    item.progressDescription ?? "",
  );
  const [progressSeason, setProgressSeason] = useState(item.progressSeason);
  const [progressEpisode, setProgressEpisode] = useState(item.progressEpisode);
  const [progressHours, setProgressHours] = useState(
    item.progressSeconds ? Math.floor(item.progressSeconds / 3600) : 0,
  );
  const [progressMinutes, setProgressMinutes] = useState(
    item.progressSeconds ? Math.floor((item.progressSeconds % 3600) / 60) : 0,
  );

  const progress = calculateProgress({
    kind: item.kind,
    totalDurationSeconds: item.totalDurationSeconds,
    progressSeconds: item.progressSeconds,
    seasons: item.seasons,
    progressSeason: item.progressSeason,
    progressEpisode: item.progressEpisode,
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateMediaItem({
        id: item._id,
        status,
        progressDescription: progressDescription || undefined,
        ...(item.kind === "movie"
          ? {
              progressSeconds:
                progressHours * 3600 + progressMinutes * 60 || undefined,
            }
          : { progressSeason, progressEpisode }),
      });
      toast.success("Progress updated");
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Couldn't update progress",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Progress</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <button
                type="button"
                className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[hsl(var(--foreground)/0.06)] hover:text-foreground"
                aria-label="Edit progress"
              >
                <Pencil className="size-3.5" />
              </button>
            }
          />
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Edit progress</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <div>
                <p className="mb-1.5 text-sm font-medium text-foreground">
                  Status
                </p>
                <Select
                  value={status}
                  onValueChange={(v) =>
                    v && setStatus(v as MediaItem["status"])
                  }
                >
                  <SelectTrigger className="h-10 rounded-full px-4">
                    <SelectValue placeholder="Status">
                      {(value: string | null) =>
                        STATUS_OPTIONS.find((o) => o.value === value)?.label ??
                        "Status"
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

              {status === "in_progress" && (
                <>
                  <div>
                    <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                      Description
                    </p>
                    <Textarea
                      value={progressDescription}
                      onChange={(e) => setProgressDescription(e.target.value)}
                      className="rounded-2xl"
                      rows={2}
                    />
                  </div>

                  {item.kind === "movie" ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        value={progressHours}
                        onChange={(e) =>
                          setProgressHours(Number(e.target.value) || 0)
                        }
                        className="h-9 w-20 rounded-full px-3"
                        placeholder="Hours"
                      />
                      <Input
                        type="number"
                        min={0}
                        max={59}
                        value={progressMinutes}
                        onChange={(e) =>
                          setProgressMinutes(Number(e.target.value) || 0)
                        }
                        className="h-9 w-20 rounded-full px-3"
                        placeholder="Minutes"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        value={progressSeason ?? ""}
                        onChange={(e) =>
                          setProgressSeason(Number(e.target.value) || undefined)
                        }
                        className="h-9 w-24 rounded-full px-3"
                        placeholder="Season"
                      />
                      <Input
                        type="number"
                        min={1}
                        value={progressEpisode ?? ""}
                        onChange={(e) =>
                          setProgressEpisode(
                            Number(e.target.value) || undefined,
                          )
                        }
                        className="h-9 w-24 rounded-full px-3"
                        placeholder="Episode"
                      />
                    </div>
                  )}
                </>
              )}

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-[hsl(var(--primary)/0.9)] disabled:opacity-60"
              >
                {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
                Save
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-3">
        <StatusBadge status={item.status} />
        {progress !== null && (
          <span className="text-sm text-muted-foreground">
            {progress}% complete
          </span>
        )}
      </div>
      {item.progressDescription && (
        <p className="mt-2 text-sm text-muted-foreground">
          {item.progressDescription}
        </p>
      )}
    </div>
  );
}
