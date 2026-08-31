//src/features/media-items/hooks/useFormStepper.ts
import { useState } from "react";
import { useFormContext, type Path } from "react-hook-form";
import { type MediaItemFormValues } from "../types";

type StepFields = Path<MediaItemFormValues>[];

const STEP_VALIDATIONS: StepFields[] = [
  ["title", "posterUrl", "kind"], // Step 0: Basics
  ["categoryId", "subcategoryIds"], // Step 1: Categorization
  [
    "status",
    "totalDurationSeconds",
    "progressSeconds",
    "progressDescription",
    "seasons",
    "progressSeason",
    "progressEpisode",
  ], // Step 2: Progress
  [
    "hasHard",
    "hardDescription",
    "hasCloud",
    "cloudDescription",
    "rating",
    "review",
  ], // Step 3: Storage & Review
];

export function useFormStepper(totalSteps = 4) {
  const [currentStep, setCurrentStep] = useState(0);
  const { trigger } = useFormContext<MediaItemFormValues>();

  const nextStep = async () => {
    const fieldsToValidate = STEP_VALIDATIONS[currentStep];
    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return {
    currentStep,
    nextStep,
    prevStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
  };
}
