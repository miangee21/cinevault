//src/app/(dashboard)/layout.tsx
import { type ReactNode } from "react";
import { Navbar } from "@/shared/components/Navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
