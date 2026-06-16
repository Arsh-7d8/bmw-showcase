"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { forwardRef, memo, useEffect, useId, useMemo, useRef, useState } from "react";
import { sfx } from "@/lib/audio";
import { compactHeroStill } from "@/lib/bmwMedia";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { usePerformanceMode } from "@/lib/usePerformanceMode";

function buildCompetitionWordmark(width: number, height: number) {
  const safeWidth = Math.max(width, 390);
  const safeHeight = Math.max(height, 844);
  const logoMatchedHeight = 142;
  const fontSize = Math.min(safeWidth * 0.102, safeHeight * 0.158, logoMatchedHeight);
  const letterSpacing = Math.max(fontSize * 0.022, 3);
  const y = safeHeight * 0.515;

  return {
    safeWidth,
    safeHeight,
    fontSize,
    letterSpacing,
    y,
  };
}

const CompetitionLens = memo(function CompetitionLens({
  active,
  scale,
  opacity,
  useVideoFill,
  y,
  videoScale,
  videoFilter,
}: {
  active: boolean;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
  useVideoFill: boolean;
  y: MotionValue<string>;
  videoScale: MotionValue<number>;
  videoFilter: MotionValue<string>;
}) {
  const clipPathId = useId().replace(/:/g, "");
  const [fontReady, setFontReady] = useState(false);
  const [viewport, setViewport] = useState({ width: 1440, height: 900 });

  useEffect(() => {
    let frame = 0;

    const updateViewport = () => {
      if (frame) cancelAnimationFrame(frame);

      frame = window.requestAnimationFrame(() => {
        setViewport((current) => {
          const nextWidth = window.innerWidth;
          const nextHeight = window.innerHeight;

          if (current.width === nextWidth && current.height === nextHeight) {
            return current;
          }

          return {
            width: nextWidth,
            height: nextHeight,
          };
        });
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (fontReady || typeof document === "undefined" || !("fonts" in document)) {
      return;
    }

    let cancelled = false;
    const fontFaceSet = document.fonts;

    const markReady = () => {
      if (!cancelled) setFontReady(true);
    };

    if (fontFaceSet.check('900 32px "Frick"')) {
      markReady();
      return () => {
        cancelled = true;
      };
    }

    fontFaceSet.load('900 32px "Frick"').then(markReady).catch(markReady);
    fontFaceSet.ready.then(markReady).catch(markReady);

    return () => {
      cancelled = true;
    };
  }, [fontReady]);

  const wordmark = useMemo(
    () => buildCompetitionWordmark(viewport.width, viewport.height),
    [viewport.height, viewport.width]
  );

  return (
    <motion.div
      aria-hidden="true"
      style={{ scale, opacity, y, transformOrigin: "50% 50%" }}
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-visible [contain:layout_paint_style]"
    >
      <span className="sr-only">Competition</span>
      <div className="absolute inset-0 bg-[#020305]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_47%,rgba(0,102,177,0.2),transparent_30%),linear-gradient(115deg,rgba(7,12,18,0.94),rgba(4,9,15,0.78)_40%,rgba(1,2,3,0.98))]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_18%,transparent_82%,rgba(255,255,255,0.015))]" />
      <motion.div
        style={{
          scale: fontReady && useVideoFill ? videoScale : 1,
          filter: fontReady && useVideoFill ? videoFilter : "none",
          opacity: fontReady ? 1 : 0,
          willChange: "transform, opacity, filter",
        }}
        className="absolute inset-0"
      >
        <svg
          viewBox={`0 0 ${wordmark.safeWidth} ${wordmark.safeHeight}`}
          className="h-full w-full"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <clipPath id={clipPathId} clipPathUnits="userSpaceOnUse">
              <text
                x="50%"
                y={wordmark.y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="Frick, sans-serif"
                fontWeight="900"
                fontSize={wordmark.fontSize}
                letterSpacing={wordmark.letterSpacing}
              >
                COMPETITION
              </text>
            </clipPath>
          </defs>
          {active && useVideoFill ? (
            <g clipPath={`url(#${clipPathId})`}>
              <image
                href={compactHeroStill}
                x="0"
                y="0"
                width={wordmark.safeWidth}
                height={wordmark.safeHeight}
                preserveAspectRatio="xMidYMid slice"
              />
            </g>
          ) : null}
        </svg>
      </motion.div>
      {!fontReady || !useVideoFill ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-frick text-[min(15vw,8.875rem)] uppercase tracking-[0.04em] text-white">
            Competition
          </span>
        </div>
      ) : null}
    </motion.div>
  );
});

function ShutterComposition({
  logoRotateY,
  logoRotateZ,
  logoScale,
  logoZ,
  logoOpacity,
  compact,
}: {
  logoRotateY: MotionValue<number>;
  logoRotateZ: MotionValue<number>;
  logoScale: MotionValue<number>;
  logoZ: MotionValue<number>;
  logoOpacity: MotionValue<number>;
  compact: boolean;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#020305]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_47%,rgba(0,102,177,0.28),transparent_32%),linear-gradient(115deg,rgba(255,255,255,0.08),rgba(255,255,255,0.01)_42%,rgba(0,0,0,0.62))]" />
      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
          compact
            ? "h-[164px] w-[164px] min-[420px]:h-[178px] min-[420px]:w-[178px]"
            : "h-[260px] w-[260px] sm:h-[320px] sm:w-[320px] md:h-[360px] md:w-[360px]"
        }`}
      >
        <motion.div
          style={{
            opacity: logoOpacity,
            rotateY: logoRotateY,
            rotateZ: logoRotateZ,
            scale: logoScale,
            z: logoZ,
            transformOrigin: "50% 50%",
            transformStyle: "preserve-3d",
          }}
          className="relative h-full w-full"
        >
          <Image
            src="/bmw-logo-v2.png"
            alt=""
            priority
            unoptimized
            sizes="360px"
            width={360}
            height={360}
            className="h-full w-full object-contain"
          />
        </motion.div>
      </div>
    </div>
  );
}

function ShutterPanel({
  side,
  x,
  logoRotateY,
  logoRotateZ,
  logoScale,
  logoZ,
  logoOpacity,
  compact,
}: {
  side: "left" | "right";
  x: MotionValue<string>;
  logoRotateY: MotionValue<number>;
  logoRotateZ: MotionValue<number>;
  logoScale: MotionValue<number>;
  logoZ: MotionValue<number>;
  logoOpacity: MotionValue<number>;
  compact: boolean;
}) {
  const isLeft = side === "left";

  return (
    <motion.div
      style={{ x }}
      className={`absolute inset-y-0 z-30 w-1/2 overflow-hidden ${
        isLeft ? "left-0" : "right-0"
      }`}
    >
      <div
        className={`absolute top-1/2 h-full w-[200%] -translate-y-1/2 -translate-x-1/2 ${
          isLeft ? "left-full" : "left-0"
        }`}
      >
        <ShutterComposition
          logoRotateY={logoRotateY}
          logoRotateZ={logoRotateZ}
          logoScale={logoScale}
          logoZ={logoZ}
          logoOpacity={logoOpacity}
          compact={compact}
        />
      </div>
    </motion.div>
  );
}

export const Hero = forwardRef<HTMLElement, { scrollYProgress: MotionValue<number> }>(
  ({ scrollYProgress }, ref) => {
  const prefersReducedMotion = useReducedMotion();
  const hasPlayedBass = useRef(false);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const isMobileViewport = useMediaQuery("(max-width: 767px)");
  const isCompactViewport = useMediaQuery("(max-width: 1023px)");
  const { allowAmbientVideoAutoplay, allowHeroMaskVideo } = usePerformanceMode();
  const [isHeroVideoActive, setIsHeroVideoActive] = useState(true);
  const [isLensActive, setIsLensActive] = useState(true);
  const shouldRenderHeroVideo = allowAmbientVideoAutoplay && !prefersReducedMotion && !isMobileViewport;

  const progress = useSpring(scrollYProgress, {
    stiffness: 170,
    damping: 42,
    mass: 1.15,
    restDelta: 0.0001,
  });

  useMotionValueEvent(progress, "change", (latest) => {
    if (isCompactViewport) return;
    if (latest > 0.17 && !hasPlayedBass.current) {
      sfx.playCinematicBass();
      hasPlayedBass.current = true;
    } else if (latest < 0.1) {
      hasPlayedBass.current = false; // reset if scrolled back to very top
    }

    const nextLensState = latest < 0.82;
    setIsLensActive((current) => (current === nextLensState ? current : nextLensState));
  });

  const videoFilter = useTransform(
    progress,
    [0, 1],
    isCompactViewport
      ? ["none", "none"]
      : ["brightness(0.4) contrast(1.22) saturate(0.82)", "brightness(1) contrast(1.08) saturate(1)"]
  );
  const videoScale = useTransform(progress, [0, 0.85, 1], isCompactViewport ? [1.01, 1.002, 1] : [1.08, 1.01, 1]);

  const logoRotateY = useTransform(progress, [0, 0.2], [0, 0]);
  const logoRotateZ = useTransform(
    progress,
    [0, 0.08, 0.16, 0.5],
    prefersReducedMotion ? [0, 0, 0, 0] : [0, 120, 360, 360]
  );
  const logoScale = useTransform(
    progress,
    [0, 0.08, 0.16, 0.18],
    isMobileViewport ? [0.68, 0.84, 0.91, 0.9] : [0.9, 1.05, 1.035, 1]
  );
  const logoZ = useTransform(progress, [0, 0.2], [0, 0]);
  const logoOpacity = useTransform(progress, [0, 0.04, 0.5, 0.58], [1, 1, 1, 0]);

  const leftDoorX = useTransform(progress, [0.18, 0.5], ["0%", "-104%"]);
  const rightDoorX = useTransform(progress, [0.18, 0.5], ["0%", "104%"]);
  const lensScale = useTransform(
    progress,
    [0.42, 0.56, 0.72, 0.84],
    prefersReducedMotion
      ? [1, 1.04, 1.18, 1.34]
      : isCompactViewport
        ? [0.98, 1.04, 4.5, 48.0]
        : [0.96, 1.18, 6.5, 28.0]
  );
  const lensOpacity = useTransform(
    progress,
    [0.15, 0.18, 0.7, 0.8, 0.86],
    [0, 1, 1, 0.18, 0]
  );
  const lensY = useTransform(
    progress,
    [0.44, 0.72, 0.84],
    ["0vh", "0vh", prefersReducedMotion || isCompactViewport ? "0vh" : "-7vh"]
  );
  const lensVideoScale = useTransform(
    progress,
    [0.42, 0.58, 0.72, 0.84],
    prefersReducedMotion
      ? [1.02, 1.04, 1.08, 1.12]
      : isCompactViewport
        ? [1.01, 1.03, 1.08, 1.14]
        : [1.08, 1.2, 1.55, 2.25]
  );
  const lensVideoFilter = useTransform(
    progress,
    [0.42, 0.7, 0.84],
    [
      "brightness(1.14) contrast(1.08) saturate(1.02)",
      "brightness(1.28) contrast(1.14) saturate(1.08)",
      "brightness(1.42) contrast(1.18) saturate(1.12)",
    ]
  );
  const entrancePanelOpacity = useTransform(progress, [0, 0.34, 0.44, 0.56], [1, 1, 0.74, 0]);
  const lensScrimOpacity = useTransform(progress, [0.42, 0.58, 0.84], [0, 0.42, 0]);
  const apertureOpacity = useTransform(progress, [0.46, 0.63, 0.82], [0, 0.68, 0]);
  const apertureScale = useTransform(progress, [0.46, 0.82], isCompactViewport ? [0.4, 12.0] : [0.4, 4.8]);
  const assignSectionRef = (node: HTMLElement | null) => {
    heroSectionRef.current = node;

    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  useEffect(() => {
    const node = heroSectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVideoActive(Boolean(entry?.isIntersecting));
      },
      { rootMargin: "220px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldRenderHeroVideo) {
      return;
    }

    const video = heroVideoRef.current;
    if (!video) return;

    const tryPlay = () => {
      video.muted = true;
      video.playsInline = true;
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      if (video.readyState === 0) {
        video.load();
      }
      void video.play().catch(() => {});
    };

    const handleReady = () => {
      if (isHeroVideoActive) {
        tryPlay();
      }
    };

    video.addEventListener("loadedmetadata", handleReady);
    video.addEventListener("canplay", handleReady);
    video.addEventListener("playing", handleReady);
    document.addEventListener("visibilitychange", handleReady);

    if (isHeroVideoActive) {
      tryPlay();
    }

    if (!isHeroVideoActive) {
      video.pause();
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleReady);
      video.removeEventListener("canplay", handleReady);
      video.removeEventListener("playing", handleReady);
      document.removeEventListener("visibilitychange", handleReady);
    };
  }, [isHeroVideoActive, shouldRenderHeroVideo]);

  if (isMobileViewport) {
    return (
      <section ref={assignSectionRef} id="top" className="relative min-h-[100dvh] overflow-hidden bg-[#020305]">
        <div className="relative h-[100dvh]">
          <Image
            src={compactHeroStill}
            alt="BMW M hero frame"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_38%,rgba(0,102,177,0.18),transparent_32%),linear-gradient(180deg,rgba(2,3,5,0.18)_0%,rgba(2,3,5,0.44)_58%,rgba(2,3,5,0.94)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,rgba(2,3,5,0),#020305_100%)]" />
        </div>
      </section>
    );
  }

  return (
    <section ref={assignSectionRef} id="top" className="relative h-[320dvh] bg-[#020305] sm:h-[350dvh] md:h-[400dvh] lg:h-[520dvh]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <motion.div style={{ scale: videoScale, filter: videoFilter, willChange: "transform, filter" }} className="absolute inset-0 z-0 [contain:paint]">
          <Image
            src={compactHeroStill}
            alt="BMW M hero frame"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {shouldRenderHeroVideo ? (
            <video
              ref={heroVideoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              poster={compactHeroStill}
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src="/hero.mp4" type="video/mp4" />
            </video>
          ) : null}
        </motion.div>
        <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_45%,transparent_0%,rgba(2,3,5,0.34)_46%,rgba(2,3,5,0.82)_100%)]" />
        <motion.div
          style={{ opacity: entrancePanelOpacity }}
          className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_50%_47%,rgba(0,102,177,0.22),transparent_34%),linear-gradient(115deg,rgba(8,12,18,0.98),rgba(6,10,15,0.86)_42%,rgba(1,2,3,0.99))]"
        />
        <motion.div style={{ opacity: lensScrimOpacity }} className="absolute inset-0 z-[8] bg-[#020305]" />
        <motion.div
          style={{ opacity: apertureOpacity, scale: apertureScale }}
          className="pointer-events-none absolute left-1/2 top-1/2 z-[9] h-[22vmin] w-[22vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.42),rgba(0,160,233,0.18)_38%,transparent_68%)] blur-2xl sm:h-[26vmin] sm:w-[26vmin]"
        />

        <CompetitionLens
          active={isLensActive}
          scale={lensScale}
          opacity={lensOpacity}
          useVideoFill={allowHeroMaskVideo}
          y={lensY}
          videoScale={lensVideoScale}
          videoFilter={lensVideoFilter}
        />

        <ShutterPanel
          side="left"
          x={leftDoorX}
          logoRotateY={logoRotateY}
          logoRotateZ={logoRotateZ}
          logoScale={logoScale}
          logoZ={logoZ}
          logoOpacity={logoOpacity}
          compact={isMobileViewport}
        />
        <ShutterPanel
          side="right"
          x={rightDoorX}
          logoRotateY={logoRotateY}
          logoRotateZ={logoRotateZ}
          logoScale={logoScale}
          logoZ={logoZ}
          logoOpacity={logoOpacity}
          compact={isMobileViewport}
        />
      </div>
    </section>
  );
});

Hero.displayName = "Hero";
export default Hero;
