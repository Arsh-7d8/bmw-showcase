"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { usePerformanceMode } from "@/lib/usePerformanceMode";

type SectionHeadingProps = {
  eyebrow?: string;
  titleTop: string;
  titleBottom: string;
  align?: "left" | "right";
  singleLine?: boolean;
};

export default function SectionHeading({
  eyebrow,
  titleTop,
  titleBottom,
  align = "left",
  singleLine = false,
}: SectionHeadingProps) {
  const prefersReducedMotion = useReducedMotion();
  const isCompactViewport = useMediaQuery("(max-width: 1023px)");
  const { isLowPower } = usePerformanceMode();
  const allowAmbientMotion = !prefersReducedMotion && !isCompactViewport && !isLowPower;
  const isRight = align === "right";
  const title = singleLine ? `${titleTop} ${titleBottom}`.trim() : null;
  const titleClass = singleLine
    ? "font-frick text-[clamp(2.1rem,8vw,5rem)] uppercase leading-[0.94] tracking-[-0.03em] sm:text-[clamp(2.4rem,6vw,5rem)] lg:whitespace-nowrap"
    : "font-frick text-[clamp(2.35rem,10vw,7.2rem)] uppercase leading-[0.92] tracking-[-0.03em] sm:text-[clamp(2.8rem,8vw,7.2rem)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={isRight ? "text-right" : "text-left"}
    >
      <div
        className={`mb-5 flex items-center gap-2 sm:mb-6 sm:gap-3 ${
          isRight ? "justify-end" : "justify-start"
        }`}
      >
        <motion.span
          className="h-[5px] w-10 -skew-x-[28deg] bg-[#1d4f91] sm:h-[7px] sm:w-14"
          animate={allowAmbientMotion ? { x: [0, 2, 0], scaleX: [1, 1.08, 1], opacity: [0.88, 1, 0.88] } : undefined}
          transition={{ duration: 2.6, repeat: allowAmbientMotion ? Infinity : 0, ease: "easeInOut" }}
        />
        <motion.span
          className="h-[5px] w-7 -skew-x-[28deg] bg-[#46b5ff] sm:h-[7px] sm:w-10"
          animate={allowAmbientMotion ? { x: [0, 3, 0], scaleX: [1, 1.12, 1], opacity: [0.9, 1, 0.9] } : undefined}
          transition={{ duration: 2.15, repeat: allowAmbientMotion ? Infinity : 0, ease: "easeInOut", delay: 0.1 }}
        />
        <motion.span
          className="h-[5px] w-12 -skew-x-[28deg] bg-[#e53b35] sm:h-[7px] sm:w-16"
          animate={allowAmbientMotion ? { x: [0, 2, 0], scaleX: [1, 1.06, 1], opacity: [0.88, 1, 0.88] } : undefined}
          transition={{ duration: 2.4, repeat: allowAmbientMotion ? Infinity : 0, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.span
          className="h-px w-10 bg-white/14 sm:w-16 md:w-24"
          animate={allowAmbientMotion ? { opacity: [0.22, 0.45, 0.22], scaleX: [1, 1.08, 1] } : undefined}
          transition={{ duration: 2.8, repeat: allowAmbientMotion ? Infinity : 0, ease: "easeInOut" }}
        />
      </div>

      {eyebrow ? (
        <p className="mb-4 font-frick-condensed text-[0.62rem] uppercase tracking-[0.28em] text-white/42 sm:mb-5 sm:text-[0.72rem] sm:tracking-[0.42em]">
          {eyebrow}
        </p>
      ) : null}

      <div className="relative inline-block">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-4 top-[24%] h-[42%] bg-[linear-gradient(90deg,transparent_0%,rgba(29,79,145,0.14)_24%,rgba(70,181,255,0.18)_48%,rgba(229,59,53,0.14)_72%,transparent_100%)] blur-2xl sm:-inset-x-6"
          animate={allowAmbientMotion ? { x: ["-8%", "8%", "-8%"], opacity: [0.2, 0.48, 0.2] } : undefined}
          transition={{ duration: 5.4, repeat: allowAmbientMotion ? Infinity : 0, ease: "easeInOut" }}
        />

        <motion.span
          initial={{ opacity: 0, x: -18 }}
          whileInView={{ opacity: 0.5, x: 0 }}
          animate={allowAmbientMotion ? { x: [8, 12, 8], y: [4, 1, 4], opacity: [0.24, 0.44, 0.24] } : undefined}
          viewport={{ once: true, amount: 0.45 }}
          transition={{
            duration: prefersReducedMotion || isCompactViewport ? 0.9 : 4.6,
            repeat: allowAmbientMotion ? Infinity : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`pointer-events-none absolute inset-0 translate-x-2 translate-y-1 text-[#1d4f91] blur-[0.6px] ${titleClass}`}
          aria-hidden="true"
        >
          {singleLine ? title : (
            <>
              {titleTop}
              <br />
              {titleBottom}
            </>
          )}
        </motion.span>

        <motion.span
          initial={{ opacity: 0, x: 18 }}
          whileInView={{ opacity: 0.32, x: 0 }}
          animate={allowAmbientMotion ? { x: [-8, -12, -8], y: [2, 5, 2], opacity: [0.16, 0.3, 0.16] } : undefined}
          viewport={{ once: true, amount: 0.45 }}
          transition={{
            duration: prefersReducedMotion || isCompactViewport ? 0.9 : 4.2,
            delay: 0.06,
            repeat: allowAmbientMotion ? Infinity : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`pointer-events-none absolute inset-0 -translate-x-2 translate-y-[2px] text-[#e53b35] blur-[0.8px] ${titleClass}`}
          aria-hidden="true"
        >
          {singleLine ? title : (
            <>
              {titleTop}
              <br />
              {titleBottom}
            </>
          )}
        </motion.span>

        <div className="relative overflow-hidden">
          {singleLine ? (
            <motion.h2
              className={`relative text-white ${titleClass}`}
              animate={allowAmbientMotion ? { y: [0, -1, 0] } : undefined}
              transition={{ duration: 4.2, repeat: allowAmbientMotion ? Infinity : 0, ease: "easeInOut" }}
            >
              {title}
            </motion.h2>
          ) : (
            <motion.h2
              className={`relative text-[#eef3f8] ${titleClass}`}
              animate={allowAmbientMotion ? { y: [0, -1, 0] } : undefined}
              transition={{ duration: 4.2, repeat: allowAmbientMotion ? Infinity : 0, ease: "easeInOut" }}
            >
              <span className="block text-white">{titleTop}</span>
              <span className="block text-[#aebdcb]">{titleBottom}</span>
            </motion.h2>
          )}

          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-[12%] -left-16 w-12 -skew-x-[24deg] bg-white/24 blur-xl mix-blend-screen"
            animate={allowAmbientMotion ? { x: ["0%", "380%"] } : undefined}
            whileInView={isCompactViewport && !prefersReducedMotion ? { x: ["0%", "380%"] } : undefined}
            viewport={{ once: true, amount: 0.45 }}
            transition={{
              duration: isCompactViewport && !prefersReducedMotion ? 1.4 : 2.6,
              repeat: allowAmbientMotion ? Infinity : 0,
              repeatDelay: allowAmbientMotion ? 1.4 : 0,
              ease: [0.32, 0.72, 0, 1],
            }}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, amount: 0.45 }}
        animate={allowAmbientMotion ? { opacity: [0.72, 1, 0.72] } : undefined}
        transition={{
          duration: prefersReducedMotion ? 0.8 : 2.4,
          delay: 0.15,
          repeat: allowAmbientMotion ? Infinity : 0,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`relative mt-5 h-px w-[min(48vw,16rem)] overflow-hidden bg-gradient-to-r from-[#1d4f91] via-[#46b5ff] to-[#e53b35] sm:mt-6 sm:w-[min(42vw,20rem)] ${
          isRight ? "origin-right" : "origin-left"
        }`}
      >
        <motion.span
          aria-hidden="true"
          className="absolute inset-y-0 -left-10 w-12 bg-white/45 blur-md"
          animate={allowAmbientMotion ? { x: ["0%", "520%"] } : undefined}
          whileInView={isCompactViewport && !prefersReducedMotion ? { x: ["0%", "520%"] } : undefined}
          viewport={{ once: true, amount: 0.45 }}
          transition={{
            duration: isCompactViewport && !prefersReducedMotion ? 1.5 : 2.8,
            repeat: allowAmbientMotion ? Infinity : 0,
            repeatDelay: allowAmbientMotion ? 1.1 : 0,
            ease: [0.32, 0.72, 0, 1],
          }}
        />
      </motion.div>
    </motion.div>
  );
}
