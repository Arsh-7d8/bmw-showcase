"use client";

import { useSyncExternalStore } from "react";

type ConnectionInfo = {
  effectiveType?: string;
  saveData?: boolean;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

type NavigatorWithPerformanceHints = Navigator & {
  connection?: ConnectionInfo;
  deviceMemory?: number;
};

export type PerformanceMode = {
  allowAmbientVideoAutoplay: boolean;
  allowHeroMaskVideo: boolean;
  allowInteractiveGarage: boolean;
  allowSmoothScroll: boolean;
  isLowPower: boolean;
};

const defaultMode: PerformanceMode = {
  allowAmbientVideoAutoplay: false,
  allowHeroMaskVideo: false,
  allowInteractiveGarage: false,
  allowSmoothScroll: false,
  isLowPower: true,
};

function readPerformanceMode(): PerformanceMode {
  if (typeof window === "undefined") {
    return defaultMode;
  }

  const nav = navigator as NavigatorWithPerformanceHints;
  const deviceMemory = nav.deviceMemory ?? 4;
  const hardwareConcurrency = navigator.hardwareConcurrency ?? 4;
  const connection = nav.connection;
  const saveData = connection?.saveData ?? false;
  const effectiveType = connection?.effectiveType ?? "";
  const slowNetwork = effectiveType.includes("2g");
  const reducedBudget = saveData || slowNetwork || deviceMemory <= 4 || hardwareConcurrency <= 4;
  const constrained = reducedBudget || deviceMemory <= 6 || hardwareConcurrency <= 6;

  return {
    allowAmbientVideoAutoplay: !constrained,
    allowHeroMaskVideo: !reducedBudget,
    allowInteractiveGarage: !reducedBudget,
    allowSmoothScroll: !constrained,
    isLowPower: constrained,
  };
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const nav = navigator as NavigatorWithPerformanceHints;
  const connection = nav.connection;

  const mediaQueries = [
    window.matchMedia("(prefers-reduced-motion: reduce)"),
    window.matchMedia("(pointer: coarse)"),
  ];

  const unsubs = mediaQueries.map((query) => {
    query.addEventListener("change", onStoreChange);
    return () => query.removeEventListener("change", onStoreChange);
  });

  if (connection?.addEventListener) {
    connection.addEventListener("change", onStoreChange);
    unsubs.push(() => connection.removeEventListener?.("change", onStoreChange));
  }

  return () => {
    unsubs.forEach((unsub) => unsub());
  };
}

export function usePerformanceMode() {
  return useSyncExternalStore(subscribe, readPerformanceMode, () => defaultMode);
}
