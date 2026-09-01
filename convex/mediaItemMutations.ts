//convex/mediaItemMutations.ts
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

function generateSortTitle(title: string) {
  return title.toLowerCase().replace(/\d+/g, (match) => match.padStart(5, "0"));
}

function validateRating(rating: number | undefined) {
  if (rating === undefined || rating === 0) return;
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
  posterStorageId: v.optional(v.id("_storage")),
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

    let posterUrl = args.posterUrl;
    if (args.posterStorageId) {
      posterUrl = (await ctx.storage.getUrl(args.posterStorageId)) ?? undefined;
    }

    const mediaItemId = await ctx.db.insert("mediaItems", {
      ...args,
      userId,
      title,
      sortTitle: generateSortTitle(title),
      posterUrl,
    });

    await ctx.db.patch(args.categoryId, {
      itemCount: (category.itemCount ?? 0) + 1,
    });

    for (const subId of args.subcategoryIds) {
      const sub = await ctx.db.get(subId);
      if (sub) {
        await ctx.db.patch(subId, { itemCount: (sub.itemCount ?? 0) + 1 });
      }
    }

    for (const subId of args.subcategoryIds) {
      await ctx.db.insert("itemSubcategories", {
        userId,
        mediaItemId,
        categoryId: args.categoryId,
        subcategoryId: subId,
        title,
        sortTitle: generateSortTitle(title),
        rating: args.rating,
      });
    }

    return mediaItemId;
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
    posterStorageId: v.optional(v.id("_storage")),
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
    if (updates.hasHard === false) updates.hardDescription = undefined;
    if (updates.hasCloud === false) updates.cloudDescription = undefined;
    if (updates.rating === 0) {
      updates.rating = undefined;
      updates.review = undefined;
    }

    const currentStatus = updates.status ?? item.status;
    if (currentStatus !== "in_progress") {
      updates.progressDescription = undefined;
      updates.progressSeconds = undefined;
      updates.progressSeason = undefined;
      updates.progressEpisode = undefined;
    }

    let finalPosterUrl = updates.posterUrl;
    if (updates.posterStorageId) {
      finalPosterUrl =
        (await ctx.storage.getUrl(updates.posterStorageId)) ?? undefined;

      if (
        item.posterStorageId &&
        item.posterStorageId !== updates.posterStorageId
      ) {
        await ctx.storage.delete(item.posterStorageId);
      }
    }
    if (finalPosterUrl) {
      updates.posterUrl = finalPosterUrl;
    }

    if (updates.categoryId && updates.categoryId !== item.categoryId) {
      const oldCategory = await ctx.db.get(item.categoryId);
      const newCategory = await ctx.db.get(updates.categoryId);

      if (!newCategory || newCategory.userId !== userId) {
        throw new Error("Category not found");
      }

      if (oldCategory) {
        await ctx.db.patch(item.categoryId, {
          itemCount: Math.max(0, (oldCategory.itemCount ?? 0) - 1),
        });
      }

      await ctx.db.patch(updates.categoryId, {
        itemCount: (newCategory.itemCount ?? 0) + 1,
      });
    }

    if (
      updates.subcategoryIds &&
      updates.subcategoryIds !== item.subcategoryIds
    ) {
      const oldSubs = new Set(item.subcategoryIds);
      const newSubs = new Set(updates.subcategoryIds);
      const removedSubs = [...oldSubs].filter((sid) => !newSubs.has(sid));
      const addedSubs = [...newSubs].filter((sid) => !oldSubs.has(sid));

      for (const subId of removedSubs) {
        const sub = await ctx.db.get(subId);
        if (sub) {
          await ctx.db.patch(subId, {
            itemCount: Math.max(0, (sub.itemCount ?? 0) - 1),
          });
        }
      }

      for (const subId of addedSubs) {
        const sub = await ctx.db.get(subId);
        if (sub) {
          await ctx.db.patch(subId, { itemCount: (sub.itemCount ?? 0) + 1 });
        }
      }
    }

    if (updates.title !== undefined) {
      if (updates.title.trim().length < 1) throw new Error("Title is required");
      (updates as typeof updates & { sortTitle?: string }).sortTitle =
        generateSortTitle(updates.title);
    }
    if (updates.rating !== undefined) validateRating(updates.rating as number);
    await ctx.db.patch(id, updates);

    const existingJunctions = await ctx.db
      .query("itemSubcategories")
      .withIndex("by_mediaItem", (q) => q.eq("mediaItemId", id))
      .collect();

    for (const j of existingJunctions) {
      await ctx.db.delete(j._id);
    }

    const finalTitle =
      updates.title !== undefined ? updates.title.trim() : item.title;
    const finalSortTitle = generateSortTitle(finalTitle);
    const finalRating =
      updates.rating !== undefined ? updates.rating : item.rating;
    const finalCategoryId =
      updates.categoryId !== undefined ? updates.categoryId : item.categoryId;
    const finalSubcategoryIds =
      updates.subcategoryIds !== undefined
        ? updates.subcategoryIds
        : item.subcategoryIds;

    for (const subId of finalSubcategoryIds) {
      await ctx.db.insert("itemSubcategories", {
        userId,
        mediaItemId: id,
        categoryId: finalCategoryId,
        subcategoryId: subId,
        title: finalTitle,
        sortTitle: finalSortTitle,
        rating: finalRating,
      });
    }
  },
});

export const deleteMediaItem = mutation({
  args: { id: v.id("mediaItems") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== userId) throw new Error("Item not found");
    if (item.deletedAt !== undefined) return;
    const category = await ctx.db.get(item.categoryId);

    if (category) {
      await ctx.db.patch(item.categoryId, {
        itemCount: Math.max(0, (category.itemCount ?? 0) - 1),
      });
    }

    for (const subId of item.subcategoryIds) {
      const sub = await ctx.db.get(subId);
      if (sub) {
        await ctx.db.patch(subId, {
          itemCount: Math.max(0, (sub.itemCount ?? 0) - 1),
        });
      }
    }

    const now = Date.now();
    await ctx.db.patch(args.id, { deletedAt: now });
    const junctions = await ctx.db
      .query("itemSubcategories")
      .withIndex("by_mediaItem", (q) => q.eq("mediaItemId", args.id))
      .collect();
    for (const j of junctions) {
      await ctx.db.patch(j._id, { deletedAt: now });
    }
  },
});
