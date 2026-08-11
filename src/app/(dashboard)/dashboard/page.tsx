//src/app/(dashboard)/dashboard/page.tsx
"use client";

import { MediaTable } from "@/features/media-items/components/dashboard/MediaTable";

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <MediaTable />
    </div>
  );
}
