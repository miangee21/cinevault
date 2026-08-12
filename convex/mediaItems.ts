//convex/mediaItems.ts
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
const sortOptionValidator = v.union(
  v.literal("name_asc"),
  v.literal("name_desc"),
  v.literal("rating_asc"),
  v.literal("rating_desc"),
  v.literal("completed_first"),
  v.literal("in_progress_first"),
  v.literal("not_started_first"),
);

const STATUS_PRIORITY = {
  completed_first: ["completed", "in_progress", "not_started"],
  in_progress_first: ["in_progress", "completed", "not_started"],
  not_started_first: ["not_started", "in_progress", "completed"],
} as const;

function validateRating(rating: number | undefined) {
  if (rating === undefined) return;
  if (rating < 0.5 || rating > 10) {
    throw new Error("Rating must be between 0.5 and 10");
  }
  if (Math.round(rating * 2) !== rating * 2) {
    throw new Error("Rating must be in steps of 0.5");
  }
}

const seasonValidator = v.object({
  seasonNumber: v.number(),
  totalEpisodes: v.number(),
});

const mediaItemFields = {
  categoryId: v.id("categories"),
  subcategoryIds: v.array(v.id("subcategories")),
  title: v.string(),
  kind: v.union(v.literal("movie"), v.literal("series")),
  posterUrl: v.optional(v.string()),
  posterPublicId: v.optional(v.string()),
  totalDurationSeconds: v.optional(v.number()),
  seasons: v.optional(v.array(seasonValidator)),
  status: v.union(
    v.literal("not_started"),
    v.literal("in_progress"),
    v.literal("completed"),
  ),
  progressDescription: v.optional(v.string()),
  progressSeconds: v.optional(v.number()),
  progressSeason: v.optional(v.number()),
  progressEpisode: v.optional(v.number()),
  hasHard: v.boolean(),
  hardDescription: v.optional(v.string()),
  hasCloud: v.boolean(),
  cloudDescription: v.optional(v.string()),
  rating: v.optional(v.number()),
  review: v.optional(v.string()),
  hideDeleteFromDashboard: v.optional(v.boolean()),
};

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
    searchTerm: v.optional(v.string()),
    sortOption: sortOptionValidator,
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { page: [], isDone: true, continueCursor: "" };

    const term = args.searchTerm?.trim();
    if (term && term.length > 0) {
      return await ctx.db
        .query("mediaItems")
        .withSearchIndex("search_title", (q) =>
          q.search("title", term).eq("userId", userId),
        )
        .paginate(args.paginationOpts);
    }

    if (args.sortOption === "name_asc" || args.sortOption === "name_desc") {
      const order = args.sortOption === "name_asc" ? "asc" : "desc";
      const baseQuery = args.categoryId
        ? ctx.db
            .query("mediaItems")
            .withIndex("by_user_category_and_title", (q) =>
              q.eq("userId", userId).eq("categoryId", args.categoryId!),
            )
        : ctx.db
            .query("mediaItems")
            .withIndex("by_user_and_title", (q) => q.eq("userId", userId));
      return await baseQuery.order(order).paginate(args.paginationOpts);
    }

    if (args.sortOption === "rating_asc" || args.sortOption === "rating_desc") {
      const order = args.sortOption === "rating_asc" ? "asc" : "desc";
      const baseQuery = args.categoryId
        ? ctx.db
            .query("mediaItems")
            .withIndex("by_user_category_and_rating", (q) =>
              q.eq("userId", userId).eq("categoryId", args.categoryId!),
            )
        : ctx.db
            .query("mediaItems")
            .withIndex("by_user_and_rating", (q) => q.eq("userId", userId));
      return await baseQuery.order(order).paginate(args.paginationOpts);
    }

    const priority = STATUS_PRIORITY[args.sortOption];

    const groups = await Promise.all(
      priority.map((status) => {
        const baseQuery = args.categoryId
          ? ctx.db
              .query("mediaItems")
              .withIndex("by_user_category_and_status", (q) =>
                q
                  .eq("userId", userId)
                  .eq("categoryId", args.categoryId!)
                  .eq("status", status),
              )
          : ctx.db
              .query("mediaItems")
              .withIndex("by_user_and_status", (q) =>
                q.eq("userId", userId).eq("status", status),
              );
        return baseQuery.collect();
      }),
    );

    const sorted = groups.flatMap((group) =>
      [...group].sort((a, b) => a.title.localeCompare(b.title)),
    );

    const offset = args.paginationOpts.cursor
      ? Number(args.paginationOpts.cursor)
      : 0;
    const page = sorted.slice(offset, offset + args.paginationOpts.numItems);
    const nextOffset = offset + page.length;

    return {
      page,
      isDone: nextOffset >= sorted.length,
      continueCursor: String(nextOffset),
    };
  },
});

export const createMediaItem = mutation({
  args: mediaItemFields,
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const title = args.title.trim();
    if (title.length < 1) throw new Error("Title is required");
    validateRating(args.rating);

    const category = await ctx.db.get(args.categoryId);
    if (!category || category.userId !== userId) {
      throw new Error("Category not found");
    }

    return await ctx.db.insert("mediaItems", { ...args, userId, title });
  },
});

export const updateMediaItem = mutation({
  args: {
    id: v.id("mediaItems"),
    categoryId: v.optional(v.id("categories")),
    subcategoryIds: v.optional(v.array(v.id("subcategories"))),
    title: v.optional(v.string()),
    kind: v.optional(v.union(v.literal("movie"), v.literal("series"))),
    posterUrl: v.optional(v.string()),
    posterPublicId: v.optional(v.string()),
    totalDurationSeconds: v.optional(v.number()),
    seasons: v.optional(v.array(seasonValidator)),
    status: v.optional(
      v.union(
        v.literal("not_started"),
        v.literal("in_progress"),
        v.literal("completed"),
      ),
    ),
    progressDescription: v.optional(v.string()),
    progressSeconds: v.optional(v.number()),
    progressSeason: v.optional(v.number()),
    progressEpisode: v.optional(v.number()),
    hasHard: v.optional(v.boolean()),
    hardDescription: v.optional(v.string()),
    hasCloud: v.optional(v.boolean()),
    cloudDescription: v.optional(v.string()),
    rating: v.optional(v.number()),
    review: v.optional(v.string()),
    hideDeleteFromDashboard: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const { id, ...updates } = args;
    const item = await ctx.db.get(id);
    if (!item || item.userId !== userId) throw new Error("Item not found");

    if (updates.title !== undefined && updates.title.trim().length < 1) {
      throw new Error("Title is required");
    }
    if (updates.rating !== undefined) validateRating(updates.rating as number);

    await ctx.db.patch(id, updates);
  },
});

export const deleteMediaItem = mutation({
  args: { id: v.id("mediaItems") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== userId) throw new Error("Item not found");

    if (item.posterPublicId) {
      await ctx.scheduler.runAfter(0, api.cloudinary.deleteCloudinaryImage, {
        publicId: item.posterPublicId,
      });
    }

    await ctx.db.delete(args.id);
  },
});
