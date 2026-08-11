//src/features/categories/components/SubcategoryFormDialog.tsx
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
    useSubcategoryItemCount(deleteAlertOpen ? subcategory?._id : undefined);

  const {
    register,
    handleSubmit,
    watch,
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

  const icon = watch("icon");

  const onSubmit = async (values: SubcategoryFormValues) => {
    try {
      if (mode === "create") {
        await createSubcategory({ categoryId, ...values });
        toast.success("Subcategory created");
      } else if (subcategory) {
        await updateSubcategory({ id: subcategory._id, ...values });
        toast.success("Subcategory updated");
      }
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!subcategory) return;
    try {
      await deleteSubcategory({ id: subcategory._id });
      toast.success("Subcategory deleted");
      setDeleteAlertOpen(false);
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Couldn't delete subcategory",
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
              {mode === "create" ? "New subcategory" : "Edit subcategory"}
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
                  <FieldLabel htmlFor="subcategory-name">Name</FieldLabel>
                  <Input
                    id="subcategory-name"
                    placeholder="e.g. Anime"
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
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-[hsl(var(--primary)/0.9)] disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : null}
                  {mode === "create" ? "Create subcategory" : "Save changes"}
                </button>

                {mode === "edit" && (
                  <button
                    type="button"
                    onClick={() => setDeleteAlertOpen(true)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[hsl(var(--destructive)/0.4)] text-destructive transition-colors hover:bg-[hsl(var(--destructive)/0.08)]"
                    aria-label="Delete subcategory"
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
                Delete &quot;{subcategory?.name}&quot;?
              </AlertDialogTitle>
              <AlertDialogDescription>
                {countLoading
                  ? "Checking affected items..."
                  : affectedCount > 0
                    ? `This will affect ${affectedCount} item(s). Continue?`
                    : "This subcategory has no items in it. This action cannot be undone."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-[hsl(var(--destructive)/0.9)]"
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
