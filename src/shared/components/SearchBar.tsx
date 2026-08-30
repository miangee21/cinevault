//src/shared/components/SearchBar.tsx
import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, onClear, value, ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative flex items-center w-full sm:w-64 shrink-0",
          className,
        )}
      >
        <Search className="absolute left-3.5 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
        <input
          ref={ref}
          value={value}
          className="h-10 w-full rounded-full border border-border/60 bg-background/50 pl-10 pr-10 text-sm font-medium outline-none transition-all focus:bg-background focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/60"
          {...props}
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  },
);
SearchBar.displayName = "SearchBar";
