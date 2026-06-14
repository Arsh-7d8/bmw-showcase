"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import AdaptiveMediaAsset from "@/components/AdaptiveMediaAsset";
import SectionHeading from "@/components/SectionHeading";
import { performanceReelMedia } from "@/lib/bmwMedia";

export default function PerformanceReel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section ref={containerRef} id="performance" className="relative z-0 min-h-screen overflow-hidden bg-black py-32">
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

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          {performanceReelMedia.map((item, index) => (
            <motion.article
              key={index}
              style={{ y: index % 2 === 0 ? y1 : y2 }}
              className="group relative aspect-video overflow-hidden border border-white/10 bg-white/5"
            >
              <AdaptiveMediaAsset
                asset={item}
                sizes="(min-width: 768px) 50vw, 100vw"
                playStrategy="hover"
                imageClassName="object-cover brightness-75 grayscale transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-100 group-hover:grayscale-0"
                videoClassName="h-full w-full object-cover brightness-[0.82] transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute bottom-8 left-8 translate-y-4 transform opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="mb-2 font-frick-condensed text-[0.7rem] uppercase tracking-[0.4em] text-[#00a0e9]">
                  {item.subtitle}
                </p>
                <h3 className="font-frick text-2xl uppercase text-white">{item.title}</h3>
              </div>
              <div className="absolute right-0 top-0 h-8 w-8 border-r border-t border-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 h-8 w-8 border-b border-l border-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.article>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute -right-20 top-1/2 hidden -translate-y-1/2 select-none vertical-text opacity-[0.03] lg:block">
        <span className="font-frick text-[20rem] uppercase text-white">PRECISION</span>
      </div>
    </section>
  );
}
