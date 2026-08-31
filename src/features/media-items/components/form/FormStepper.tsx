//src/features/media-items/components/form/FormStepper.tsx
"use client";

import { cn } from "@/shared/lib/utils";

interface FormStepperProps {
  currentStep: number;
  totalSteps?: number;
  stepTitles?: string[];
}

export function FormStepper({
  currentStep,
  totalSteps = 4,
  stepTitles = ["Basics", "Category", "Progress", "Review"],
}: FormStepperProps) {
  return (
    <div className="flex flex-col items-center space-y-2 pb-2">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div
              key={index}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                isActive
                  ? "w-8 bg-primary"
                  : isCompleted
                    ? "w-2 bg-primary/40"
                    : "w-2 bg-border",
              )}
            />
          );
        })}
      </div>
      <p className="text-xs font-medium text-muted-foreground">
        Step {currentStep + 1} of {totalSteps}:{" "}
        <span className="font-semibold text-foreground">
          {stepTitles[currentStep]}
        </span>
      </p>
    </div>
  );
}
