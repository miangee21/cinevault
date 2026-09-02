//src/shared/components/EmptyState.tsx
import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-16 min-h-[60vh] text-center",
        className,
      )}
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.1)] text-primary">
        <Icon className="size-6" />
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
