//src/features/media-items/components/dashboard/StorageBadges.tsx
import { HardDrive, Cloud } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";

interface StorageBadgesProps {
  hasHard: boolean;
  hardDescription?: string;
  hasCloud: boolean;
  cloudDescription?: string;
}

function StorageIcon({
  active,
  activeClass,
  icon: Icon,
  description,
}: {
  active: boolean;
  activeClass: string;
  icon: typeof HardDrive;
  description?: string;
}) {
  const glyph = (
    <Icon
      className={cn("size-4", active ? activeClass : "text-storage-inactive")}
    />
  );

  if (!active || !description) return glyph;

  return (
    <Tooltip>
      <TooltipTrigger render={<span className="inline-flex">{glyph}</span>} />
      <TooltipContent>{description}</TooltipContent>
    </Tooltip>
  );
}

export function StorageBadges({
  hasHard,
  hardDescription,
  hasCloud,
  cloudDescription,
}: StorageBadgesProps) {
  return (
    <div className="flex items-center gap-2">
      <StorageIcon
        active={hasHard}
        activeClass="text-storage-hard"
        icon={HardDrive}
        description={hardDescription}
      />
      <StorageIcon
        active={hasCloud}
        activeClass="text-storage-cloud"
        icon={Cloud}
        description={cloudDescription}
      />
    </div>
  );
}
