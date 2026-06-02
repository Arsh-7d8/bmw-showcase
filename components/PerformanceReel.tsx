"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const mediaItems = [
  {
    src: "https://www.bmw-m.com/content/dam/bmw/marketBMW_M/www_bmw-m_com/fastlane/motorsport/M3-Touring-24H/bmw-m3-touring-24h-shell-01-16x9.jpg",
    title: "24H ENDURANCE",
    subtitle: "Built for the Nürburgring"
  },
  {
    src: "https://www.bmw-m.com/content/dam/bmw/marketBMW_M/www_bmw-m_com/topics/magazine-article-pool/2026/m-performance-track-kit-bmw-m2/bmw-m2-m-performance-track-kit-03-16x9.jpg",
    title: "TRACK KIT",
    subtitle: "Precision Engineering"
  },
  {
    src: "https://www.bmw-m.com/content/dam/bmw/marketBMW_M/www_bmw-m_com/topics/magazine-article-pool/2026/m-neue-klasse-technology/bmw-m-neue-klasse-za0-technology-05-16x9.jpg",
    title: "NEUE KLASSE",
    subtitle: "The Future of M"
  },
  {
    src: "https://www.bmw-m.com/content/dam/bmw/marketBMW_M/www_bmw-m_com/fastlane/motorsport/m2-racing/bmw-m2-racing-01b-16x9.jpg",
    title: "M2 RACING",
    subtitle: "Pure Motorsport DNA"
  }
];

export default function PerformanceReel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section ref={containerRef} id="performance" className="relative z-0 min-h-screen bg-black py-32 overflow-hidden">
      <div className="section-shell">
        <div className="mb-24">
          <h2 className="font-frick text-[clamp(3.5rem,8vw,8rem)] uppercase leading-none tracking-tight text-white">
            HIGH-SPEED<br />
            <span className="text-white/40">PERFORMANCE REEL</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {mediaItems.map((item, index) => (
            <motion.div
              key={index}
              style={{ y: index % 2 === 0 ? y1 : y2 }}
              className="group relative aspect-video overflow-hidden border border-white/10 bg-white/5"
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 grayscale group-hover:grayscale-0 brightness-75 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute bottom-8 left-8 transform translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="font-frick-condensed text-[0.7rem] uppercase tracking-[0.4em] text-[#00a0e9] mb-2">
                  {item.subtitle}
                </p>
                <h3 className="font-frick text-2xl uppercase text-white">
                  {item.title}
                </h3>
              </div>
              {/* Corner Accents */}
              <div className="absolute top-0 right-0 h-8 w-8 border-t border-r border-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 h-8 w-8 border-b border-l border-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Background Decorative Text */}
      <div className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 select-none vertical-text opacity-[0.03]">
        <span className="font-frick text-[20rem] uppercase text-white">PRECISION</span>
      </div>
    </section>
  );
}
