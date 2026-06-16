"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function VideoShowcase() {
  const containerRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.55], [1.08, 1]);
  const heroY = useTransform(scrollYProgress, [0, 1], [40, -30]);
  const interiorY = useTransform(scrollYProgress, [0, 1], [65, -45]);

  return (
    <section id="reel" ref={containerRef} className="relative px-5 py-10 md:px-8 md:py-16">
      <div className="section-shell space-y-6">
        <motion.div
          style={{ scale: heroScale, y: heroY }}
          className="double-bezel min-h-[26rem] md:min-h-[38rem]"
        >
          <div className="media-frame h-full w-full">
            <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover">
              <source src="/m4-feature.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,5,0.14)_0%,rgba(2,3,5,0.42)_45%,rgba(2,3,5,0.86)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.16),transparent_20%),linear-gradient(120deg,transparent_35%,rgba(0,0,0,0.42)_100%)]" />

            <div className="relative flex min-h-[26rem] flex-col justify-between p-6 md:min-h-[38rem] md:p-10 lg:p-12">
              <div className="flex items-start justify-between gap-6">
                <span className="eyebrow">Motion reel</span>
                <p className="hidden max-w-xs text-right text-[10px] font-black uppercase tracking-[0.5em] text-white/34 md:block">
                  low camera
                  <span className="block mt-2 text-white/28">hard reflections</span>
                </p>
              </div>

              <div className="max-w-[54rem]">
                <h2 className="text-[3.2rem] leading-[0.86] text-white md:text-[5rem] lg:text-[6.8rem]">
                  Surface.
                  <span className="block text-outline italic">Velocity.</span>
                  <span className="block">Controlled glare.</span>
                </h2>
                <p className="mt-6 max-w-2xl text-base leading-7 text-white/62 md:text-lg md:leading-8">
                  One wide shot should do most of the work. The page does not need boxes around the image when the
                  framing, grading, and type are already carrying the tension.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.div
            style={{ y: interiorY }}
            className="double-bezel min-h-[24rem] md:min-h-[34rem]"
          >
            <div className="media-frame h-full w-full">
              <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover">
                <source src="/m4-interior.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,5,0.18)_0%,rgba(2,3,5,0.78)_100%)]" />
              <div className="relative flex min-h-[24rem] flex-col justify-end p-6 md:min-h-[34rem] md:p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.52em] text-white/34">Cabin tension</p>
                <p className="mt-4 max-w-sm text-[2.4rem] font-black uppercase leading-[0.92] text-white md:text-[3.6rem]">
                  Dark cockpit.
                  <span className="block text-outline italic">Driver-first framing.</span>
                </p>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col justify-between gap-10 py-4 md:py-8">
            <div>
              <span className="eyebrow">Reel logic</span>
              <h3 className="mt-6 max-w-3xl text-[2.8rem] leading-[0.9] text-white md:text-[4.8rem] font-satoshi font-black">
                Closer to an
                <span className="block text-outline italic font-medium opacity-90">opening sequence</span>
                than a gallery.
              </h3>
            </div>

            <div className="chapter-line grid gap-8 pt-6 md:grid-cols-2">
              {[
                [
                  "Camera logic",
                  "Low horizon lines, tight body crops, and no decorative clutter competing with the sheet metal.",
                ],
                [
                  "Why it lands",
                  "The videos are treated as chapters in the story, not feature cards with extra furniture around them.",
                ],
              ].map(([title, copy]) => (
                <div key={title}>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">{title}</p>
                  <p className="mt-4 text-sm leading-6 text-white/58 md:text-base md:leading-7">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
