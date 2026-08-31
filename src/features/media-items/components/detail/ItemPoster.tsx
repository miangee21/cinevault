//src/features/media-items/components/detail/ItemPoster.tsx
import { Film } from "lucide-react";
import { type MediaItem } from "../../types";

export function ItemPoster({ item }: { item: MediaItem }) {
  return (
    <div className="aspect-2/3 w-full max-w-xs overflow-hidden rounded-2xl border border-border bg-[hsl(var(--foreground)/0.04)] shadow-poster">
      {item.posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.posterUrl}
          alt={item.title}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Film className="size-10 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
