//src/shared/hooks/useDashboardPreferences.ts
"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cinevault:dashboard-preferences";

export function useDashboardPreferences() {
  const [showDeleteButton, setShowDeleteButtonState] = useState(false);
  const [viewMode, setViewModeState] = useState<"list" | "grid">("list");

  useEffect(() => {
    const handlePreferenceChange = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
          const preferences = JSON.parse(stored);

          setShowDeleteButtonState(preferences.showDeleteButton ?? false);
          setViewModeState(preferences.viewMode ?? "list");
        }
      } catch {
        // ignore corrupt/missing storage
      }
    };

    handlePreferenceChange();

    window.addEventListener(
      "cinevault:dashboard-preferences",
      handlePreferenceChange,
    );

    return () => {
      window.removeEventListener(
        "cinevault:dashboard-preferences",
        handlePreferenceChange,
      );
    };
  }, []);

  const setShowDeleteButton = (value: boolean) => {
    setShowDeleteButtonState(value);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const preferences = stored ? JSON.parse(stored) : {};

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...preferences,
          showDeleteButton: value,
        }),
      );

      window.dispatchEvent(new Event("cinevault:dashboard-preferences"));
    } catch {
      // storage unavailable — preference still works for this session
    }
  };

  const setViewMode = (value: "list" | "grid") => {
    setViewModeState(value);

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const preferences = stored ? JSON.parse(stored) : {};

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...preferences,
          viewMode: value,
        }),
      );

      window.dispatchEvent(new Event("cinevault:dashboard-preferences"));
    } catch {
      // preference still works for this session
    }
  };

  return {
    showDeleteButton,
    setShowDeleteButton,
    viewMode,
    setViewMode,
  };
}
