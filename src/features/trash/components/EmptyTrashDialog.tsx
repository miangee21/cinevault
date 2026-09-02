//src/features/trash/components/EmptyTrashDialog.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useEmptyTrash } from "../hooks/useEmptyTrash";

interface EmptyTrashDialogProps {
  trigger: React.ReactNode;
  onEmptied?: () => void;
}

export function EmptyTrashDialog({
  trigger,
  onEmptied,
}: EmptyTrashDialogProps) {
  const [open, setOpen] = useState(false);
  const emptyTrash = useEmptyTrash();

  const handleConfirm = async () => {
    try {
      await emptyTrash();
      toast.success("Trash Emptied", {
        description: "All items have been permanently deleted.",
      });
      onEmptied?.();
      setOpen(false);
    } catch (error) {
      toast.error("Action Failed", {
        description:
          error instanceof Error ? error.message : "Could not empty trash.",
      });
      throw error;
    }
  };

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Empty Trash?"
        description="Are you sure you want to permanently delete all items and categories in the trash? This action cannot be undone and all media posters will be deleted from storage."
        confirmLabel="Empty Trash"
        variant="destructive"
        onConfirm={handleConfirm}
      />
    </>
  );
}
