"use client";

import dynamic from "next/dynamic";
import { useScroll } from "framer-motion";
import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SectionGate from "@/components/SectionGate";
import CreativeScrollProgress from "@/components/CreativeScrollProgress";
import Footer from "@/components/Footer";
import GarageAssetPreloader from "@/components/GarageAssetPreloader";
import { useMediaQuery } from "@/lib/useMediaQuery";

const DeferredPerformanceReel = dynamic(() => import("@/components/PerformanceReel"), {
  ssr: false,
});
const DeferredDigitalCockpit = dynamic(() => import("@/components/DigitalCockpit"), {
  ssr: false,
});
const DeferredMCarShowcase = dynamic(() => import("@/components/MCarShowcase"), {
  ssr: false,
});
const DeferredMobileMSeriesShowcase = dynamic(() => import("@/components/MobileMSeriesShowcase"), {
  ssr: false,
});

export default function Home() {
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const isCompactDevice = useMediaQuery("(max-width: 1023px)");
  const sectionRootMargin = isCompactDevice ? "320px 0px" : "1200px 0px";
  const garageRootMargin = isCompactDevice ? "220px 0px" : "1400px 0px";

  const { scrollYProgress } = useScroll({
    target: heroSectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#020305] text-[#e8edf2]">
      {!isCompactDevice ? (
        <div className="film-grain pointer-events-none fixed inset-0 z-10 opacity-[0.03]" />
      ) : null}

      <GarageAssetPreloader />
      <CreativeScrollProgress />
      <Navbar scrollYProgress={scrollYProgress} />

      <Hero ref={heroSectionRef} scrollYProgress={scrollYProgress} />

      <div className="relative z-0">
        <SectionGate
          rootMargin={sectionRootMargin}
          minHeightClassName="min-h-screen"
          placeholderClassName="min-h-screen bg-black"
        >
          <DeferredPerformanceReel />
        </SectionGate>

        <SectionGate
          rootMargin={sectionRootMargin}
          minHeightClassName="min-h-screen"
          placeholderClassName="min-h-screen bg-black"
        >
          <DeferredDigitalCockpit />
        </SectionGate>

        <SectionGate
          rootMargin={garageRootMargin}
          minHeightClassName={isCompactDevice ? "min-h-[44rem]" : "min-h-[56rem]"}
          placeholderClassName="min-h-[44rem] bg-[linear-gradient(180deg,#000000_0%,#040506_42%,#000000_100%)]"
        >
          {isCompactDevice ? <DeferredMobileMSeriesShowcase /> : <DeferredMCarShowcase />}
        </SectionGate>
        <Footer />
      </div>
    </main>
  );
}
