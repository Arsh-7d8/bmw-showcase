"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import AdaptiveMediaAsset from "@/components/AdaptiveMediaAsset";
import SectionHeading from "@/components/SectionHeading";
import { performanceReelMedia } from "@/lib/bmwMedia";
import { usePerformanceMode } from "@/lib/usePerformanceMode";

export default function PerformanceReel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { isLowPower } = usePerformanceMode();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.35 });
  const y1 = useTransform(smoothProgress, [0, 1], [54, -72]);
  const y2 = useTransform(smoothProgress, [0, 1], [-18, 66]);
  const sectionScale = useTransform(smoothProgress, [0.08, 0.42, 0.9], [0.97, 1, 0.985]);
  const sectionOpacity = useTransform(smoothProgress, [0, 0.16, 0.92, 1], [0.68, 1, 1, 0.82]);
  const railX = useTransform(smoothProgress, [0, 1], ["-14%", "14%"]);
  const precisionY = useTransform(smoothProgress, [0, 1], ["-42%", "-58%"]);
  const allowAmbientFrameMotion = !prefersReducedMotion && !isLowPower;

  return (
    <section ref={containerRef} id="performance" className="relative z-0 min-h-screen overflow-hidden bg-black py-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          aria-hidden="true"
          style={{ x: railX }}
          animate={
            allowAmbientFrameMotion
              ? {
                  opacity: [0.18, 0.34, 0.2],
                  scaleY: [0.92, 1.05, 0.96],
                }
              : undefined
          }
          transition={{
            duration: 12,
            repeat: allowAmbientFrameMotion ? Infinity : 0,
            ease: "easeInOut",
          }}
          className="absolute left-[-18%] top-[18%] h-[34rem] w-[62%] -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(0,160,233,0.14),rgba(255,255,255,0.05),transparent)] blur-3xl"
        />
        <motion.div
          aria-hidden="true"
          animate={
            allowAmbientFrameMotion
              ? {
                  x: ["8%", "-6%", "5%"],
                  opacity: [0.1, 0.2, 0.12],
                }
              : undefined
          }
          transition={{
            duration: 15,
            repeat: allowAmbientFrameMotion ? Infinity : 0,
            ease: "easeInOut",
          }}
          className="absolute right-[-12%] top-[38%] h-[22rem] w-[70%] skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(177,31,42,0.1),rgba(255,255,255,0.045),transparent)] blur-3xl"
        />
        <motion.div
          aria-hidden="true"
          animate={
            allowAmbientFrameMotion
              ? {
                  backgroundPosition: ["0% 0%", "100% 100%"],
                  opacity: [0.12, 0.2, 0.12],
                }
              : undefined
          }
          transition={{
            duration: 18,
            repeat: allowAmbientFrameMotion ? Infinity : 0,
            ease: "linear",
          }}
          className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:96px_96px] opacity-10"
        />
      </div>

      <div className="section-shell">
        <div className="mb-24 flex justify-start lg:justify-end">
          <SectionHeading
            eyebrow="HIGH-SPEED"
            titleTop="PERFORMANCE"
            titleBottom="REEL"
            align="right"
            singleLine
          />
        </div>

        <motion.div
          style={{ scale: sectionScale, opacity: sectionOpacity }}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <motion.div
            aria-hidden="true"
            animate={
              allowAmbientFrameMotion
                ? {
                    opacity: [0.42, 0.88, 0.42],
                    scaleX: [0.92, 1, 0.94],
                  }
                : undefined
            }
            transition={{
              duration: 4.8,
              repeat: allowAmbientFrameMotion ? Infinity : 0,
              ease: "easeInOut",
            }}
            className="mb-8 h-px origin-center bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),rgba(0,160,233,0.82),rgba(235,36,39,0.82),rgba(255,255,255,0.12),transparent)] md:mb-10"
          />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            {performanceReelMedia.map((item, index) => (
              <motion.article
                key={index}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 44, scale: 0.97 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{
                  duration: 0.82,
                  delay: prefersReducedMotion ? 0 : index * 0.11,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ y: index % 2 === 0 ? y1 : y2 }}
                className="group relative aspect-video overflow-hidden border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
              >
                <motion.span
                  aria-hidden="true"
                  animate={
                    allowAmbientFrameMotion
                      ? {
                          x: ["-18%", "18%", "-12%"],
                          opacity: [0.08, 0.22, 0.1],
                        }
                      : undefined
                  }
                  transition={{
                    duration: index % 2 === 0 ? 8.5 : 9.4,
                    repeat: allowAmbientFrameMotion ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                  className="pointer-events-none absolute inset-x-[-20%] top-0 z-10 h-24 bg-[linear-gradient(90deg,transparent,rgba(70,181,255,0.18),rgba(255,255,255,0.08),transparent)] blur-2xl"
                />
                <motion.div
                  aria-hidden="true"
                  animate={
                    allowAmbientFrameMotion
                      ? {
                          opacity: [0.12, 0.26, 0.12],
                        }
                      : undefined
                  }
                  transition={{
                    duration: index % 2 === 0 ? 4.8 : 5.4,
                    repeat: allowAmbientFrameMotion ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                  className="pointer-events-none absolute inset-0 border border-[#46b5ff]/0 group-hover:border-[#46b5ff]/28"
                />
                <motion.div
                  animate={
                    allowAmbientFrameMotion
                      ? {
                          y: [0, index % 2 === 0 ? -16 : 14, 0],
                          scale: [1.015, 1.045, 1.015],
                          rotate: [0, index % 2 === 0 ? -0.35 : 0.35, 0],
                        }
                      : undefined
                  }
                  transition={{
                    duration: index % 2 === 0 ? 10.5 : 12,
                    repeat: allowAmbientFrameMotion ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                  className="relative h-full w-full will-change-transform"
                >
                  <AdaptiveMediaAsset
                    asset={item}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    imageClassName="object-cover brightness-75 grayscale transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-100 group-hover:grayscale-0"
                    videoClassName="h-full w-full object-cover brightness-[0.82] transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-100"
                  />
                </motion.div>
                <motion.span
                  aria-hidden="true"
                  animate={
                    allowAmbientFrameMotion
                      ? {
                          x: ["-140%", "180%"],
                          opacity: [0, 0.42, 0],
                        }
                      : undefined
                  }
                  transition={{
                    duration: index % 2 === 0 ? 5.8 : 6.8,
                    repeat: allowAmbientFrameMotion ? Infinity : 0,
                    repeatDelay: allowAmbientFrameMotion ? (index % 2 === 0 ? 1.2 : 1.8) : 0,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                  className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/12 to-transparent opacity-75 transition-opacity duration-500 group-hover:opacity-100" />
                <motion.div
                  animate={
                    allowAmbientFrameMotion
                      ? {
                          y: [0, -7, 0],
                        }
                      : undefined
                  }
                  transition={{
                    duration: index % 2 === 0 ? 5.6 : 6.3,
                    repeat: allowAmbientFrameMotion ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                  className="absolute bottom-8 left-8 transition-transform duration-500 group-hover:-translate-y-1"
                >
                  <p className="mb-2 font-frick-condensed text-[0.7rem] uppercase tracking-[0.4em] text-[#00a0e9]">
                    {item.subtitle}
                  </p>
                  <h3 className="font-frick text-2xl uppercase text-white">{item.title}</h3>
                </motion.div>
                <motion.span
                  aria-hidden="true"
                  animate={
                    allowAmbientFrameMotion
                      ? {
                          opacity: [0.18, 0.44, 0.18],
                        }
                      : undefined
                  }
                  transition={{
                    duration: index % 2 === 0 ? 4.8 : 5.6,
                    repeat: allowAmbientFrameMotion ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/30"
                />
                <div className="absolute right-0 top-0 h-8 w-8 border-r border-t border-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 h-8 w-8 border-b border-l border-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        style={{ y: precisionY }}
        className="pointer-events-none absolute -right-20 top-1/2 hidden select-none vertical-text opacity-[0.03] lg:block"
      >
        <span className="font-frick text-[20rem] uppercase text-white">PRECISION</span>
      </motion.div>
    </section>
  );
}
