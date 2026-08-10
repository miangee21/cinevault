//src/features/auth/components/AuthPillInput.tsx
"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface AuthPillInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: ReactNode;
  invalid?: boolean;
}

export const AuthPillInput = forwardRef<HTMLInputElement, AuthPillInputProps>(
  ({ icon, invalid, className, ...props }, ref) => {
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
          className="h-full w-full border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          {...props}
        />
      </div>
    );
  },
);
AuthPillInput.displayName = "AuthPillInput";
