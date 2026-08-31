//src/features/media-items/components/form/Step2Categorization.tsx
"use client";

import { CategorySelector } from "./CategorySelector";
import { SubcategorySelector } from "./SubcategorySelector";

export function Step2Categorization() {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 grid grid-cols-1 gap-6 duration-300 sm:grid-cols-2 sm:items-start">
      {/* Left: Category */}
      <div className="w-full">
        <CategorySelector />
      </div>

      {/* Right: Subcategories */}
      <div className="w-full">
        <SubcategorySelector />
      </div>
    </div>
  );
}
