//src/features/categories/components/SubcategoryFormDialog.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Trash2, Tags } from "lucide-react";
import { ConvexError } from "convex/values";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import { IconPicker } from "./IconPicker";
import {
  useCreateSubcategory,
  useUpdateSubcategory,
  useDeleteSubcategory,
  useSubcategoryItemCount,
} from "../hooks/useSubcategories";
import {
  subcategoryFormSchema,
  type SubcategoryFormValues,
  type Subcategory,
} from "../types";
import { type Id } from "@convex/_generated/dataModel";

interface SubcategoryFormDialogProps {
  mode: "create" | "edit";
  categoryId: Id<"categories">;
  subcategory?: Subcategory;
  trigger: React.ReactNode;
}

export function SubcategoryFormDialog({
  mode,
  categoryId,
  subcategory,
  trigger,
}: SubcategoryFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  const createSubcategory = useCreateSubcategory();
  const updateSubcategory = useUpdateSubcategory();
  const deleteSubcategory = useDeleteSubcategory();

  const { count: affectedCount, isLoading: countLoading } =
    useSubcategoryItemCount(subcategory?._id);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubcategoryFormValues>({
    resolver: zodResolver(subcategoryFormSchema),
  });

  useEffect(() => {
    if (open) {
      reset({
        name: subcategory?.name ?? "",
        icon: subcategory?.icon ?? "Tag",
      });
    }
  }, [open, subcategory, reset]);

  const currentIcon = useWatch({ control, name: "icon" }) || "Tag";

  const onSubmit = async (values: SubcategoryFormValues) => {
    try {
      if (mode === "create") {
        await createSubcategory({ categoryId, ...values });
        toast.success("Subcategory created successfully!");
      } else if (subcategory) {
        await updateSubcategory({ id: subcategory._id, ...values });
        toast.success("Subcategory updated successfully!");
      }
      setOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof ConvexError
          ? (error.data as string)
          : error instanceof Error
            ? error.message
            : "Something went wrong";
      toast.error(errorMessage);
    }
  };

  const handleConfirmDelete = async () => {
    if (!subcategory || affectedCount > 0) return;
    try {
      await deleteSubcategory({ id: subcategory._id });
      toast.success("Subcategory deleted permanently.");
      setDeleteAlertOpen(false);
      setOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof ConvexError
          ? (error.data as string)
          : error instanceof Error
            ? error.message
            : "Couldn't delete subcategory";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={trigger as React.ReactElement} />
        <DialogContent className="sm:max-w-md rounded-4xl bg-card border-border/50 shadow-2xl p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Tags className="w-4 h-4 text-primary" />
              </div>
              {mode === "create" ? "New Subcategory" : "Edit Subcategory"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block ml-1">
                Subcategory Name
              </label>
              <input
                type="text"
                placeholder="e.g. Action, Comedy"
                className="w-full bg-background/50 ring-1 ring-border/50 focus:ring-2 focus:ring-primary/60 h-12 rounded-full px-4 text-sm font-medium outline-none transition-all placeholder:text-muted-foreground/50"
                disabled={isSubmitting}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-destructive text-xs mt-1.5 ml-3 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block ml-1">
                Select Icon
              </label>
              <IconPicker
                value={currentIcon}
                onChange={(val) =>
                  setValue("icon", val, { shouldValidate: true })
                }
                disabled={isSubmitting}
              />
              {errors.icon && (
                <p className="text-destructive text-xs mt-1.5 ml-3 font-medium">
                  {errors.icon.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4 mt-2 border-t border-border/50">
              {mode === "edit" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeleteAlertOpen(true)}
                  disabled={isSubmitting}
                  className="h-12 w-12 shrink-0 rounded-full border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
                className="flex-1 h-12 rounded-full font-semibold border-border/60 hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:-translate-y-px transition-all"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : mode === "create" ? (
                  "Add Subcategory"
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {mode === "edit" && (
        <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
          <AlertDialogContent className="border-border/50">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete &quot;{subcategory?.name}&quot;?
              </AlertDialogTitle>
              <AlertDialogDescription className="leading-relaxed">
                {countLoading ? (
                  "Checking subcategory status..."
                ) : affectedCount > 0 ? (
                  <span className="text-destructive font-medium">
                    This subcategory is linked to {affectedCount} item(s).
                    Please remove it from those items before deleting.
                  </span>
                ) : (
                  "This subcategory is unused and can be safely deleted. This action cannot be undone."
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                disabled={affectedCount > 0}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
              >
                Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
