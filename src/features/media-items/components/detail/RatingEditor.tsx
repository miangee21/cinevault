//src/features/media-items/components/detail/RatingEditor.tsx
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
import { StarRatingInput } from "@/features/ratings/components/StarRatingInput";
import { useUpdateMediaItem } from "../../hooks/useUpdateMediaItem";
import { type MediaItem } from "../../types";

export function RatingEditor({ item }: { item: MediaItem }) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const updateMediaItem = useUpdateMediaItem();
  const [rating, setRating] = useState(item.rating);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateMediaItem({ id: item._id, rating });
      toast.success("Rating updated");
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Couldn't update rating",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Rating</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <button
                type="button"
                className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[hsl(var(--foreground)/0.06)] hover:text-foreground"
                aria-label="Edit rating"
              >
                <Pencil className="size-3.5" />
              </button>
            }
          />
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Edit rating</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <StarRatingInput value={rating} onChange={setRating} size="lg" />
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
      <StarRatingInput value={item.rating} readOnly size="md" />
    </div>
  );
}
