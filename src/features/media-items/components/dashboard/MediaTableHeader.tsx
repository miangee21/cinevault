//src/features/media-items/components/dashboard/MediaTableHeader.tsx
"use client";

import { TableHeader, TableRow, TableHead } from "@/shared/components/ui/table";
import { ColumnResizeHandle } from "./ColumnResizeHandle";
import { type ColumnKey } from "../../hooks/useColumnWidths";

const COLUMNS: { key: ColumnKey; label: string; resizable: boolean }[] = [
  { key: "poster", label: "", resizable: false },
  { key: "title", label: "Title", resizable: true },
  { key: "type", label: "Type", resizable: true },
  { key: "storage", label: "Storage", resizable: true },
  { key: "status", label: "Status", resizable: true },
  { key: "rating", label: "Rating", resizable: false },
];

export function MediaTableHeader({
  onResize,
}: {
  onResize: (key: ColumnKey, deltaX: number) => void;
}) {
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent">
        {COLUMNS.map((col) => (
          <TableHead key={col.key} className="relative">
            {col.label}
            {col.resizable && (
              <ColumnResizeHandle
                onResize={(delta) => onResize(col.key, delta)}
              />
            )}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
