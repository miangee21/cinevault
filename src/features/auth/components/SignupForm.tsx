//src/features/auth/components/SignupForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, User, Mail, Lock, ShieldAlert } from "lucide-react";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/shared/components/ui/field";
import { AuthPillInput } from "./AuthPillInput";
import { useAuthActions } from "../hooks/useAuthActions";
import { useSignupEnabled } from "../hooks/useSignupEnabled";
import { signupSchema, type SignupFormValues } from "../types";

export function SignupForm() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const { signupEnabled } = useSignupEnabled();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (values: SignupFormValues) => {
    // Guards Enter-key submission too — disabling the button alone doesn't
    // stop a form's native Enter-to-submit behavior.
    if (!signupEnabled) return;

    setIsSubmitting(true);
    try {
      await signIn("password", {
        name: values.name,
        email: values.email,
        password: values.password,
        flow: "signUp",
      });
      toast.success("Account created — welcome to Cinevault");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not create your account. Try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-3">
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name" className="sr-only">
            Name
          </FieldLabel>
          <AuthPillInput
            id="name"
            icon={<User />}
            placeholder="Name"
            autoComplete="name"
            invalid={!!errors.name}
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email" className="sr-only">
            Email
          </FieldLabel>
          <AuthPillInput
            id="email"
            type="email"
            icon={<Mail />}
            placeholder="Email address"
            autoComplete="email"
            invalid={!!errors.email}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password" className="sr-only">
            Password
          </FieldLabel>
          <AuthPillInput
            id="password"
            isPassword
            icon={<Lock />}
            placeholder="Password"
            autoComplete="new-password"
            invalid={!!errors.password}
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <FieldError>{errors.password.message}</FieldError>
          )}
        </Field>

        {!signupEnabled && (
          <div className="flex items-center gap-2 rounded-2xl border border-[hsl(var(--destructive)/0.3)] bg-[hsl(var(--destructive)/0.06)] px-4 py-3 text-sm text-destructive">
            <ShieldAlert className="size-4 shrink-0" />
            New signups are currently closed.
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !signupEnabled}
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-[hsl(var(--primary)/0.9)] disabled:pointer-events-none disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </button>
      </FieldGroup>
    </form>
  );
}
