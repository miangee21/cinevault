//src/features/trash/hooks/useEmptyTrash.ts
"use client";

import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";

export function useEmptyTrash() {
  return useMutation(api.trash.emptyTrash);
}
