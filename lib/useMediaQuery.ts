"use client";

import { useSyncExternalStore } from "react";

function subscribeToMediaQuery(query: string, onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

export function useMediaQuery(query: string, serverSnapshot = false) {
  return useSyncExternalStore(
    (onStoreChange) => subscribeToMediaQuery(query, onStoreChange),
    () => window.matchMedia(query).matches,
    () => serverSnapshot
  );
}
