//src/features/media-items/hooks/useMediaItem.ts
"use client";

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { type Id } from "@convex/_generated/dataModel";

export function useMediaItem(id: Id<"mediaItems">) {
  const item = useQuery(api.mediaItems.getMediaItem, { id });
  return { item, isLoading: item === undefined };
}
