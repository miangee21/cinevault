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
      .filter((q) => q.eq(q.field("userId"), userId))
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

    return await ctx.db.insert("subcategories", {
      userId,
      categoryId: args.categoryId,
      name,
      icon: args.icon,
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

    await ctx.db.patch(args.id, { name, icon: args.icon });
  },
});

// Lets the UI show "This will affect N item(s)" before confirming delete
export const getSubcategoryItemCount = query({
  args: { id: v.id("subcategories") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return 0;

    const userItems = await ctx.db
      .query("mediaItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return userItems.filter((item) => item.subcategoryIds.includes(args.id))
      .length;
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

    const userItems = await ctx.db
      .query("mediaItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const affectedItems = userItems.filter((item) =>
      item.subcategoryIds.includes(args.id),
    );

    await Promise.all(
      affectedItems.map((item) =>
        ctx.db.patch(item._id, {
          subcategoryIds: item.subcategoryIds.filter((sid) => sid !== args.id),
        }),
      ),
    );

    await ctx.db.delete(args.id);
  },
});
