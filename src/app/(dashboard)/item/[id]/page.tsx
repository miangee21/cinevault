//src/app/(dashboard)/item/[id]/page.tsx
import { ItemDetailView } from "@/features/media-items/components/detail/ItemDetailView";
import { type Id } from "@convex/_generated/dataModel";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ItemDetailView itemId={id as Id<"mediaItems">} />;
}
