"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import { mSeriesGalleryMedia } from "@/lib/bmwMedia";

export default function MobileMSeriesShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeModel = mSeriesGalleryMedia[activeIndex];

  const selectModel = (nextIndex: number) => {
    setActiveIndex((nextIndex + mSeriesGalleryMedia.length) % mSeriesGalleryMedia.length);
  };

  return (
    <section
      id="m-cars"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#000000_0%,#040506_42%,#000000_100%)] py-20 text-white"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_16%_0%,rgba(0,102,177,0.14),transparent_34%),radial-gradient(circle_at_88%_10%,rgba(177,31,42,0.1),transparent_30%)]" />
      <div className="section-shell relative">
        <div className="mb-8 flex flex-col gap-5 sm:mb-10">
          <SectionHeading
            eyebrow="BMW M SERIES"
            titleTop="M SERIES"
            titleBottom="SELECTION"
            singleLine
          />
          <div className="max-w-[36ch]">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-[4px] w-7 -skew-x-[28deg] bg-[#1d4f91]" />
              <span className="h-[4px] w-4 -skew-x-[28deg] bg-[#46b5ff]" />
              <span className="h-[4px] w-7 -skew-x-[28deg] bg-[#e53b35]" />
            </div>
            <p className="font-frick-condensed text-[0.64rem] uppercase tracking-[0.22em] text-[#46b5ff]">
              Mobile keeps the garage lighter: official BMW M imagery, quick switching, no desktop 3D overhead.
            </p>
          </div>
        </div>

        <div className="overflow-hidden border border-white/10 bg-black/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="relative aspect-[16/10] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModel.title}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={activeModel.src}
                  alt={activeModel.title}
                  fill
                  priority={activeIndex === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.12)_42%,rgba(0,0,0,0.82)_100%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-[#46b5ff]/40 shadow-[0_0_14px_rgba(70,181,255,0.42)]" />

            <div className="absolute inset-x-0 bottom-0 p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeModel.title}-caption`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-frick-condensed text-[0.62rem] uppercase tracking-[0.28em] text-[#46b5ff]">
                    {activeModel.subtitle}
                  </p>
                  <h3 className="mt-2 font-frick text-[2rem] uppercase leading-[0.92] tracking-[-0.03em] text-white">
                    {activeModel.title}
                  </h3>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-5 p-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={`${activeModel.title}-description`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-[34ch] text-sm leading-relaxed text-white/64"
              >
                {activeModel.description}
              </motion.p>
            </AnimatePresence>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                aria-label="Previous M series image"
                onClick={() => selectModel(activeIndex - 1)}
                className="flex h-11 w-11 items-center justify-center border border-white/12 bg-white/[0.03] text-white transition-colors hover:bg-white hover:text-black active:scale-[0.98]"
              >
                <ChevronLeft size={18} strokeWidth={1.6} />
              </button>

              <p className="font-frick-condensed text-[0.62rem] uppercase tracking-[0.28em] text-white/46">
                Frame {String(activeIndex + 1).padStart(2, "0")} / {String(mSeriesGalleryMedia.length).padStart(2, "0")}
              </p>

              <button
                type="button"
                aria-label="Next M series image"
                onClick={() => selectModel(activeIndex + 1)}
                className="flex h-11 w-11 items-center justify-center border border-white/12 bg-white/[0.03] text-white transition-colors hover:bg-white hover:text-black active:scale-[0.98]"
              >
                <ChevronRight size={18} strokeWidth={1.6} />
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {mSeriesGalleryMedia.map((item, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`shrink-0 border px-3 py-2 text-left transition-colors ${
                      isActive
                        ? "border-[#46b5ff] bg-[#46b5ff]/12 text-white"
                        : "border-white/10 bg-white/[0.03] text-white/56"
                    }`}
                  >
                    <p className="font-frick-condensed text-[0.58rem] uppercase tracking-[0.24em] text-[#46b5ff]">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-1 font-satoshi text-xs font-black uppercase tracking-[0.04em]">
                      {item.title}
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
