//src/features/media-items/components/form/MediaItemFormDialog.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import {
  useForm,
  FormProvider,
  useFormContext,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { type Id } from "@convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { FormStepper } from "./FormStepper";
import { FormNavigation } from "./FormNavigation";
import { Step1Basics } from "./Step1Basics";
import { Step2Categorization } from "./Step2Categorization";
import { Step3Progress } from "./Step3Progress";
import { Step4StorageReview } from "./Step4StorageReview";
import { useFormStepper } from "../../hooks/useFormStepper";
import { useCreateMediaItem } from "../../hooks/useCreateMediaItem";
import { useUpdateMediaItem } from "../../hooks/useUpdateMediaItem";
import {
  mediaItemFormSchema,
  type MediaItemFormValues,
  type MediaItem,
} from "../../types";

interface MediaItemFormDialogProps {
  mode: "create" | "edit";
  item?: MediaItem;
  trigger: React.ReactNode;
}

function buildDefaultValues(item?: MediaItem): MediaItemFormValues {
  if (item?.kind === "movie") {
    return {
      kind: "movie",
      title: item.title,
      categoryId: item.categoryId,
      subcategoryIds: item.subcategoryIds ?? [],
      posterUrl: item.posterUrl ?? "",
      posterStorageId: item.posterStorageId,
      status: item.status,
      totalDurationSeconds: item.totalDurationSeconds,
      progressDescription: item.progressDescription,
      progressSeconds: item.progressSeconds,
      hasHard: item.hasHard,
      hardDescription: item.hardDescription,
      hasCloud: item.hasCloud,
      cloudDescription: item.cloudDescription,
      rating: item.rating,
      review: item.review,
    };
  }

  if (item?.kind === "series") {
    return {
      kind: "series",
      title: item.title,
      categoryId: item.categoryId,
      subcategoryIds: item.subcategoryIds ?? [],
      posterUrl: item.posterUrl ?? "",
      posterStorageId: item.posterStorageId,
      status: item.status,
      seasons: item.seasons ?? [],
      progressDescription: item.progressDescription,
      progressSeason: item.progressSeason,
      progressEpisode: item.progressEpisode,
      hasHard: item.hasHard,
      hardDescription: item.hardDescription,
      hasCloud: item.hasCloud,
      cloudDescription: item.cloudDescription,
      rating: item.rating,
      review: item.review,
    };
  }

  return {
    kind: "movie",
    title: "",
    categoryId: "",
    subcategoryIds: [],
    posterUrl: "",
    status: "not_started",
    hasHard: false,
    hasCloud: false,
  };
}

function InnerForm({
  mode,
  setPosterFile,
  onSubmit,
}: {
  mode: "create" | "edit";
  setPosterFile: (f: File | null) => void;
  onSubmit: SubmitHandler<MediaItemFormValues>;
}) {
  const { currentStep, nextStep, prevStep, isFirstStep, isLastStep } =
    useFormStepper(4);
  const {
    formState: { isSubmitting },
    handleSubmit,
  } = useFormContext<MediaItemFormValues>();

  const onFormSubmit = (e: React.SyntheticEvent) => {
    if (!isLastStep) {
      e.preventDefault();
      return;
    }
    void handleSubmit(onSubmit)(e);
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
      e.preventDefault();
      if (!isLastStep) {
        nextStep();
      } else {
        void handleSubmit(onSubmit)();
      }
    }
  };

  return (
    <form
      onSubmit={onFormSubmit}
      onKeyDown={handleFormKeyDown}
      className="flex flex-col w-full"
      noValidate
    >
      <div className="relative flex items-center justify-between mb-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {mode === "create" ? "Add New Media" : "Edit Details"}
          </DialogTitle>
        </DialogHeader>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-1">
          <FormStepper currentStep={currentStep} totalSteps={4} />
        </div>
      </div>

      <div className="min-h-65">
        {currentStep === 0 && <Step1Basics setPosterFile={setPosterFile} />}
        {currentStep === 1 && <Step2Categorization />}
        {currentStep === 2 && <Step3Progress />}
        {currentStep === 3 && <Step4StorageReview />}
      </div>

      <div className="mt-2">
        <FormNavigation
          currentStep={currentStep}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          isSubmitting={isSubmitting}
          onPrev={prevStep}
          onNext={nextStep}
          mode={mode}
        />
      </div>
    </form>
  );
}

export function MediaItemFormDialog({
  mode,
  item,
  trigger,
}: MediaItemFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const posterBlobUrlRef = useRef<string | null>(null);
  const createMediaItem = useCreateMediaItem();
  const updateMediaItem = useUpdateMediaItem();
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const form = useForm<MediaItemFormValues>({
    resolver: zodResolver(mediaItemFormSchema),
    defaultValues: buildDefaultValues(item),
    mode: "onChange",
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      form.reset(buildDefaultValues(item));
      setPosterFile(null);
    } else if (posterBlobUrlRef.current) {
      URL.revokeObjectURL(posterBlobUrlRef.current);
      posterBlobUrlRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (posterBlobUrlRef.current)
        URL.revokeObjectURL(posterBlobUrlRef.current);
    };
  }, []);

  const onSubmit = async (values: MediaItemFormValues) => {
    try {
      let uploadedPosterStorageId = values.posterStorageId;

      if (posterFile) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": posterFile.type },
          body: posterFile,
        });
        if (!result.ok) throw new Error("Poster upload failed");
        const { storageId } = await result.json();
        uploadedPosterStorageId = storageId;
      }

      const payload = {
        categoryId: values.categoryId as Id<"categories">,
        subcategoryIds: values.subcategoryIds as Id<"subcategories">[],
        title: values.title,
        kind: values.kind,
        posterUrl: values.posterUrl,
        posterStorageId: uploadedPosterStorageId as Id<"_storage"> | undefined,
        status: values.status,
        hasHard: values.hasHard,
        hardDescription: values.hasHard ? values.hardDescription : undefined,
        hasCloud: values.hasCloud,
        cloudDescription: values.hasCloud ? values.cloudDescription : undefined,
        rating:
          values.rating === undefined
            ? mode === "edit"
              ? 0
              : undefined
            : values.rating,
        review: (values.rating ?? 0) > 0 ? values.review : undefined,
        progressDescription:
          values.status === "in_progress"
            ? values.progressDescription
            : undefined,
        ...(values.kind === "movie"
          ? {
              totalDurationSeconds: values.totalDurationSeconds,
              progressSeconds:
                values.status === "in_progress"
                  ? values.progressSeconds
                  : undefined,
              seasons: undefined,
              progressSeason: undefined,
              progressEpisode: undefined,
            }
          : {
              seasons: values.seasons,
              progressSeason:
                values.status === "in_progress"
                  ? values.progressSeason
                  : undefined,
              progressEpisode:
                values.status === "in_progress"
                  ? values.progressEpisode
                  : undefined,
              totalDurationSeconds: undefined,
              progressSeconds: undefined,
            }),
      };

      if (mode === "create") {
        await createMediaItem(payload);
        toast.success(
          `${values.kind === "movie" ? "Movie" : "Series"} added to your vault!`,
        );
      } else if (item) {
        await updateMediaItem({ id: item._id, ...payload });
        toast.success("Changes saved successfully!");
      }
      handleOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="w-[95vw] sm:max-w-200 max-h-[85vh] overflow-hidden rounded-4xl p-8 sm:p-10 border-border/50 shadow-2xl">
        <FormProvider {...form}>
          <InnerForm
            mode={mode}
            setPosterFile={setPosterFile}
            onSubmit={onSubmit}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
