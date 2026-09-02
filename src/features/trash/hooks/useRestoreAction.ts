//src/features/trash/hooks/useRestoreAction.ts
"use client";

import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";

export function useRestoreMediaItem() {
  return useMutation(api.trash.restoreMediaItem);
}
