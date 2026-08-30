//src/features/auth/components/SignupForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { useAuthActions } from "../hooks/useAuthActions";
import { useSignupEnabled } from "../hooks/useSignupEnabled";
import { signupSchema, type SignupFormData } from "../types";

export function SignupForm() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const { signupEnabled } = useSignupEnabled();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignupFormData) => {
    if (!signupEnabled) return;

    setIsSubmitting(true);
    try {
      await signIn("password", {
        name: values.name,
        email: values.email,
        password: values.password,
        flow: "signUp",
      });
      toast.success("Account created", {
        description: "Welcome to Cinevault! Your vault is ready.",
      });
      router.push("/dashboard");
    } catch (error) {
      let errorMessage = "Could not create your account. Please try again.";

      if (error instanceof Error) {
        const rawMessage = error.message;
        if (
          rawMessage.includes("Invalid password") ||
          rawMessage.includes("already exists")
        ) {
          errorMessage =
            "An account with this email already exists. Please log in.";
        } else {
          errorMessage = rawMessage.split("Uncaught Error: ")[1] || rawMessage;
        }
      }

      toast.error("Signup Failed", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full text-center bg-card/60 backdrop-blur-md border border-border/50 rounded-4xl px-8 py-10 shadow-2xl">
      <div className="mb-8">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          <span className="whitespace-nowrap">
            Create your vault <span className="inline-block">✨</span>
          </span>
        </h1>

        <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
          Join <span className="text-primary font-medium">Cinevault</span> to
          track movies & series
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Name Input */}
        <div>
          <div className="flex items-center w-full bg-background/50 ring-1 ring-border/50 focus-within:ring-2 focus-within:ring-primary/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
            <User className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Full Name"
              autoComplete="name"
              className="w-full h-full bg-transparent text-foreground placeholder:text-muted-foreground/70 border-none outline-none text-sm px-2"
              disabled={isSubmitting}
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="text-destructive text-xs text-left mt-1.5 ml-4">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <div className="flex items-center w-full bg-background/50 ring-1 ring-border/50 focus-within:ring-2 focus-within:ring-primary/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
            <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="email"
              placeholder="Email address"
              autoComplete="email"
              className="w-full h-full bg-transparent text-foreground placeholder:text-muted-foreground/70 border-none outline-none text-sm px-2"
              disabled={isSubmitting}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-destructive text-xs text-left mt-1.5 ml-4">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <div className="flex items-center w-full bg-background/50 ring-1 ring-border/50 focus-within:ring-2 focus-within:ring-primary/60 h-12 rounded-full overflow-hidden pl-6 pr-4 gap-2 transition-all">
            <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="new-password"
              className="w-full h-full bg-transparent text-foreground placeholder:text-muted-foreground/70 border-none outline-none text-sm px-2"
              disabled={isSubmitting}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
              disabled={isSubmitting}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-destructive text-xs text-left mt-1.5 ml-4">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Closed Signups Alert */}
        {!signupEnabled && (
          <div className="flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive font-medium mt-4">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            New signups are currently closed.
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || !signupEnabled}
          className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all mt-2 shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-px disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Create Account"
          )}
        </Button>

        {/* Toggle Link */}
        <div className="text-muted-foreground text-sm mt-3 pt-3 relative before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-border/50">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 hover:underline font-semibold ml-1 transition-all"
          >
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}
