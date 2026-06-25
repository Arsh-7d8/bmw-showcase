"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { startTransition, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import { mSeriesGalleryMedia } from "@/lib/bmwMedia";

const transitionCurve = [0.22, 1, 0.36, 1] as const;

const mobileChapters = [
  {
    discipline: "Endurance line",
    measure: "24H",
    cue: "Long-roof silhouette, race livery, single-scroll reveal.",
    hardware: "Touring shell",
  },
  {
    discipline: "Aero pack",
    measure: "M2",
    cue: "Sharper front plane, tighter crop, faster visual read.",
    hardware: "Track kit",
  },
  {
    discipline: "Electric study",
    measure: "ZA0",
    cue: "Future stance, clean surfaces, lighter mobile payload.",
    hardware: "Neue Klasse",
  },
  {
    discipline: "Customer racing",
    measure: "GT",
    cue: "Factory shell, motorsport geometry, static phone-safe frame.",
    hardware: "M2 Racing",
  },
] as const;

export default function MobileMSeriesShowcase() {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeModel = mSeriesGalleryMedia[activeIndex];
  const activeChapter = mobileChapters[activeIndex];

  const switchChapter = (index: number) => {
    startTransition(() => setActiveIndex(index));
  };

  return (
    <section
      id="m-cars"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#000000_0%,#05070a_44%,#000000_100%)] py-16 text-white sm:py-20 lg:hidden"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(circle_at_18%_0%,rgba(0,102,177,0.18),transparent_34%),radial-gradient(circle_at_92%_12%,rgba(177,31,42,0.12),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(180deg,transparent,rgba(0,102,177,0.08),transparent)]" />

      <div className="section-shell relative [content-visibility:auto] [contain-intrinsic-size:980px]">
        <div className="mb-7 space-y-5">
          <SectionHeading
            eyebrow="BMW M GARAGE"
            titleTop="MOBILE"
            titleBottom="GARAGE"
            singleLine
          />

          <div className="max-w-[38ch] space-y-4">
            <p className="text-[0.96rem] leading-7 text-[#cbd6e2]">
              The phone version keeps the M chapter visual and fast: no live 3D scene, no model payload, just curated BMW frames with a touch-first rhythm.
            </p>
            <div className="flex items-center gap-2" aria-hidden="true">
              <span className="h-[5px] w-10 -skew-x-[28deg] bg-[#1d4f91]" />
              <span className="h-[5px] w-8 -skew-x-[28deg] bg-[#46b5ff]" />
              <span className="h-[5px] w-12 -skew-x-[28deg] bg-[#e53b35]" />
              <span className="h-px flex-1 bg-white/12" />
            </div>
          </div>
        </div>

        <div className="overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.018))] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="overflow-hidden bg-[#020305]">
            <motion.div
              key={activeModel.title}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.18 : 0.48, ease: transitionCurve }}
              className="relative min-h-[34rem]"
            >
              <div className="relative aspect-[3/4] max-h-[66vh] min-h-[28rem] overflow-hidden sm:aspect-[4/3] sm:max-h-none">
                <Image
                  src={activeModel.src}
                  alt={activeModel.title}
                  fill
                  priority={activeIndex === 0}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 0vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06)_0%,rgba(0,0,0,0.18)_42%,rgba(0,0,0,0.92)_100%)]" />
                <div className="absolute inset-y-0 left-0 w-16 bg-[linear-gradient(90deg,rgba(0,0,0,0.72),transparent)]" />

                <div className="absolute left-4 top-4 flex items-center gap-2 border border-white/12 bg-black/50 px-3 py-2 backdrop-blur-sm">
                  <span className="h-2 w-2 bg-[#46b5ff]" />
                  <span className="font-frick-condensed text-[0.58rem] uppercase tracking-[0.24em] text-white/68">
                    2D mobile mode
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                  <p className="font-frick-condensed text-[0.62rem] uppercase tracking-[0.28em] text-[#46b5ff]">
                    {activeChapter.discipline}
                  </p>
                  <h3 className="mt-2 max-w-[11ch] font-frick text-[clamp(2.45rem,14vw,4.5rem)] uppercase leading-[0.88] tracking-[-0.035em] text-white">
                    {activeModel.title}
                  </h3>
                  <p className="mt-4 max-w-[31ch] text-sm leading-6 text-white/72">
                    {activeModel.description}
                  </p>
                </div>
              </div>

              <div className="grid gap-1 border-t border-white/10 bg-black/82 p-3">
                <div className="grid grid-cols-3 gap-1">
                  {[
                    ["Frame", String(activeIndex + 1).padStart(2, "0")],
                    ["Load", "No 3D"],
                    ["Focus", activeChapter.measure],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-white/[0.035] px-3 py-3">
                      <p className="font-frick-condensed text-[0.54rem] uppercase tracking-[0.22em] text-white/38">
                        {label}
                      </p>
                      <p className="mt-2 font-satoshi text-[0.78rem] font-black uppercase tracking-[0.04em] text-white">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-white/[0.035] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-frick-condensed text-[0.58rem] uppercase tracking-[0.24em] text-[#46b5ff]">
                        {activeChapter.hardware}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-white/68">
                        {activeChapter.cue}
                      </p>
                    </div>
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-white/10 bg-black/34 font-frick text-xl text-white">
                      {activeChapter.measure}
                    </div>
                  </div>
                  <div className="mt-4 h-px overflow-hidden bg-white/10">
                    <motion.div
                      key={`${activeModel.title}-progress`}
                      initial={prefersReducedMotion ? false : { scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: prefersReducedMotion ? 0.2 : 0.52, ease: transitionCurve }}
                      className="h-full origin-left bg-[linear-gradient(90deg,#0066b1,#46b5ff,#b11f2a)]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max snap-x gap-3">
            {mSeriesGalleryMedia.map((item, index) => {
              const isActive = index === activeIndex;
              const chapter = mobileChapters[index];

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => switchChapter(index)}
                  aria-pressed={isActive}
                  className={`min-h-24 w-[10.8rem] snap-start border p-2 text-left transition-[border-color,background-color,transform] duration-300 active:scale-[0.98] ${
                    isActive
                      ? "border-[#46b5ff] bg-[linear-gradient(180deg,rgba(70,181,255,0.14),rgba(255,255,255,0.035))] text-white"
                      : "border-white/10 bg-white/[0.035] text-white/58"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-frick-condensed text-[0.56rem] uppercase tracking-[0.24em] text-[#46b5ff]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={`h-2 w-8 -skew-x-[28deg] ${isActive ? "bg-[#46b5ff]" : "bg-white/16"}`} />
                  </div>
                  <p className="font-satoshi text-[0.76rem] font-black uppercase leading-tight tracking-[0.04em]">
                    {item.title}
                  </p>
                  <p className="mt-2 font-frick-condensed text-[0.58rem] uppercase tracking-[0.18em] text-white/42">
                    {chapter.hardware}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
