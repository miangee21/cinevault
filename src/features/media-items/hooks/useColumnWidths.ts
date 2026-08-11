//src/features/media-items/hooks/useColumnWidths.ts
"use client";

import { useEffect, useState } from "react";

export type ColumnKey =
  "poster" | "title" | "type" | "storage" | "status" | "rating";

const DEFAULT_WIDTHS: Record<ColumnKey, number> = {
  poster: 64,
  title: 280,
  type: 90,
  storage: 90,
  status: 130,
  rating: 130,
};

const MIN_WIDTHS: Record<ColumnKey, number> = {
  poster: 56,
  title: 140,
  type: 70,
  storage: 70,
  status: 100,
  rating: 100,
};

const STORAGE_KEY = "cinevault:table-column-widths";

export function useColumnWidths() {
  const [widths, setWidths] =
    useState<Record<ColumnKey, number>>(DEFAULT_WIDTHS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setWidths((prev) => ({ ...prev, ...JSON.parse(stored) }));
    } catch {
      // corrupt/missing storage — fall back to defaults silently
    }
  }, []);

  const resizeColumn = (key: ColumnKey, deltaX: number) => {
    setWidths((prev) => {
      const nextWidth = Math.max(MIN_WIDTHS[key], prev[key] + deltaX);
      const next = { ...prev, [key]: nextWidth };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage full/unavailable — resizing still works this session
      }
      return next;
    });
  };

  return { widths, resizeColumn };
}
