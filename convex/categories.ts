// convex/categories.ts
import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const categories = await ctx.db
      .query("categories")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Professional Natural Sort (1, 2, 10, A, B, Z)
    return categories.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    );
  },
});

export const createCategory = mutation({
  args: {
    name: v.string(),
    icon: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const name = args.name.trim();
    if (name.length < 1) throw new Error("Category name is required");

    // Duplicate Check
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    if (existing.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      throw new Error(`A category named "${name}" already exists.`);
    }

    return await ctx.db.insert("categories", {
      userId,
      name,
      icon: args.icon,
      itemCount: 0,
    });
  },
});

export const updateCategory = mutation({
  args: {
    id: v.id("categories"),
    name: v.string(),
    icon: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const category = await ctx.db.get(args.id);
    if (!category || category.userId !== userId) {
      throw new Error("Category not found");
    }

    // 0-Load Guard: Strictly check if ANY item (active or trashed) exists!
    const hasItems = await ctx.db
      .query("mediaItems")
      .withIndex("by_user_and_category", (q) =>
        q.eq("userId", userId).eq("categoryId", args.id),
      )
      .first();

    if (hasItems) {
      throw new Error(
        "Cannot delete: This category is linked to items (active or in trash). Please remove them first.",
      );
    }

    const name = args.name.trim();
    if (name.length < 1) throw new Error("Category name is required");

    // Duplicate Check for Updates
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    if (
      existing.some(
        (c) => c._id !== args.id && c.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      throw new Error(`A category named "${name}" already exists.`);
    }

    await ctx.db.patch(args.id, { name, icon: args.icon });
  },
});

// 100% 0-Load Count: Just reads the pre-calculated number from schema
export const getCategoryItemCount = query({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.id);
    return category?.itemCount || 0;
  },
});

export const deleteCategory = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const category = await ctx.db.get(args.id);
    if (!category || category.userId !== userId) {
      throw new Error("Category not found");
    }

    // 0-Load Guard: Check if even a SINGLE item exists without collecting all
    const hasItems = await ctx.db
      .query("mediaItems")
      .withIndex("by_user_and_category", (q) =>
        q.eq("userId", userId).eq("categoryId", args.id),
      )
      .first();

    if (hasItems) {
      throw new ConvexError(
        "This category has items in it. Please reassign or delete them first.",
      );
    }

    // Cascade hard delete to subcategories
    const subcategories = await ctx.db
      .query("subcategories")
      .withIndex("by_category", (q) => q.eq("categoryId", args.id))
      .collect();

    for (const sub of subcategories) {
      await ctx.db.delete(sub._id);
    }

    // Hard delete category directly
    await ctx.db.delete(args.id);
  },
});
