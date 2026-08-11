//src/features/compoenents/detail/DeleteItemDialog.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useDeleteMediaItem } from "../../hooks/useDeleteMediaItem";
import { type Id } from "@convex/_generated/dataModel";

interface DeleteItemDialogProps {
  itemId: Id<"mediaItems">;
  title: string;
  trigger: React.ReactNode;
  onDeleted?: () => void;
}

export function DeleteItemDialog({
  itemId,
  title,
  trigger,
  onDeleted,
}: DeleteItemDialogProps) {
  const [open, setOpen] = useState(false);
  const deleteMediaItem = useDeleteMediaItem();

  const handleConfirm = async () => {
    try {
      await deleteMediaItem({ id: itemId });
      toast.success(`"${title}" deleted`);
      onDeleted?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Couldn't delete this item",
      );
      throw error;
    }
  };

  return (
    <>
      <span
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        {trigger}
      </span>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`Delete "${title}"?`}
        description="This permanently removes this item, including its poster, from your vault. This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleConfirm}
      />
    </>
  );
}
