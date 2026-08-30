// convex/subcategories.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getSubcategories = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("subcategories")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), userId),
          q.eq(q.field("deletedAt"), undefined), // Skip trashed items
        ),
      )
      .collect();
  },
});

export const createSubcategory = mutation({
  args: {
    categoryId: v.id("categories"),
    name: v.string(),
    icon: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const category = await ctx.db.get(args.categoryId);
    if (!category || category.userId !== userId) {
      throw new Error("Category not found");
    }

    const name = args.name.trim();
    if (name.length < 1) throw new Error("Subcategory name is required");

    // Duplicate Check
    const existing = await ctx.db
      .query("subcategories")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    if (existing.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      throw new Error(`A subcategory named "${name}" already exists here.`);
    }

    return await ctx.db.insert("subcategories", {
      userId,
      categoryId: args.categoryId,
      name,
      icon: args.icon,
      itemCount: 0, // Initialize count to 0 for 0-load queries
    });
  },
});

export const updateSubcategory = mutation({
  args: {
    id: v.id("subcategories"),
    name: v.string(),
    icon: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const subcategory = await ctx.db.get(args.id);
    if (!subcategory || subcategory.userId !== userId) {
      throw new Error("Subcategory not found");
    }

    const name = args.name.trim();
    if (name.length < 1) throw new Error("Subcategory name is required");

    // Duplicate Check for Updates
    const existing = await ctx.db
      .query("subcategories")
      .withIndex("by_category", (q) =>
        q.eq("categoryId", subcategory.categoryId),
      )
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    if (
      existing.some(
        (s) => s._id !== args.id && s.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      throw new Error(`A subcategory named "${name}" already exists here.`);
    }

    await ctx.db.patch(args.id, { name, icon: args.icon });
  },
});

// 100% 0-Load Count: Just reads the pre-calculated number from schema
export const getSubcategoryItemCount = query({
  args: { id: v.id("subcategories") },
  handler: async (ctx, args) => {
    const subcategory = await ctx.db.get(args.id);
    return subcategory?.itemCount || 0;
  },
});

export const deleteSubcategory = mutation({
  args: { id: v.id("subcategories") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const subcategory = await ctx.db.get(args.id);
    if (!subcategory || subcategory.userId !== userId) {
      throw new Error("Subcategory not found");
    }

    // 0-Load Guard: Strictly check schema count
    if (subcategory.itemCount && subcategory.itemCount > 0) {
      throw new Error(
        "Cannot delete: This subcategory is linked to items. Please remove it from those items first.",
      );
    }

    // Soft delete subcategory
    await ctx.db.patch(args.id, { deletedAt: Date.now() });
  },
});
