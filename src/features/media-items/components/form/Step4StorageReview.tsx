//src/features/media-items/components/form/Step4StorageReview.tsx
"use client";

import { StorageToggles } from "./StorageToggles";
import { RatingReviewInput } from "./RatingReviewInput";

export function Step4StorageReview() {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 flex flex-col gap-6 duration-300 sm:flex-row sm:items-start">
      {/* Left Column: Storage */}
      <div className="flex flex-1 flex-col gap-6">
        <StorageToggles />
      </div>

      {/* Right Column: Rating & Review */}
      <div className="flex flex-1 flex-col gap-6">
        <RatingReviewInput />
      </div>
    </div>
  );
}
