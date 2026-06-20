"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useMediaQuery } from "@/lib/useMediaQuery";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const isCompactViewport = useMediaQuery("(max-width: 1023px)");
  const isTouchDevice = useMediaQuery("(pointer: coarse)");

  useEffect(() => {
    if (isCompactViewport || isTouchDevice) {
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

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [isCompactViewport, isTouchDevice]);

  return <>{children}</>;
}
