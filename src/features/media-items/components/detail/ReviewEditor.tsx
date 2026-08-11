//src/features/media-items/components/details/ReviewEditor.tsx
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
import { Textarea } from "@/shared/components/ui/textarea";
import { useUpdateMediaItem } from "../../hooks/useUpdateMediaItem";
import { type MediaItem } from "../../types";

export function ReviewEditor({ item }: { item: MediaItem }) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const updateMediaItem = useUpdateMediaItem();
  const [review, setReview] = useState(item.review ?? "");

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateMediaItem({ id: item._id, review: review || undefined });
      toast.success("Review updated");
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Couldn't update review",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Review</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <button
                type="button"
                className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[hsl(var(--foreground)/0.06)] hover:text-foreground"
                aria-label="Edit review"
              >
                <Pencil className="size-3.5" />
              </button>
            }
          />
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Edit review</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="rounded-2xl"
                rows={5}
                placeholder="Your thoughts..."
              />
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
      <p className="text-sm text-muted-foreground">
        {item.review || "No review written yet."}
      </p>
    </div>
  );
}
