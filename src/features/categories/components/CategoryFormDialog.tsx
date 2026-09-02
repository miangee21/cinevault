//src/features/categories/components/CategoryFormDialog.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Trash2, FolderTree } from "lucide-react";
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
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useCategoryItemCount,
} from "../hooks/useCategories";
import {
  categoryFormSchema,
  type CategoryFormValues,
  type Category,
} from "../types";

interface CategoryFormDialogProps {
  mode: "create" | "edit";
  category?: Category;
  trigger: React.ReactNode;
}

export function CategoryFormDialog({
  mode,
  category,
  trigger,
}: CategoryFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const { count: affectedCount, isLoading: countLoading } =
    useCategoryItemCount(category?._id);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
  });

  useEffect(() => {
    if (open) {
      reset({
        name: category?.name ?? "",
        icon: category?.icon ?? "Folder",
      });
    }
  }, [open, category, reset]);

  const currentIcon = useWatch({ control, name: "icon" }) || "Folder";

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      if (mode === "create") {
        await createCategory(values);
        toast.success("Category created successfully!");
      } else if (category) {
        await updateCategory({ id: category._id, ...values });
        toast.success("Category updated successfully!");
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
    if (!category || affectedCount > 0) return;
    try {
      await deleteCategory({ id: category._id });
      toast.success("Category deleted permanently.");
      setDeleteAlertOpen(false);
      setOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof ConvexError
          ? (error.data as string)
          : error instanceof Error
            ? error.message
            : "Couldn't delete category";
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
                <FolderTree className="w-4 h-4 text-primary" />
              </div>
              {mode === "create" ? "New Category" : "Edit Category"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block ml-1">
                Category Name
              </label>
              <input
                type="text"
                placeholder="e.g. Cables, Documents, Cameras"
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
                  "Add Category"
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
                Delete &quot;{category?.name}&quot;?
              </AlertDialogTitle>
              <AlertDialogDescription className="leading-relaxed">
                {countLoading ? (
                  "Checking category status..."
                ) : affectedCount > 0 ? (
                  <span className="text-destructive font-medium">
                    This category contains {affectedCount} item(s). Please
                    reassign them to another category before deleting.
                  </span>
                ) : (
                  "This category is empty and can be safely deleted. This action cannot be undone."
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
