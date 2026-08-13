// convex/categories.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const UNCATEGORIZED_NAME = "Uncategorized";
const UNCATEGORIZED_ICON = "FolderX";

export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("categories")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
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

    const name = args.name.trim();
    if (name.length < 1) throw new Error("Category name is required");

    await ctx.db.patch(args.id, { name, icon: args.icon });
  },
});

// Lets the UI show "This will make N item(s) uncategorized" before confirming delete
export const getCategoryItemCount = query({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return 0;

    const items = await ctx.db
      .query("mediaItems")
      .withIndex("by_user_and_category", (q) =>
        q.eq("userId", userId).eq("categoryId", args.id),
      )
      .collect();

    return items.length;
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

    // Find every item pointing at the category being deleted
    const affectedItems = await ctx.db
      .query("mediaItems")
      .withIndex("by_user_and_category", (q) =>
        q.eq("userId", userId).eq("categoryId", args.id),
      )
      .collect();

    if (affectedItems.length > 0) {
      // Lazily find-or-create this user's hidden "Uncategorized" bucket
      const existingUncategorized = await ctx.db
        .query("categories")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .filter((q) => q.eq(q.field("name"), UNCATEGORIZED_NAME))
        .first();

      const uncategorizedId =
        existingUncategorized?._id ??
        (await ctx.db.insert("categories", {
          userId,
          name: UNCATEGORIZED_NAME,
          icon: UNCATEGORIZED_ICON,
          itemCount: 0,
        }));

      await Promise.all(
        affectedItems.map((item) =>
          ctx.db.patch(item._id, { categoryId: uncategorizedId }),
        ),
      );

      await ctx.db.patch(uncategorizedId, {
        itemCount:
          (existingUncategorized?.itemCount ?? 0) + affectedItems.length,
      });
    }

    // Also clean up any subcategories that belonged to this category
    const subcategories = await ctx.db
      .query("subcategories")
      .withIndex("by_category", (q) => q.eq("categoryId", args.id))
      .collect();

    await Promise.all(subcategories.map((sub) => ctx.db.delete(sub._id)));

    await ctx.db.delete(args.id);
  },
});
