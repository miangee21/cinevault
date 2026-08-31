//src/features/media-items/components/form/FormNavigation.tsx
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface FormNavigationProps {
  currentStep: number;
  totalSteps?: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
  onPrev: () => void;
  onNext: () => void;
  mode: "create" | "edit";
}

export function FormNavigation({
  isFirstStep,
  isLastStep,
  isSubmitting,
  onPrev,
  onNext,
  mode,
}: FormNavigationProps) {
  const [isLocked, setIsLocked] = useState(false);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLocked(true);
    setTimeout(() => setIsLocked(false), 400);
    onPrev();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLocked(true);
    setTimeout(() => setIsLocked(false), 400);
    onNext();
  };

  return (
    <div className="flex items-center justify-between mt-2">
      <button
        type="button"
        onClick={handlePrev}
        disabled={isFirstStep || isSubmitting || isLocked}
        className={cn(
          "flex h-11 items-center gap-1.5 rounded-full px-6 text-sm font-semibold transition-all",
          isFirstStep
            ? "pointer-events-none opacity-0"
            : "border border-border/60 hover:bg-muted text-foreground",
        )}
      >
        <ChevronLeft className="size-4" />
        Back
      </button>

      {!isLastStep ? (
        <button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting || isLocked}
          className="flex h-11 items-center gap-1.5 rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:opacity-50"
        >
          Next
          <ChevronRight className="size-4" />
        </button>
      ) : (
        <button
          type="submit"
          disabled={isSubmitting || isLocked}
          className="flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {mode === "create" ? "Add to vault" : "Save changes"}
        </button>
      )}
    </div>
  );
}
