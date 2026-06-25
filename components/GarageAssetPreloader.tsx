"use client";

import { useEffect, useRef } from "react";
import { usePerformanceMode } from "@/lib/usePerformanceMode";

type IdleCallbackWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

export default function GarageAssetPreloader() {
  const { allowInteractiveGarage, isLowPower } = usePerformanceMode();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    if (!allowInteractiveGarage) return;

    const nav = navigator as Navigator & {
      connection?: {
        saveData?: boolean;
      };
    };

    if (nav.connection?.saveData) return;

    const browserWindow = window as IdleCallbackWindow;
    const controller = new AbortController();
    let launchTimer = 0;
    let idleHandle: number | null = null;

    const cleanupScheduledWork = () => {
      if (launchTimer) {
        window.clearTimeout(launchTimer);
        launchTimer = 0;
      }

      if (idleHandle !== null && browserWindow.cancelIdleCallback) {
        browserWindow.cancelIdleCallback(idleHandle);
        idleHandle = null;
      }
    };

    const beginWarmup = async () => {
      if (startedRef.current || controller.signal.aborted) return;
      if (document.hidden) return;

      startedRef.current = true;

      const { warmGarageResources } = await import("@/lib/garageAssetWarmup");
      await warmGarageResources({
        signal: controller.signal,
      });
    };

    const scheduleWarmup = () => {
      if (startedRef.current || controller.signal.aborted) return;

      const initialDelay = isLowPower ? 2600 : 1200;
      launchTimer = window.setTimeout(() => {
        if (browserWindow.requestIdleCallback) {
          idleHandle = browserWindow.requestIdleCallback(
            () => {
              idleHandle = null;
              void beginWarmup();
            },
            { timeout: isLowPower ? 5000 : 2400 }
          );
          return;
        }

        void beginWarmup();
      }, initialDelay);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cleanupScheduledWork();
        return;
      }

      if (!startedRef.current) {
        scheduleWarmup();
      }
    };

    if (document.readyState === "complete") {
      scheduleWarmup();
    } else {
      window.addEventListener("load", scheduleWarmup, { once: true });
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      controller.abort();
      cleanupScheduledWork();
      window.removeEventListener("load", scheduleWarmup);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [allowInteractiveGarage, isLowPower]);

  return null;
}
