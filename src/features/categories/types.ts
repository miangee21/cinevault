//src/features/categories/types.ts
import { z } from "zod";
import { type Id } from "@convex/_generated/dataModel";

export interface Category {
  _id: Id<"categories">;
  _creationTime: number;
  userId: Id<"users">;
  name: string;
  icon: string;
}

export interface Subcategory {
  _id: Id<"subcategories">;
  _creationTime: number;
  userId: Id<"users">;
  categoryId: Id<"categories">;
  name: string;
  icon: string;
}

export const categoryFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  icon: z.string().min(1, "Pick an icon"),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const subcategoryFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  icon: z.string().min(1, "Pick an icon"),
});

export type SubcategoryFormValues = z.infer<typeof subcategoryFormSchema>;
