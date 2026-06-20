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

function computePerformanceMode(): PerformanceMode {
  const nav = navigator as NavigatorWithPerformanceHints;
  const deviceMemory = nav.deviceMemory ?? 4;
  const hardwareConcurrency = navigator.hardwareConcurrency ?? 4;
  const connection = nav.connection;
  const saveData = connection?.saveData ?? false;
  const effectiveType = connection?.effectiveType ?? "";
  const slowNetwork = effectiveType.includes("2g") || effectiveType === "3g";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const compactViewport = window.innerWidth < 1280;
  const reducedBudget =
    saveData ||
    slowNetwork ||
    reducedMotion ||
    deviceMemory <= 6 ||
    hardwareConcurrency <= 6;
  const constrained =
    reducedBudget ||
    coarsePointer ||
    compactViewport ||
    deviceMemory <= 8 ||
    hardwareConcurrency <= 8;

  return {
    allowAmbientVideoAutoplay: !constrained,
    allowHeroMaskVideo: !reducedBudget && !compactViewport && !coarsePointer,
    allowInteractiveGarage: !constrained && deviceMemory >= 12 && hardwareConcurrency >= 8,
    allowSmoothScroll: false,
    isLowPower: constrained,
  };
}

let cachedMode = defaultMode;

function readPerformanceMode(): PerformanceMode {
  if (typeof window === "undefined") {
    return defaultMode;
  }

  const nextMode = computePerformanceMode();

  if (
    cachedMode.allowAmbientVideoAutoplay === nextMode.allowAmbientVideoAutoplay &&
    cachedMode.allowHeroMaskVideo === nextMode.allowHeroMaskVideo &&
    cachedMode.allowInteractiveGarage === nextMode.allowInteractiveGarage &&
    cachedMode.allowSmoothScroll === nextMode.allowSmoothScroll &&
    cachedMode.isLowPower === nextMode.isLowPower
  ) {
    return cachedMode;
  }

  cachedMode = nextMode;
  return cachedMode;
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
  const handleResize = () => onStoreChange();

  const unsubs = mediaQueries.map((query) => {
    query.addEventListener("change", onStoreChange);
    return () => query.removeEventListener("change", onStoreChange);
  });

  window.addEventListener("resize", handleResize);
  unsubs.push(() => window.removeEventListener("resize", handleResize));

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
