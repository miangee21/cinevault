//src/app/(dashboard)/trash/page.tsx
import { TrashPageView } from "@/features/trash/components/TrashPageView";
import { CustomScrollbar } from "@/shared/components/CustomScrollbar";

export default function TrashPage() {
  return (
    <CustomScrollbar className="h-[calc(100vh-72px)] w-full bg-background">
      <TrashPageView />
    </CustomScrollbar>
  );
}
