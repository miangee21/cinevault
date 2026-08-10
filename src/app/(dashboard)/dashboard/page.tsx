//src/app/(dashboard)/dashboard/page.tsx
"use client";

import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export default function DashboardPage() {
  const { user, isLoading } = useCurrentUser();

  return (
    <div className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center text-center">
      <p className="text-sm uppercase tracking-wide text-muted-foreground">Dashboard</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">
        {isLoading ? "Loading..." : `Welcome, ${user?.name ?? "there"}`}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Categories and media items land here starting Step 9.
      </p>
    </div>
  );
}