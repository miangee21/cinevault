//src/features/categories/components/IconGlyph.tsx
import { icons as lucideIcons } from "lucide-react";

export function IconGlyph({ name, className }: { name: string; className?: string }) {
  const LucideIcon = lucideIcons[name as keyof typeof lucideIcons];
  if (!LucideIcon) return null;
  return <LucideIcon className={className} />;
}