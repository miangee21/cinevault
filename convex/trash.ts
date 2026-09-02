//convex/trash.ts
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getTrashedMediaItemsPaginated = query({
  args: {
    categoryId: v.optional(v.id("categories")),
    subcategoryId: v.optional(v.id("subcategories")),
    searchTerm: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { page: [], isDone: true, continueCursor: "" };

    const term = args.searchTerm?.trim();

    if (args.subcategoryId) {
      let paginatedJunction;
      if (term && term.length > 0) {
        paginatedJunction = await ctx.db
          .query("itemSubcategories")
          .withSearchIndex("search_title", (q) =>
            q
              .search("title", term)
              .eq("userId", userId)
              .eq("subcategoryId", args.subcategoryId!),
          )
          .filter((q) => q.neq(q.field("deletedAt"), undefined))
          .paginate(args.paginationOpts);
      } else {
        paginatedJunction = await ctx.db
          .query("itemSubcategories")
          .withIndex("by_user_subcategory_and_sortTitle", (q) =>
            q.eq("userId", userId).eq("subcategoryId", args.subcategoryId!),
          )
          .filter((q) => q.neq(q.field("deletedAt"), undefined))
          .order("asc")
          .paginate(args.paginationOpts);
      }
      const pageItems = await Promise.all(
        paginatedJunction.page.map(
          async (j) => await ctx.db.get(j.mediaItemId),
        ),
      );
      return {
        page: pageItems.filter(Boolean),
        isDone: paginatedJunction.isDone,
        continueCursor: paginatedJunction.continueCursor,
      };
    }

    if (term && term.length > 0) {
      let searchQuery = ctx.db
        .query("mediaItems")
        .withSearchIndex("search_title", (q) =>
          q.search("title", term).eq("userId", userId),
        )
        .filter((q) => q.neq(q.field("deletedAt"), undefined));
      if (args.categoryId) {
        searchQuery = searchQuery.filter((q) =>
          q.eq(q.field("categoryId"), args.categoryId),
        );
      }
      return await searchQuery.paginate(args.paginationOpts);
    }

    let baseQuery;
    if (args.categoryId) {
      baseQuery = ctx.db
        .query("mediaItems")
        .withIndex("by_user_category_and_sortTitle", (q) =>
          q.eq("userId", userId).eq("categoryId", args.categoryId!),
        );
    } else {
      baseQuery = ctx.db
        .query("mediaItems")
        .withIndex("by_user_and_sortTitle", (q) => q.eq("userId", userId));
    }

    return await baseQuery
      .filter((q) => q.neq(q.field("deletedAt"), undefined))
      .order("asc")
      .paginate(args.paginationOpts);
  },
});

export const restoreMediaItem = mutation({
  args: { id: v.id("mediaItems") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== userId) throw new Error("Item not found");

    const category = await ctx.db.get(item.categoryId);
    if (category) {
      await ctx.db.patch(item.categoryId, {
        itemCount: (category.itemCount ?? 0) + 1,
        trashedItemCount: Math.max(0, (category.trashedItemCount ?? 0) - 1),
      });
    }

    for (const subId of item.subcategoryIds) {
      const sub = await ctx.db.get(subId);
      if (sub) {
        await ctx.db.patch(subId, {
          itemCount: (sub.itemCount ?? 0) + 1,
          trashedItemCount: Math.max(0, (sub.trashedItemCount ?? 0) - 1),
        });
      }
    }

    await ctx.db.patch(args.id, { deletedAt: undefined });

    const junctions = await ctx.db
      .query("itemSubcategories")
      .withIndex("by_mediaItem", (q) => q.eq("mediaItemId", args.id))
      .collect();

    for (const j of junctions) {
      await ctx.db.patch(j._id, { deletedAt: undefined });
    }
  },
});

export const hardDeleteMediaItem = mutation({
  args: { id: v.id("mediaItems") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== userId) throw new Error("Item not found");

    const category = await ctx.db.get(item.categoryId);
    if (category) {
      await ctx.db.patch(item.categoryId, {
        trashedItemCount: Math.max(0, (category.trashedItemCount ?? 0) - 1),
      });
    }

    for (const subId of item.subcategoryIds) {
      const sub = await ctx.db.get(subId);
      if (sub) {
        await ctx.db.patch(subId, {
          trashedItemCount: Math.max(0, (sub.trashedItemCount ?? 0) - 1),
        });
      }
    }

    if (item.posterStorageId) {
      await ctx.storage.delete(item.posterStorageId);
    }

    const junctions = await ctx.db
      .query("itemSubcategories")
      .withIndex("by_mediaItem", (q) => q.eq("mediaItemId", args.id))
      .collect();

    for (const j of junctions) {
      await ctx.db.delete(j._id);
    }

    await ctx.db.delete(args.id);
  },
});

export const emptyTrash = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const trashedItems = await ctx.db
      .query("mediaItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.neq(q.field("deletedAt"), undefined))
      .collect();

    for (const item of trashedItems) {
      const category = await ctx.db.get(item.categoryId);
      if (category) {
        await ctx.db.patch(item.categoryId, {
          trashedItemCount: Math.max(0, (category.trashedItemCount ?? 0) - 1),
        });
      }

      for (const subId of item.subcategoryIds) {
        const sub = await ctx.db.get(subId);
        if (sub) {
          await ctx.db.patch(subId, {
            trashedItemCount: Math.max(0, (sub.trashedItemCount ?? 0) - 1),
          });
        }
      }

      if (item.posterStorageId) {
        await ctx.storage.delete(item.posterStorageId);
      }

      const junctions = await ctx.db
        .query("itemSubcategories")
        .withIndex("by_mediaItem", (q) => q.eq("mediaItemId", item._id))
        .collect();

      for (const j of junctions) {
        await ctx.db.delete(j._id);
      }

      await ctx.db.delete(item._id);
    }
  },
});

export const getTrashedMediaItemCounts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { total: 0, byCategory: {} };

    const categories = await ctx.db
      .query("categories")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    let total = 0;
    const byCategory: Record<string, number> = {};

    for (const cat of categories) {
      const count = cat.trashedItemCount || 0;
      byCategory[cat._id] = count;
      total += count;
    }

    return { total, byCategory };
  },
});
