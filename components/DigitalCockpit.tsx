"use client";

import { motion } from "framer-motion";
import AdaptiveMediaAsset from "@/components/AdaptiveMediaAsset";
import SectionHeading from "@/components/SectionHeading";
import { cockpitShowcaseMedia, type BmwMediaAsset } from "@/lib/bmwMedia";

function CockpitFrame({
  item,
  index,
  sizes,
  variant = "support",
  desktopMinHeightClassName,
}: {
  item: BmwMediaAsset;
  index: number;
  sizes: string;
  variant?: "hero" | "support";
  desktopMinHeightClassName?: string;
}) {
  const isHero = variant === "hero";

  return (
    <motion.article
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.32 }}
      transition={{ delay: index * 0.12, duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-full flex-col border border-white/8 bg-[linear-gradient(180deg,rgba(16,21,29,0.72),rgba(5,7,10,0.92))]"
    >
      <div
        className={`relative overflow-hidden border-b border-white/8 ${
          isHero
            ? `aspect-[4/3] min-h-[25rem] ${desktopMinHeightClassName ?? ""}`
            : `aspect-[16/10] min-h-[14.25rem] ${desktopMinHeightClassName ?? ""}`
        }`}
      >
        <AdaptiveMediaAsset
          asset={item}
          sizes={sizes}
          imageClassName="object-cover"
          videoClassName="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,5,0.1),rgba(2,3,5,0.18)_42%,rgba(2,3,5,0.82)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-[#46b5ff]/30 shadow-[0_0_14px_rgba(70,181,255,0.22)]" />
        <div className="absolute left-0 top-0 h-full w-px bg-white/8" />
        <div className="absolute right-0 top-0 h-full w-px bg-white/8" />
      </div>

      {isHero ? (
        <div className="flex flex-1 flex-col px-5 py-5 sm:px-6 lg:px-7">
          <div className="grid gap-5 border-t border-white/8 pt-5 lg:grid-cols-[minmax(0,1.12fr)_minmax(15rem,0.72fr)] lg:items-end lg:gap-6">
            <div className="space-y-3">
              <p className="font-frick-condensed text-[0.62rem] uppercase tracking-[0.28em] text-[#46b5ff]">
                {item.mediaLabel ?? "BMW video"}
              </p>
              <h3 className="max-w-[12ch] text-balance font-frick text-[1.7rem] uppercase leading-[0.92] tracking-tight text-white sm:text-[2.2rem] lg:text-[2.55rem]">
                {item.title}
              </h3>
            </div>

            <div className="border-t border-white/8 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <p className="max-w-[24rem] font-satoshi text-sm leading-relaxed text-white/60">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-4 px-5 py-5 sm:px-6">
          <div>
            <p className="font-frick-condensed text-[0.62rem] uppercase tracking-[0.28em] text-[#46b5ff]">
              {item.mediaLabel ?? "BMW video"}
            </p>
            <h3 className="mt-3 max-w-[15ch] font-frick text-[1.1rem] uppercase leading-[0.96] tracking-tight text-white sm:text-[1.3rem]">
              {item.title}
            </h3>
          </div>

          <div className="mt-auto border-t border-white/8 pt-4">
            <p className="max-w-[24rem] font-satoshi text-sm leading-relaxed text-white/56">{item.description}</p>
          </div>
        </div>
      )}
    </motion.article>
  );
}

export default function DigitalCockpit() {
  const [heroItem, topSupportItem, bottomSupportItem] = [
    cockpitShowcaseMedia.hero,
    ...cockpitShowcaseMedia.stack,
  ] as [BmwMediaAsset, BmwMediaAsset, BmwMediaAsset];

  return (
    <section id="story" className="relative z-0 min-h-screen bg-black py-32">
      <div className="section-shell">
        <div className="mb-16 max-w-4xl">
          <SectionHeading
            eyebrow="DIGITAL"
            titleTop="COCKPIT"
            titleBottom="INTELLIGENCE"
            singleLine
          />
          <p className="mt-8 max-w-[42rem] font-satoshi text-sm leading-relaxed text-white/56 sm:text-base">
            Every interface surface is arranged like instrumentation, not a content grid. The primary setup view leads, while the secondary modules stay compact and technical.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(30rem,0.8fr)] lg:items-start lg:gap-[1.3rem]">
          <CockpitFrame
            item={heroItem}
            index={0}
            variant="hero"
            sizes="(min-width: 1024px) 64vw, 100vw"
            desktopMinHeightClassName="lg:min-h-[28rem]"
          />

          <div className="grid grid-cols-1 gap-6 lg:w-full lg:gap-[0.5rem]">
            <CockpitFrame
              item={topSupportItem}
              index={1}
              sizes="(min-width: 1024px) 38vw, 100vw"
              desktopMinHeightClassName="lg:min-h-[12rem]"
            />
            <CockpitFrame
              item={bottomSupportItem}
              index={2}
              sizes="(min-width: 1024px) 38vw, 100vw"
              desktopMinHeightClassName="lg:min-h-[12rem]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
