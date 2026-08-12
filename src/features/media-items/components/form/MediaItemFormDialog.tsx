//src/features/media-items/components/form/MediaItemFormDialog.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useAction } from "convex/react";
import { api } from "@convex/_generated/api";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

import { CategoryField, SubcategoryField } from "./CategorySubcategoryFields";
import { StatusField } from "./StatusField";
import { PosterUploadField } from "./PosterUploadField";
import { MovieDurationField, MovieProgressField } from "./MovieFormFields";
import { SeriesSeasonsField, SeriesProgressField } from "./SeriesFormFields";
import { HardDriveField, CloudField } from "./StorageFields";
import { RatingReviewCard } from "./RatingReviewFields";

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
      subcategoryIds: item.subcategoryIds,
      posterUrl: item.posterUrl,
      posterPublicId: item.posterPublicId,
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
      subcategoryIds: item.subcategoryIds,
      posterUrl: item.posterUrl,
      posterPublicId: item.posterPublicId,
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
    status: "not_started",
    hasHard: false,
    hasCloud: false,
  };
}

export function MediaItemFormDialog({
  mode,
  item,
  trigger,
}: MediaItemFormDialogProps) {
  const [open, setOpen] = useState(false);
  const createMediaItem = useCreateMediaItem();
  const updateMediaItem = useUpdateMediaItem();
  const generateUploadSignature = useAction(
    api.cloudinary.generateUploadSignature,
  );
  const deleteCloudinaryImage = useAction(api.cloudinary.deleteCloudinaryImage);

  const form = useForm<MediaItemFormValues>({
    resolver: zodResolver(mediaItemFormSchema),
    defaultValues: buildDefaultValues(item),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const posterBlobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (open) {
      reset(buildDefaultValues(item));
      setPosterFile(null);
    } else if (posterBlobUrlRef.current) {
      URL.revokeObjectURL(posterBlobUrlRef.current);
      posterBlobUrlRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    return () => {
      if (posterBlobUrlRef.current) {
        URL.revokeObjectURL(posterBlobUrlRef.current);
      }
    };
  }, []);

  const kind = watch("kind");
  const posterUrl = watch("posterUrl");
  const title = watch("title");
  const categoryId = watch("categoryId");
  const hasHard = watch("hasHard");
  const hasCloud = watch("hasCloud");
  const rating = watch("rating");

  const isFormValid =
    !!posterUrl && !!title?.trim() && !!categoryId && (hasHard || hasCloud);
  const [posterFile, setPosterFile] = useState<File | null>(null);

  const handleKindChange = (nextKind: string) => {
    if (nextKind !== "movie" && nextKind !== "series") return;
    setValue("kind", nextKind, { shouldValidate: true });
    if (nextKind === "series" && !watch("seasons" as any)) {
      setValue("seasons" as any, [], { shouldValidate: true });
    }
  };

  const onSubmit = async (values: MediaItemFormValues) => {
    try {
      let uploadedPosterUrl = values.posterUrl;
      let uploadedPosterPublicId = values.posterPublicId;

      if (posterFile) {
        const { signature, timestamp, folder, apiKey, cloudName } =
          await generateUploadSignature({});

        const formData = new FormData();
        formData.append("file", posterFile);
        formData.append("api_key", apiKey);
        formData.append("timestamp", String(timestamp));
        formData.append("signature", signature);
        formData.append("folder", folder);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!response.ok) {
          throw new Error("Poster upload failed");
        }

        const data = await response.json();

        uploadedPosterUrl = data.secure_url;
        uploadedPosterPublicId = data.public_id;
      }

      const payload = {
        categoryId: values.categoryId as any,
        subcategoryIds: values.subcategoryIds as any,
        title: values.title,
        kind: values.kind,
        posterUrl: uploadedPosterUrl,
        posterPublicId: uploadedPosterPublicId,
        status: values.status,
        hasHard: values.hasHard,
        hardDescription: values.hardDescription,
        hasCloud: values.hasCloud,
        cloudDescription: values.cloudDescription,
        rating: values.rating,
        review: values.review,
        progressDescription: values.progressDescription,
        ...(values.kind === "movie"
          ? {
              totalDurationSeconds: values.totalDurationSeconds,
              progressSeconds: values.progressSeconds,
              seasons: undefined,
              progressSeason: undefined,
              progressEpisode: undefined,
            }
          : {
              seasons: values.seasons,
              progressSeason: values.progressSeason,
              progressEpisode: values.progressEpisode,
              totalDurationSeconds: undefined,
              progressSeconds: undefined,
            }),
      };

      if (mode === "create") {
        await createMediaItem(payload);
        toast.success(
          `${values.kind === "movie" ? "Movie" : "Series"} added to your vault`,
        );
      } else if (item) {
        await updateMediaItem({ id: item._id, ...payload });

        if (
          item.posterPublicId &&
          item.posterPublicId !== uploadedPosterPublicId
        ) {
          await deleteCloudinaryImage({
            publicId: item.posterPublicId,
          });
        }

        toast.success("Changes saved");
      }
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />

      <DialogContent className="media-item-dialog max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add new" : "Edit"}</DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup className="gap-5">
              <div className="flex items-start gap-4">
                <PosterUploadField
                  posterUrl={posterUrl}
                  onChange={(file) => {
                    if (posterBlobUrlRef.current) {
                      URL.revokeObjectURL(posterBlobUrlRef.current);
                      posterBlobUrlRef.current = null;
                    }

                    setPosterFile(file);

                    if (file) {
                      const blobUrl = URL.createObjectURL(file);
                      posterBlobUrlRef.current = blobUrl;
                      setValue("posterUrl", blobUrl, { shouldValidate: true });
                      setValue("posterPublicId", undefined);
                    } else {
                      setValue("posterUrl", undefined);
                      setValue("posterPublicId", undefined);
                    }
                  }}
                />

                <div className="w-56 shrink-0 space-y-3">
                  <Field data-invalid={!!errors.title}>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input
                      id="title"
                      placeholder="e.g. Inception"
                      className="h-10 w-full rounded-full px-5"
                      aria-invalid={!!errors.title}
                      {...register("title")}
                    />
                    {errors.title && (
                      <FieldError>{errors.title.message}</FieldError>
                    )}
                  </Field>

                  <div>
                    <p className="mb-1.5 text-sm font-medium text-foreground">
                      Type
                    </p>
                    <Tabs value={kind} onValueChange={handleKindChange}>
                      <TabsList className="rounded-full">
                        <TabsTrigger
                          value="movie"
                          className="rounded-full border-none font-semibold shadow-none data-[state=active]:bg-primary! data-[state=active]:text-primary-foreground! data-[state=active]:shadow-none!"
                        >
                          Movie
                        </TabsTrigger>
                        <TabsTrigger
                          value="series"
                          className="rounded-full border-none font-semibold shadow-none data-[state=active]:bg-primary! data-[state=active]:text-primary-foreground! data-[state=active]:shadow-none!"
                        >
                          Series
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <p className="text-sm font-medium text-foreground">Storage</p>
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <HardDriveField />
                    </div>
                    <div className="flex-1">
                      <CloudField />
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <RatingReviewCard />
                </div>
              </div>

              <div className="flex flex-wrap items-start gap-6">
                <div className="w-60 space-y-4">
                  <CategoryField />
                  <StatusField />
                </div>
                <div className="w-60 space-y-4">
                  <SubcategoryField />
                  {kind === "movie" && <MovieProgressField />}
                </div>
                {kind === "movie" ? (
                  <MovieDurationField />
                ) : (
                  <>
                    <SeriesSeasonsField />
                    <SeriesProgressField />
                  </>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-[hsl(var(--primary)/0.9)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : null}
                {mode === "create" ? "Add to vault" : "Save changes"}
              </button>
            </FieldGroup>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
