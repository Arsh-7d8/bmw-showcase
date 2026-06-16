"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useEffect, useState } from "react";

function buildCompetitionMask(width: number, height: number) {
  const safeWidth = Math.max(width, 390);
  const safeHeight = Math.max(height, 844);
  const logoMatchedHeight = 142;
  const fontSize = Math.min(safeWidth * 0.102, safeHeight * 0.158, logoMatchedHeight);
  const letterSpacing = Math.max(fontSize * 0.022, 3);
  const y = safeHeight * 0.515;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${safeWidth} ${safeHeight}">
      <text
        x="50%"
        y="${y}"
        fill="white"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="Satoshi, sans-serif"
        font-weight="900"
        font-size="${fontSize}"
        letter-spacing="${letterSpacing}"
      >
        COMPETITION
      </text>
    </svg>
  `;

  return {
    maskImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
  };
}

function CompetitionLens({
  scale,
  opacity,
  y,
  videoScale,
  videoFilter,
}: {
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
  y: MotionValue<string>;
  videoScale: MotionValue<number>;
  videoFilter: MotionValue<string>;
}) {
  const [viewport, setViewport] = useState({ width: 1440, height: 900 });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const { maskImage } = buildCompetitionMask(viewport.width, viewport.height);

  return (
    <motion.div
      aria-hidden="true"
      style={{ scale, opacity, y, transformOrigin: "50% 50%" }}
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-visible"
    >
      <span className="sr-only">Competition</span>
      <div className="absolute inset-0 bg-[#020305]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_47%,rgba(0,102,177,0.2),transparent_30%),linear-gradient(115deg,rgba(7,12,18,0.94),rgba(4,9,15,0.78)_40%,rgba(1,2,3,0.98))]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_18%,transparent_82%,rgba(255,255,255,0.015))]" />
      <motion.div
        style={{
          scale: videoScale,
          filter: videoFilter,
          WebkitMaskImage: maskImage,
          maskImage,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
        }}
        className="absolute inset-0"
      >
        <video autoPlay muted loop playsInline preload="auto" className="h-full w-full object-cover">
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      </motion.div>
    </motion.div>
  );
}

function ShutterComposition({
  logoRotateY,
  logoRotateZ,
  logoScale,
  logoZ,
  logoOpacity,
}: {
  logoRotateY: MotionValue<number>;
  logoRotateZ: MotionValue<number>;
  logoScale: MotionValue<number>;
  logoZ: MotionValue<number>;
  logoOpacity: MotionValue<number>;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#020305]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_47%,rgba(0,102,177,0.28),transparent_32%),linear-gradient(115deg,rgba(255,255,255,0.08),rgba(255,255,255,0.01)_42%,rgba(0,0,0,0.62))]" />
      <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2">
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
          className="relative h-[360px] w-[360px]"
        >
          <Image
            src="/bmw-logo-v2.png"
            alt=""
            fill
            priority
            sizes="360px"
            className="object-contain drop-shadow-[0_38px_68px_rgba(0,0,0,0.62)]"
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
}: {
  side: "left" | "right";
  x: MotionValue<string>;
  logoRotateY: MotionValue<number>;
  logoRotateZ: MotionValue<number>;
  logoScale: MotionValue<number>;
  logoZ: MotionValue<number>;
  logoOpacity: MotionValue<number>;
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
        className={`absolute top-1/2 h-screen w-screen -translate-y-1/2 -translate-x-1/2 ${
          isLeft ? "left-full" : "left-0"
        }`}
      >
        <ShutterComposition
          logoRotateY={logoRotateY}
          logoRotateZ={logoRotateZ}
          logoScale={logoScale}
          logoZ={logoZ}
          logoOpacity={logoOpacity}
        />
      </div>
    </motion.div>
  );
}

import { forwardRef } from "react";

export const Hero = forwardRef<HTMLElement, { scrollYProgress: MotionValue<number> }>(
  ({ scrollYProgress }, ref) => {
  const prefersReducedMotion = useReducedMotion();

  const progress = useSpring(scrollYProgress, {
    stiffness: 170,
    damping: 42,
    mass: 1.15,
    restDelta: 0.0001,
  });

  const videoFilter = useTransform(
    progress,
    [0, 1],
    ["brightness(0.4) contrast(1.22) saturate(0.82)", "brightness(1) contrast(1.08) saturate(1)"]
  );
  const videoScale = useTransform(progress, [0, 0.85, 1], [1.08, 1.01, 1]);

  const logoRotateY = useTransform(progress, [0, 0.2], [0, 0]);
  const logoRotateZ = useTransform(
    progress,
    [0, 0.08, 0.16, 0.5],
    prefersReducedMotion ? [0, 0, 0, 0] : [0, 120, 360, 360]
  );
  const logoScale = useTransform(progress, [0, 0.09, 0.18], [0.985, 1.035, 1]);
  const logoZ = useTransform(progress, [0, 0.2], [0, 0]);
  const logoOpacity = useTransform(progress, [0, 0.04, 0.5, 0.58], [1, 1, 1, 0]);

  const leftDoorX = useTransform(progress, [0.18, 0.5], ["0%", "-104%"]);
  const rightDoorX = useTransform(progress, [0.18, 0.5], ["0%", "104%"]);
  const lensScale = useTransform(
    progress,
    [0.42, 0.56, 0.72, 0.84],
    prefersReducedMotion ? [1, 1.04, 1.18, 1.34] : [0.96, 1.18, 6.5, 28]
  );
  const lensOpacity = useTransform(
    progress,
    [0.15, 0.18, 0.7, 0.8, 0.86],
    [0, 1, 1, 0.18, 0]
  );
  const lensY = useTransform(progress, [0.44, 0.72, 0.84], ["0vh", "0vh", prefersReducedMotion ? "0vh" : "-7vh"]);
  const lensVideoScale = useTransform(
    progress,
    [0.42, 0.58, 0.72, 0.84],
    prefersReducedMotion ? [1.02, 1.04, 1.08, 1.12] : [1.08, 1.2, 1.55, 2.25]
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
  const apertureScale = useTransform(progress, [0.46, 0.82], [0.4, 4.8]);

  const revealOpacity = useTransform(progress, [0.76, 0.86, 0.94], [0, 0.72, 1]);
  const revealY = useTransform(progress, [0.76, 0.94], ["18vh", "0vh"]);
  const revealBlur = useTransform(progress, [0.76, 0.9], ["blur(22px)", "blur(0px)"]);
  const revealLineScale = useTransform(progress, [0.82, 0.94], [0, 1]);

  return (
    <section ref={ref} id="top" className="relative h-[520dvh] bg-[#020305]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <motion.div style={{ scale: videoScale, filter: videoFilter }} className="absolute inset-0 z-0">
          <video autoPlay muted loop playsInline preload="auto" className="h-full w-full object-cover">
            <source src="/hero.mp4" type="video/mp4" />
          </video>
        </motion.div>
        <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_45%,transparent_0%,rgba(2,3,5,0.34)_46%,rgba(2,3,5,0.82)_100%)]" />
        <motion.div
          style={{ opacity: entrancePanelOpacity }}
          className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_50%_47%,rgba(0,102,177,0.22),transparent_34%),linear-gradient(115deg,rgba(8,12,18,0.98),rgba(6,10,15,0.86)_42%,rgba(1,2,3,0.99))]"
        />
        <motion.div style={{ opacity: lensScrimOpacity }} className="absolute inset-0 z-[8] bg-[#020305]" />
        <motion.div
          style={{ opacity: apertureOpacity, scale: apertureScale }}
          className="pointer-events-none absolute left-1/2 top-1/2 z-[9] h-[26vmin] w-[26vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.42),rgba(0,160,233,0.18)_38%,transparent_68%)] blur-2xl"
        />

        <CompetitionLens
          scale={lensScale}
          opacity={lensOpacity}
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
        />
        <ShutterPanel
          side="right"
          x={rightDoorX}
          logoRotateY={logoRotateY}
          logoRotateZ={logoRotateZ}
          logoScale={logoScale}
          logoZ={logoZ}
          logoOpacity={logoOpacity}
        />

        <motion.div
          style={{ opacity: revealOpacity, y: revealY, filter: revealBlur }}
          className="section-shell pointer-events-none absolute inset-x-0 bottom-0 z-40 pb-[clamp(3rem,8vh,7rem)]"
        >
          <div className="max-w-[1100px]">
            <motion.div
              style={{ scaleX: revealLineScale, transformOrigin: "0% 50%" }}
              className="mb-7 h-px w-[min(34rem,70vw)] bg-[linear-gradient(90deg,rgba(232,237,242,0.95),rgba(0,160,233,0.78),transparent)]"
            />
            <p className="mb-5 text-[10px] font-black uppercase tracking-[0.58em] text-white/62">
              M4 Competition
            </p>
            <h1 className="max-w-5xl font-frick text-[clamp(2.65rem,10.2vw,9.4rem)] uppercase leading-[0.86] tracking-[-0.035em] text-white">
              <span className="block">Aggressive</span>
              <span className="block text-[#dfe7ee]">By Design</span>
            </h1>
            <p className="mt-7 max-w-[46rem] text-base leading-7 text-white/72 md:text-lg md:leading-8">
              A scroll-calibrated reveal built like a mechanical aperture: chrome doors, locked geometry,
              and one continuous path into the M division surface.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";
export default Hero;
