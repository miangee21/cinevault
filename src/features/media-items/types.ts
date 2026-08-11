//src/features/media-items/types.ts
import { z } from "zod";
import { type Id } from "@convex/_generated/dataModel";

export interface Season {
  seasonNumber: number;
  totalEpisodes: number;
}

export interface MediaItem {
  _id: Id<"mediaItems">;
  _creationTime: number;
  userId: Id<"users">;
  categoryId: Id<"categories">;
  subcategoryIds: Id<"subcategories">[];
  title: string;
  kind: "movie" | "series";
  posterUrl?: string;
  posterPublicId?: string;
  totalDurationSeconds?: number;
  seasons?: Season[];
  status: "not_started" | "in_progress" | "completed";
  progressDescription?: string;
  progressSeconds?: number;
  progressSeason?: number;
  progressEpisode?: number;
  hasHard: boolean;
  hardDescription?: string;
  hasCloud: boolean;
  cloudDescription?: string;
  rating?: number;
  review?: string;
  hideDeleteFromDashboard?: boolean;
}

const statusEnum = z.enum(["not_started", "in_progress", "completed"]);

const baseSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  categoryId: z.string().min(1, "Pick a category"),
  subcategoryIds: z.array(z.string()),
  posterUrl: z.string().optional(),
  posterPublicId: z.string().optional(),
  status: statusEnum,
  hasHard: z.boolean(),
  hardDescription: z.string().optional(),
  hasCloud: z.boolean(),
  cloudDescription: z.string().optional(),
  rating: z.number().min(0.5).max(10).optional(),
  review: z.string().optional(),
});

export const movieFormSchema = baseSchema.extend({
  kind: z.literal("movie"),
  totalDurationSeconds: z.number().positive().optional(),
  progressDescription: z.string().optional(),
  progressSeconds: z.number().nonnegative().optional(),
});

export const seriesFormSchema = baseSchema.extend({
  kind: z.literal("series"),
  seasons: z.array(
    z.object({
      seasonNumber: z.number().positive(),
      totalEpisodes: z.number().positive(),
    }),
  ),
  progressDescription: z.string().optional(),
  progressSeason: z.number().optional(),
  progressEpisode: z.number().optional(),
});

export const mediaItemFormSchema = z.discriminatedUnion("kind", [
  movieFormSchema,
  seriesFormSchema,
]);

export type MovieFormValues = z.infer<typeof movieFormSchema>;
export type SeriesFormValues = z.infer<typeof seriesFormSchema>;
export type MediaItemFormValues = z.infer<typeof mediaItemFormSchema>;
