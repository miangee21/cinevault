//src/features/media-items/components/form/RatingReviewFields.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { Textarea } from "@/shared/components/ui/textarea";
import { StarRatingInput } from "@/features/ratings/components/StarRatingInput";
import { type MediaItemFormValues } from "../../types";

export function RatingReviewCard() {
  const { watch, setValue, register } = useFormContext<MediaItemFormValues>();
  const rating = watch("rating");

  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-foreground">Rating</p>
      <StarRatingInput
        value={rating}
        onChange={(value) =>
          setValue("rating", value, { shouldValidate: true })
        }
        size="sm"
      />
      {!!rating && (
        <Textarea
          placeholder="Your thoughts..."
          className="mt-2 rounded-xl text-xs"
          rows={2}
          {...register("review")}
        />
      )}
    </div>
  );
}
