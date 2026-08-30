//src/shared/components/CustomScrollbar.tsx
import * as React from "react";
import { cn } from "@/shared/lib/utils";

export function CustomScrollbar({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "overflow-y-auto overflow-x-hidden",
        // Theme-aware scrollbar styling
        "[&::-webkit-scrollbar]:w-2",
        "[&::-webkit-scrollbar-track]:bg-transparent",
        "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/80",
        "hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50",
        "transition-colors duration-300",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
