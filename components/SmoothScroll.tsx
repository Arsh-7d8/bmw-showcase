"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { usePerformanceMode } from "@/lib/usePerformanceMode";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const isCompactViewport = useMediaQuery("(max-width: 1023px)");
  const isTouchDevice = useMediaQuery("(pointer: coarse)");
  const { allowSmoothScroll } = usePerformanceMode();

  useEffect(() => {
    if (isCompactViewport || isTouchDevice || !allowSmoothScroll) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      duration: 2.2,
      easing: (t) => 1 - Math.pow(1 - t, 4), // Quartic ease-out for heavier momentum
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      infinite: false,
      wheelMultiplier: 0.8, // Slows down the physical scroll distance slightly
    });

    lenisRef.current = lenis;
    let rafId = 0;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [allowSmoothScroll, isCompactViewport, isTouchDevice]);

  return <>{children}</>;
}
