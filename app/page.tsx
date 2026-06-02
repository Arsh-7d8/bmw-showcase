"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PerformanceReel from "@/components/PerformanceReel";
import ModelViewer from "@/components/ModelViewer";
import DigitalCockpit from "@/components/DigitalCockpit";

export default function Home() {
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroSectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#020305] text-[#e8edf2]">
      <div className="film-grain pointer-events-none fixed inset-0 z-10 opacity-[0.03]" />

      <CreativeScrollProgress />
      <Navbar scrollYProgress={scrollYProgress} />

      <Hero ref={heroSectionRef} scrollYProgress={scrollYProgress} />

      <div className="relative z-0">
        <PerformanceReel />
        <ModelViewer />
        <DigitalCockpit />
      </div>
    </main>
  );
}
