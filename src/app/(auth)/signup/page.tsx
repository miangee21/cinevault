//src/app/(auth)/signup/page.tsx
import Link from "next/link";
import { Clapperboard } from "lucide-react";
import { SignupForm } from "@/features/auth/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="rounded-2xl border border-[hsl(var(--foreground)/0.1)] bg-[hsl(var(--foreground)/0.04)] px-8 py-8 backdrop-blur-2xl">
      <div className="mb-5 text-center">
        <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Clapperboard className="size-5" />
        </div>
        <h1 className="font-display text-xl font-semibold text-foreground">
          Create your vault
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Track every movie and series you love.
        </p>
      </div>

      <SignupForm />

      <div className="sprocket-divider my-5" />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
