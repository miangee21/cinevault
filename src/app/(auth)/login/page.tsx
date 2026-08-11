//src/app/(auth)/login/page.tsx
import Link from "next/link";
import { Clapperboard } from "lucide-react";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="rounded-2xl border border-[hsl(var(--foreground)/0.1)] bg-[hsl(var(--foreground)/0.04)] px-8 py-8 backdrop-blur-2xl">
      <div className="mb-5 text-center">
        <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.15)] text-primary">
          <Clapperboard className="size-5" />
        </div>
        <h1 className="font-display text-xl font-semibold text-foreground">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Log in to pick up where you left off.
        </p>
      </div>

      <LoginForm />

      <div className="sprocket-divider my-5" />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
