//src/app/not-found.tsx
import Link from "next/link";
import { Film, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-background px-4">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-16 h-112 w-240 -translate-x-1/2 rounded-full bg-[hsl(var(--primary)/0.08)] blur-[140px]" />
        <div className="absolute -right-16 bottom-0 h-64 w-104 rounded-full bg-[hsl(var(--primary)/0.06)] blur-[120px]" />
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-[hsl(var(--foreground)/0.1)] bg-[hsl(var(--foreground)/0.04)] px-8 py-10 text-center backdrop-blur-2xl">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.15)] text-primary">
          <Film className="size-7" />
        </div>

        <p className="font-display text-6xl font-extrabold tracking-tight text-primary">
          404
        </p>
        <h1 className="mt-2 font-display text-xl font-semibold text-foreground">
          Scene not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This title isn&apos;t in your vault. It may have been moved, deleted,
          or never existed.
        </p>

        <div className="sprocket-divider my-6" />

        <Link
          href="/"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-[hsl(var(--primary)/0.9)]"
        >
          <Home className="size-4" />
          Back to your vault
        </Link>
      </div>
    </div>
  );
}
