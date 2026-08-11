//src/shared/hooks/useDashboardPreferences.ts
"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cinevault:dashboard-preferences";

export function useDashboardPreferences() {
  const [showDeleteButton, setShowDeleteButtonState] = useState(false);

  useEffect(() => {
    const handlePreferenceChange = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setShowDeleteButtonState(
            JSON.parse(stored).showDeleteButton ?? false,
          );
        }
      } catch {
        // ignore corrupt/missing storage
      }
    };

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

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored)
        setShowDeleteButtonState(JSON.parse(stored).showDeleteButton ?? false);
    } catch {
      // ignore corrupt/missing storage
    }
  }, []);

  const setShowDeleteButton = (value: boolean) => {
    setShowDeleteButtonState(value);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ showDeleteButton: value }),
      );

      window.dispatchEvent(new Event("cinevault:dashboard-preferences"));
    } catch {
      // storage unavailable — preference still works for this session
    }
  };

  return { showDeleteButton, setShowDeleteButton };
}
