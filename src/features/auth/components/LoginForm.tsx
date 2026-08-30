//src/features/auth/components/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { useAuthActions } from "../hooks/useAuthActions";
import { loginSchema, type LoginFormData } from "../types";

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await signIn("password", {
        email: values.email,
        password: values.password,
        flow: "signIn",
      });
      toast.success("Welcome back", {
        description: "You have successfully logged in.",
      });
      router.push("/dashboard");
    } catch {
      toast.error("Login Failed", {
        description: "Invalid email or password. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full text-center bg-card/60 backdrop-blur-md border border-border/50 rounded-4xl px-8 py-10 shadow-2xl">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Welcome back <span className="inline-block">👋</span>
        </h1>

        <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
          Sign in to continue to your{" "}
          <span className="text-primary font-medium">Cinevault</span> account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
              autoComplete="current-password"
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

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all mt-2 shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-px"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Log in"
          )}
        </Button>

        {/* Signup Link */}
        <div className="text-muted-foreground text-sm mt-3 pt-3 relative before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-border/50">
          New to Cinevault?{" "}
          <Link
            href="/signup"
            className="text-primary hover:text-primary/80 hover:underline font-semibold ml-1 transition-all"
          >
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
}
