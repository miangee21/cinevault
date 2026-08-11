//src/features/media-items/hooks/useDeleteMediaItem.ts
"use client";

import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";

export function useDeleteMediaItem() {
  return useMutation(api.mediaItems.deleteMediaItem);
}
