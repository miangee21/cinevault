//src/features/categories/components/CategoryFormDialog.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

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
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";

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
    useCategoryItemCount(deleteAlertOpen ? category?._id : undefined);

  const {
    register,
    handleSubmit,
    watch,
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
        icon: category?.icon ?? "Clapperboard",
      });
    }
  }, [open, category, reset]);

  const icon = watch("icon");

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      if (mode === "create") {
        await createCategory(values);
        toast.success("Category created");
      } else if (category) {
        await updateCategory({ id: category._id, ...values });
        toast.success("Category updated");
      }
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!category) return;
    try {
      await deleteCategory({ id: category._id });
      toast.success("Category deleted");
      setDeleteAlertOpen(false);
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Couldn't delete category",
      );
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={trigger as React.ReactElement} />

        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "New category" : "Edit category"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup className="gap-4">
              <div className="flex items-end gap-3">
                <IconPicker
                  value={icon}
                  onChange={(value) =>
                    setValue("icon", value, { shouldValidate: true })
                  }
                />
                <Field className="flex-1" data-invalid={!!errors.name}>
                  <FieldLabel htmlFor="category-name">Name</FieldLabel>
                  <Input
                    id="category-name"
                    placeholder="e.g. Movies"
                    className="rounded-full px-5"
                    aria-invalid={!!errors.name}
                    {...register("name")}
                  />
                  {errors.name && (
                    <FieldError>{errors.name.message}</FieldError>
                  )}
                </Field>
              </div>
              {errors.icon && <FieldError>{errors.icon.message}</FieldError>}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[hsl(var(--primary))] text-sm font-semibold text-[hsl(var(--primary-foreground))] transition-colors hover:bg-[hsl(var(--primary)/0.9)] disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : null}
                  {mode === "create" ? "Create category" : "Save changes"}
                </button>

                {mode === "edit" && (
                  <button
                    type="button"
                    onClick={() => setDeleteAlertOpen(true)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[hsl(var(--destructive)/0.4)] text-[hsl(var(--destructive))] transition-colors hover:bg-[hsl(var(--destructive)/0.08)]"
                    aria-label="Delete category"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>

      {mode === "edit" && (
        <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete &quot;{category?.name}&quot;?
              </AlertDialogTitle>
              <AlertDialogDescription>
                {countLoading
                  ? "Checking affected items..."
                  : affectedCount > 0
                    ? `This will make ${affectedCount} item(s) uncategorized. Continue?`
                    : "This category has no items in it. This action cannot be undone."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:bg-[hsl(var(--destructive)/0.9)]"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
