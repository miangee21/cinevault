//convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  // --- Auth tables
  ...authTables,

  // --- Categories: e.g. "Movies", "Series" ---
  categories: defineTable({
    userId: v.id("users"),
    name: v.string(),
    icon: v.string(),
  }).index("by_user", ["userId"]),

  // --- Subcategories: e.g. "Punjabi", "Anime" ---
  subcategories: defineTable({
    userId: v.id("users"),
    categoryId: v.id("categories"),
    name: v.string(),
    icon: v.string(),
  })
    .index("by_category", ["categoryId"])
    .index("by_user", ["userId"]),

  // --- Media items: movies & series both live here, differentiated by `kind` ---
  mediaItems: defineTable({
    userId: v.id("users"),
    categoryId: v.id("categories"),
    subcategoryIds: v.array(v.id("subcategories")),

    title: v.string(),
    kind: v.union(v.literal("movie"), v.literal("series")),
    posterUrl: v.optional(v.string()),
    posterPublicId: v.optional(v.string()),

    // --- Movie-only ---
    totalDurationSeconds: v.optional(v.number()),

    // --- Series-only ---
    seasons: v.optional(
      v.array(
        v.object({
          seasonNumber: v.number(),
          totalEpisodes: v.number(),
        }),
      ),
    ),

    // --- Status & progress (shared) ---
    status: v.union(
      v.literal("not_started"),
      v.literal("in_progress"),
      v.literal("completed"),
    ),
    progressDescription: v.optional(v.string()),
    progressSeconds: v.optional(v.number()),
    progressSeason: v.optional(v.number()),
    progressEpisode: v.optional(v.number()),

    // --- Storage tracking ---
    hasHard: v.boolean(),
    hardDescription: v.optional(v.string()),
    hasCloud: v.boolean(),
    cloudDescription: v.optional(v.string()),

    // --- Rating & review ---
    rating: v.optional(v.number()),
    review: v.optional(v.string()),

    // --- Dashboard preference ---
    hideDeleteFromDashboard: v.optional(v.boolean()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_category", ["userId", "categoryId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["userId"],
    }),
});
