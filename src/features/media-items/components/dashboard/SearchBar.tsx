//src/features/media-items/components/dashboard/SearchBar.tsx
"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/shared/hooks/useDebounce";

interface SearchBarProps {
  onSearch: (term: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [input, setInput] = useState("");
  const debounced = useDebounce(input, 300);

  useEffect(() => {
    onSearch(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <div className="relative w-full max-w-xs">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search your vault..."
        className="h-10 w-full rounded-full border border-border bg-[hsl(var(--foreground)/0.04)] pl-10 pr-9 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[hsl(var(--primary)/0.5)]"
      />
      {input && (
        <button
          type="button"
          onClick={() => setInput("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
