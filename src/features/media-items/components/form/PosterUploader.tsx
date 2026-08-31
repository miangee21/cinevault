//src/features/media-items/components/form/PosterUploader.tsx
"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";
import { type MediaItemFormValues } from "../../types";

interface PosterUploaderProps {
  setFile: (f: File | null) => void;
}

export function PosterUploader({ setFile }: PosterUploaderProps) {
  const { control, setValue } = useFormContext<MediaItemFormValues>();
  const posterUrl = useWatch({ control, name: "posterUrl" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setFile(selectedFile);
    setValue("posterUrl", URL.createObjectURL(selectedFile), {
      shouldValidate: true,
    });
    setValue("posterStorageId", undefined);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const clearPoster = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setValue("posterUrl", "", { shouldValidate: true });
    setValue("posterStorageId", undefined);
  };

  return (
    <div className="w-full space-y-2 sm:w-48 shrink-0">
      <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Poster <span className="text-destructive">*</span>
      </label>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "group relative flex aspect-2/3 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 transition-all duration-300",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-dashed border-border/60 bg-[hsl(var(--foreground)/0.02)] hover:border-primary/50 hover:bg-primary/5",
          posterUrl ? "border-none shadow-premium bg-background" : "",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {posterUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterUrl}
              alt="Poster"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-overlay/0 transition-colors duration-300 group-hover:bg-overlay/40" />
            <button
              type="button"
              onClick={clearPoster}
              className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 shadow-md transition-all duration-300 hover:scale-110 group-hover:opacity-100"
            >
              <X className="size-4" />
            </button>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <ImagePlus className="size-8 text-white drop-shadow-lg" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 px-4 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-[hsl(var(--foreground)/0.06)] text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
              <ImagePlus className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Click or Drag
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                High quality image
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
