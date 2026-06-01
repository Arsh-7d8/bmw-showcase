"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CreativeScrollProgress from "@/components/CreativeScrollProgress";
import StatsSection from "@/components/StatsSection";
import ModelsCatalog from "@/components/ModelsCatalog";
import StorySection from "@/components/StorySection";
import VideoShowcase from "@/components/VideoShowcase";
import FeatureGrid from "@/components/FeatureGrid";
import CustomCursor from "@/components/CustomCursor";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#020305] text-[#e8edf2]">
      <CustomCursor />
      <div className="film-grain pointer-events-none fixed inset-0 z-10 opacity-[0.03]" />

      <CreativeScrollProgress />
      <Navbar />

      <Hero />

      <div className="relative z-0">
        <StorySection />
        <StatsSection />
        <VideoShowcase />
        <ModelsCatalog />
        <FeatureGrid />
      </div>
    </main>
  );
}
