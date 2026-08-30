//src/features/media-items/components/form/PosterUploadField.tsx
"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, X } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface PosterUploadFieldProps {
  posterUrl?: string;
  onChange: (file: File | null) => void;
}

export function PosterUploadField({
  posterUrl,
  onChange,
}: PosterUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setIsLoading(true);

    try {
      onChange(file);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className="relative w-fit">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative flex aspect-2/3 w-28 items-center justify-center overflow-hidden rounded-xl border border-border bg-[hsl(var(--foreground)/0.04)] transition-colors hover:border-[hsl(var(--primary)/0.5)]"
      >
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : posterUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterUrl}
              alt="Poster preview"
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 flex items-center justify-center bg-overlay/0 opacity-0 transition-all group-hover:bg-overlay/50 group-hover:opacity-100">
              <ImagePlus className="size-5 text-overlay-foreground" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5 px-2 text-center">
            <ImagePlus className="size-5 text-muted-foreground" />
            <span className="text-[11px] leading-tight text-muted-foreground">
              Upload poster
            </span>
          </div>
        )}
      </button>

      {posterUrl && !isLoading && (
        <button
          type="button"
          onClick={handleRemove}
          className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md transition-transform hover:scale-110"
          aria-label="Remove poster"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
