//src/features/media-items/hooks/useCreateMediaItem.ts
"use client";

import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";

export function useCreateMediaItem() {
  return useMutation(api.mediaItems.createMediaItem);
}
