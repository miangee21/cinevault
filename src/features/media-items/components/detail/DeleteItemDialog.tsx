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
      toast.success("Moved to Trash", {
        description: `"${title}" has been moved to the recycle bin.`,
      });
      onDeleted?.();
    } catch (error) {
      toast.error("Action Failed", {
        description:
          error instanceof Error
            ? error.message
            : "Could not move this item to trash.",
      });
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
        title={`Move "${title}" to Trash?`}
        description="This item will be moved to the recycle bin. You can easily restore it later from the Trash page."
        confirmLabel="Move to Trash"
        variant="destructive"
        onConfirm={handleConfirm}
      />
    </>
  );
}
