//src/features/media-items/components/detail/StorageEditor.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Loader2, HardDrive, Cloud } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Switch } from "@/shared/components/ui/switch";
import { Textarea } from "@/shared/components/ui/textarea";
import { useUpdateMediaItem } from "../../hooks/useUpdateMediaItem";
import { type MediaItem } from "../../types";

export function StorageEditor({ item }: { item: MediaItem }) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const updateMediaItem = useUpdateMediaItem();

  const [hasHard, setHasHard] = useState(item.hasHard);
  const [hardDescription, setHardDescription] = useState(
    item.hardDescription ?? "",
  );
  const [hasCloud, setHasCloud] = useState(item.hasCloud);
  const [cloudDescription, setCloudDescription] = useState(
    item.cloudDescription ?? "",
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateMediaItem({
        id: item._id,
        hasHard,
        hardDescription: hasHard ? hardDescription : undefined,
        hasCloud,
        cloudDescription: hasCloud ? cloudDescription : undefined,
      });
      toast.success("Storage updated");
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Couldn't update storage",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Storage</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <button
                type="button"
                className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[hsl(var(--foreground)/0.06)] hover:text-foreground"
                aria-label="Edit storage"
              >
                <Pencil className="size-3.5" />
              </button>
            }
          />
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Edit storage</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <div className="rounded-2xl border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="size-4 text-[hsl(var(--storage-hard))]" />
                    <span className="text-sm font-medium text-foreground">
                      Hard Drive
                    </span>
                  </div>
                  <Switch checked={hasHard} onCheckedChange={setHasHard} />
                </div>
                {hasHard && (
                  <Textarea
                    value={hardDescription}
                    onChange={(e) => setHardDescription(e.target.value)}
                    className="mt-3 rounded-2xl"
                    rows={2}
                    placeholder="e.g. samsung-hard-1tb in Hassan/series/GOT"
                  />
                )}
              </div>

              <div className="rounded-2xl border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="size-4 text-[hsl(var(--storage-cloud))]" />
                    <span className="text-sm font-medium text-foreground">
                      Cloud
                    </span>
                  </div>
                  <Switch checked={hasCloud} onCheckedChange={setHasCloud} />
                </div>
                {hasCloud && (
                  <Textarea
                    value={cloudDescription}
                    onChange={(e) => setCloudDescription(e.target.value)}
                    className="mt-3 rounded-2xl"
                    rows={2}
                    placeholder="e.g. Google Drive - Movies/Action"
                  />
                )}
              </div>

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

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <HardDrive
            className={`size-4 ${item.hasHard ? "text-[hsl(var(--storage-hard))]" : "text-storage-inactive"}`}
          />
          <span
            className={
              item.hasHard ? "text-foreground" : "text-muted-foreground"
            }
          >
            {item.hasHard
              ? item.hardDescription || "On hard drive"
              : "Not on hard drive"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Cloud
            className={`size-4 ${item.hasCloud ? "text-[hsl(var(--storage-cloud))]" : "text-storage-inactive"}`}
          />
          <span
            className={
              item.hasCloud ? "text-foreground" : "text-muted-foreground"
            }
          >
            {item.hasCloud
              ? item.cloudDescription || "On cloud"
              : "Not on cloud"}
          </span>
        </div>
      </div>
    </div>
  );
}
