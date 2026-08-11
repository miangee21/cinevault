//src/features/media-items/hooks/useUpdateMediaItem.ts
"use client";

import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";

export function useUpdateMediaItem() {
  return useMutation(api.mediaItems.updateMediaItem);
}
