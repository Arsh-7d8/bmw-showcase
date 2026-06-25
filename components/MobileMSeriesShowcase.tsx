"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import { mSeriesGalleryMedia } from "@/lib/bmwMedia";

const transitionCurve = [0.22, 1, 0.36, 1] as const;

export default function MobileMSeriesShowcase() {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeModel = mSeriesGalleryMedia[activeIndex];

  return (
    <section
      id="m-cars"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#000000_0%,#040506_42%,#000000_100%)] py-20 text-white"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_16%_0%,rgba(0,102,177,0.14),transparent_34%),radial-gradient(circle_at_88%_10%,rgba(177,31,42,0.1),transparent_30%)]" />

      <div className="section-shell relative">
        <div className="mb-8 flex flex-col gap-5">
          <SectionHeading
            eyebrow="BMW M GARAGE"
            titleTop="MOBILE"
            titleBottom="CURATION"
            singleLine
          />

          <div className="max-w-[36ch] space-y-3">
            <div className="flex items-center gap-2">
              <span className="h-[4px] w-8 -skew-x-[28deg] bg-[#1d4f91]" />
              <span className="h-[4px] w-5 -skew-x-[28deg] bg-[#46b5ff]" />
              <span className="h-[4px] w-8 -skew-x-[28deg] bg-[#e53b35]" />
            </div>
            <p className="font-frick-condensed text-[0.64rem] uppercase tracking-[0.24em] text-[#46b5ff]">
              Phone mode drops the live 3D garage completely. The mobile chapter stays visual, fast, and touch-first.
            </p>
          </div>
        </div>

        <div className="overflow-hidden border border-white/10 bg-black/38 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/11]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModel.title}
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
                transition={{ duration: prefersReducedMotion ? 0.18 : 0.42, ease: transitionCurve }}
                className="absolute inset-0"
              >
                <Image
                  src={activeModel.src}
                  alt={activeModel.title}
                  fill
                  priority={activeIndex === 0}
                  sizes="(max-width: 640px) 100vw, 92vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.02)_34%,rgba(0,0,0,0.84)_100%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-[#46b5ff]/42 shadow-[0_0_16px_rgba(70,181,255,0.35)]" />

            <div className="absolute right-4 top-4 border border-white/12 bg-black/42 px-3 py-2 font-frick-condensed text-[0.58rem] uppercase tracking-[0.24em] text-white/54 backdrop-blur-sm">
              Mobile tuned
            </div>

            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeModel.title}-hero-copy`}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                  transition={{ duration: prefersReducedMotion ? 0.18 : 0.34, ease: transitionCurve }}
                >
                  <p className="font-frick-condensed text-[0.62rem] uppercase tracking-[0.28em] text-[#46b5ff]">
                    {activeModel.subtitle}
                  </p>
                  <h3 className="mt-2 max-w-[10ch] font-frick text-[2.15rem] uppercase leading-[0.92] tracking-[-0.03em] text-white">
                    {activeModel.title}
                  </h3>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="grid gap-4 p-4">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeModel.title}-body-copy`}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                  transition={{ duration: prefersReducedMotion ? 0.18 : 0.3, ease: transitionCurve }}
                  className="border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="mb-4 h-px w-16 bg-[linear-gradient(90deg,#0066b1,#46b5ff,#b11f2a)]" />
                  <p className="font-frick-condensed text-[0.58rem] uppercase tracking-[0.24em] text-white/44">
                    Active frame
                  </p>
                  <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-white/68">
                    {activeModel.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="grid grid-cols-3 border border-white/10 bg-black/28">
                {[
                  ["Mode", "2D"],
                  ["Load", "Light"],
                  ["Frame", String(activeIndex + 1).padStart(2, "0")],
                ].map(([label, value]) => (
                  <div key={label} className="border-r border-white/10 p-3 last:border-r-0">
                    <p className="font-frick-condensed text-[0.56rem] uppercase tracking-[0.22em] text-white/38">
                      {label}
                    </p>
                    <p className="mt-2 font-satoshi text-sm font-black uppercase tracking-[0.04em] text-white">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {mSeriesGalleryMedia.map((item, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`border p-3 text-left transition-colors active:scale-[0.99] ${
                      isActive
                        ? "border-[#46b5ff] bg-[linear-gradient(180deg,rgba(70,181,255,0.14),rgba(255,255,255,0.02))] text-white"
                        : "border-white/10 bg-white/[0.03] text-white/58"
                    }`}
                  >
                    <p className="font-frick-condensed text-[0.56rem] uppercase tracking-[0.24em] text-[#46b5ff]">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-2 font-satoshi text-[0.78rem] font-black uppercase leading-tight tracking-[0.04em]">
                      {item.title}
                    </p>
                    <p className="mt-2 font-satoshi text-xs leading-relaxed text-white/48">
                      {item.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
