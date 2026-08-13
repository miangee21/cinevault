//src/features/auth/components/AuthPillInput.tsx
"use client";

import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface AuthPillInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: ReactNode;
  invalid?: boolean;
  isPassword?: boolean;
}

export const AuthPillInput = forwardRef<HTMLInputElement, AuthPillInputProps>(
  ({ icon, invalid, isPassword, className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div
        className={cn(
          "flex h-12 items-center gap-3 rounded-full border pl-5 pr-4 transition-all",
          "border-[hsl(var(--foreground)/0.1)] bg-[hsl(var(--foreground)/0.05)]",
          "focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/25",
          invalid && "border-destructive/60 focus-within:ring-destructive/25",
          className,
        )}
      >
        <span className="text-muted-foreground [&>svg]:size-4">{icon}</span>
        <input
          ref={ref}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className="h-full w-full border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        )}
      </div>
    );
  },
);
AuthPillInput.displayName = "AuthPillInput";
