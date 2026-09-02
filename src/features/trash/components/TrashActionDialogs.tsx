//src/features/trash/components/TrashActionDialogs.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";

// --- RESTORE DIALOG ---
interface RestoreDialogProps {
  title: string;
  trigger: React.ReactNode;
  onRestore: () => Promise<void>;
}

export function RestoreDialog({
  title,
  trigger,
  onRestore,
}: RestoreDialogProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    try {
      await onRestore();
      toast.success("Restored Successfully", {
        description: `"${title}" has been restored to your vault.`,
      });
      setOpen(false);
    } catch (error) {
      toast.error("Restore Failed", {
        description:
          error instanceof Error ? error.message : "Could not restore item.",
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
        title={`Restore "${title}"?`}
        description="This item will be moved back to your active vault and its original category."
        confirmLabel="Restore"
        variant="default"
        onConfirm={handleConfirm}
      />
    </>
  );
}

// --- HARD DELETE DIALOG ---
interface HardDeleteDialogProps {
  title: string;
  trigger: React.ReactNode;
  onDelete: () => Promise<void>;
}

export function HardDeleteDialog({
  title,
  trigger,
  onDelete,
}: HardDeleteDialogProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    try {
      await onDelete();
      toast.success("Permanently Deleted", {
        description: `"${title}" has been deleted forever.`,
      });
      setOpen(false);
    } catch (error) {
      toast.error("Delete Failed", {
        description:
          error instanceof Error ? error.message : "Could not delete item.",
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
        title={`Permanently delete "${title}"?`}
        description="This will permanently delete this item and any associated posters from storage. This action cannot be undone."
        confirmLabel="Delete Forever"
        variant="destructive"
        onConfirm={handleConfirm}
      />
    </>
  );
}
