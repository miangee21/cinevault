//convex/mediaItemQueries.ts
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const sortOptionValidator = v.union(
  v.literal("name_asc"),
  v.literal("name_desc"),
  v.literal("rating_asc"),
  v.literal("rating_desc"),
);

export const getMediaItem = query({
  args: { id: v.id("mediaItems") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== userId) return null;
    return item;
  },
});

export const getMediaItemsPaginated = query({
  args: {
    categoryId: v.optional(v.id("categories")),
    subcategoryId: v.optional(v.id("subcategories")),
    searchTerm: v.optional(v.string()),
    sortOption: sortOptionValidator,
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { page: [], isDone: true, continueCursor: "" };

    const term = args.searchTerm?.trim();
    const isNameSort =
      args.sortOption === "name_asc" || args.sortOption === "name_desc";
    const order =
      args.sortOption === "name_asc" || args.sortOption === "rating_asc"
        ? "asc"
        : "desc";

    // --- SCENARIO 1: SUBCATEGORY FILTER ACTIVE (Uses Junction Table) ---
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
          .filter((q) => q.eq(q.field("deletedAt"), undefined))
          .paginate(args.paginationOpts);
      } else {
        if (isNameSort) {
          paginatedJunction = await ctx.db
            .query("itemSubcategories")
            .withIndex("by_user_subcategory_and_sortTitle", (q) =>
              q.eq("userId", userId).eq("subcategoryId", args.subcategoryId!),
            )
            .filter((q) => q.eq(q.field("deletedAt"), undefined))
            .order(order)
            .paginate(args.paginationOpts);
        } else {
          paginatedJunction = await ctx.db
            .query("itemSubcategories")
            .withIndex("by_user_subcategory_and_rating", (q) =>
              q.eq("userId", userId).eq("subcategoryId", args.subcategoryId!),
            )
            .filter((q) => q.eq(q.field("deletedAt"), undefined))
            .order(order)
            .paginate(args.paginationOpts);
        }
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

    // --- SCENARIO 2: NO SUBCATEGORY (Uses Main Table) ---
    if (term && term.length > 0) {
      let searchQuery = ctx.db
        .query("mediaItems")
        .withSearchIndex("search_title", (q) =>
          q.search("title", term).eq("userId", userId),
        )
        .filter((q) => q.eq(q.field("deletedAt"), undefined));

      if (args.categoryId) {
        searchQuery = searchQuery.filter((q) =>
          q.eq(q.field("categoryId"), args.categoryId),
        );
      }
      return await searchQuery.paginate(args.paginationOpts);
    }

    let baseQuery;

    if (isNameSort) {
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
    } else {
      if (args.categoryId) {
        baseQuery = ctx.db
          .query("mediaItems")
          .withIndex("by_user_category_and_rating", (q) =>
            q.eq("userId", userId).eq("categoryId", args.categoryId!),
          );
      } else {
        baseQuery = ctx.db
          .query("mediaItems")
          .withIndex("by_user_and_rating", (q) => q.eq("userId", userId));
      }
    }

    return await baseQuery
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .order(order)
      .paginate(args.paginationOpts);
  },
});

export const getMediaItemCounts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return {
        total: 0,
        byCategory: {},
      };
    }

    const categories = await ctx.db
      .query("categories")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const byCategory: Record<string, number> = {};
    let total = 0;

    for (const category of categories) {
      const count = category.itemCount ?? 0;
      byCategory[category._id] = count;
      total += count;
    }

    return {
      total,
      byCategory,
    };
  },
});
