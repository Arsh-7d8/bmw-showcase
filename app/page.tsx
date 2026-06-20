"use client";

import dynamic from "next/dynamic";
import { useScroll } from "framer-motion";
import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CreativeScrollProgress from "@/components/CreativeScrollProgress";
import PerformanceReel from "@/components/PerformanceReel";
import DigitalCockpit from "@/components/DigitalCockpit";
import Footer from "@/components/Footer";
import { useMediaQuery } from "@/lib/useMediaQuery";

const DeferredMCarShowcase = dynamic(() => import("@/components/MCarShowcase"), {
  ssr: false,
});
const DeferredMobileMSeriesShowcase = dynamic(() => import("@/components/MobileMSeriesShowcase"), {
  ssr: false,
});

export default function Home() {
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const isCompactDevice = useMediaQuery("(max-width: 1023px)");

  const { scrollYProgress } = useScroll({
    target: heroSectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#020305] text-[#e8edf2]">
      {!isCompactDevice ? (
        <div className="film-grain pointer-events-none fixed inset-0 z-10 opacity-[0.03]" />
      ) : null}

      <CreativeScrollProgress />
      <Navbar scrollYProgress={scrollYProgress} />

      <Hero ref={heroSectionRef} scrollYProgress={scrollYProgress} />

      <div className="relative z-0">
        <PerformanceReel />
        <DigitalCockpit />
        {isCompactDevice ? <DeferredMobileMSeriesShowcase /> : <DeferredMCarShowcase />}
        <Footer />
      </div>
    </main>
  );
}
