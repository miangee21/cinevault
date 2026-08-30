//src/app/(dashboard)/categories/page.tsx
import { CategoryList } from "@/features/categories/components/CategoryList";
import { CustomScrollbar } from "@/shared/components/CustomScrollbar";

export default function CategoriesPage() {
  return (
    <CustomScrollbar className="h-[calc(100vh-3rem)] w-full">
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Categories
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Organize your vault into categories and subcategories.
          </p>
        </div>
        <CategoryList />
      </div>
    </CustomScrollbar>
  );
}
