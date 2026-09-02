//src/features/trash/hooks/useHardDeleteAction.ts
"use client";

import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";

export function useHardDeleteMediaItem() {
  return useMutation(api.trash.hardDeleteMediaItem);
}
