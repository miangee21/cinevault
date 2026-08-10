//src/features/auth/hooks/useAuthActions.ts
"use client";

import { useAuthActions as useConvexAuthActions } from "@convex-dev/auth/react";

/**
 * Thin wrapper around Convex Auth's useAuthActions so the rest of the
 * auth feature never imports Convex Auth internals directly.
 */
export function useAuthActions() {
  const { signIn, signOut } = useConvexAuthActions();
  return { signIn, signOut };
}
