"use client";

import { motion } from "framer-motion";
import AdaptiveMediaAsset from "@/components/AdaptiveMediaAsset";
import SectionHeading from "@/components/SectionHeading";
import { cockpitShowcaseMedia, type BmwMediaAsset } from "@/lib/bmwMedia";

function MediaPanel({
  item,
  index,
  sizes,
}: {
  item: BmwMediaAsset;
  index: number;
  sizes: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ delay: index * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col"
    >
      <div className="relative aspect-[9/16] overflow-hidden border border-white/5 bg-white/2 grayscale transition-all duration-700 group-hover:border-white/20 group-hover:grayscale-0">
        <AdaptiveMediaAsset
          asset={item}
          sizes={sizes}
          imageClassName="object-cover transition-transform duration-1000 group-hover:scale-105"
          videoClassName="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
        <div className="absolute inset-x-0 top-0 h-px bg-[#00a0e9]/40 shadow-[0_0_15px_#00a0e9] group-hover:animate-scan" />
      </div>
      <div className="mt-8">
        <h3 className="mb-4 font-frick text-2xl uppercase tracking-tight text-white">{item.title}</h3>
        <p className="max-w-[280px] font-satoshi text-sm leading-relaxed text-white/50">{item.description}</p>
      </div>
    </motion.article>
  );
}

export default function DigitalCockpit() {
  const allItems = [cockpitShowcaseMedia.hero, ...cockpitShowcaseMedia.stack];

  return (
    <section id="story" className="relative z-0 min-h-screen bg-black py-32">
      <div className="section-shell">
        <div className="mb-24 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <SectionHeading
              eyebrow="DIGITAL"
              titleTop="COCKPIT"
              titleBottom="INTELLIGENCE"
              singleLine
            />
          </div>
          <div className="max-w-xs">
            <p className="border-l border-[#00a0e9] py-2 pl-6 font-frick-condensed text-xs uppercase tracking-[0.3em] text-[#00a0e9]">
              The intersection of physical performance and digital intelligence.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {allItems.map((item, index) => (
            <MediaPanel
              key={item.title}
              item={item}
              index={index}
              sizes="(min-width: 768px) 33vw, 100vw"
            />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </section>
  );
}
