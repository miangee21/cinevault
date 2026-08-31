//src/features/media-items/components/form/Step1Basics.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/shared/components/ui/input";
import { PosterUploader } from "./PosterUploader";
import { KindToggle } from "./KindToggle";
import { type MediaItemFormValues } from "../../types";
import { cn } from "@/shared/lib/utils";

interface Step1BasicsProps {
  setPosterFile: (f: File | null) => void;
}

export function Step1Basics({ setPosterFile }: Step1BasicsProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<MediaItemFormValues>();

  return (
    <div className="animate-in fade-in slide-in-from-right-4 flex flex-col gap-6 duration-300 sm:flex-row sm:items-start">
      {/* Left: Poster */}
      <div className="space-y-2">
        <PosterUploader setFile={setPosterFile} />
        {errors.posterUrl && (
          <p className="text-center text-xs font-medium text-destructive">
            {errors.posterUrl.message as string}
          </p>
        )}
      </div>

      {/* Right: Title & Type */}
      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="ml-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Title <span className="text-destructive">*</span>
          </label>
          <Input
            id="title"
            placeholder="e.g. Inception, Stranger Things"
            className={cn(
              "h-12 w-full rounded-full border-border/50 bg-[hsl(var(--foreground)/0.02)] px-5 font-medium shadow-sm transition-all hover:bg-[hsl(var(--foreground)/0.04)] focus:outline-none focus:ring-2 focus:ring-primary/20",
              errors.title && "border-destructive/50 focus:ring-destructive/20",
            )}
            aria-invalid={!!errors.title}
            {...register("title")}
          />
          {errors.title && (
            <p className="ml-2 text-xs font-medium text-destructive">
              {errors.title.message}
            </p>
          )}
        </div>

        <KindToggle />
      </div>
    </div>
  );
}
