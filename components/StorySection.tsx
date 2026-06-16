"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function StorySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const storyOneOpacity = useTransform(scrollYProgress, [0, 0.08, 0.26, 0.38], [0.25, 1, 1, 0.18]);
  const storyOneY = useTransform(scrollYProgress, [0, 0.2, 0.38], [28, 0, -18]);
  const storyTwoOpacity = useTransform(scrollYProgress, [0.24, 0.38, 0.6, 0.74], [0.18, 1, 1, 0.18]);
  const storyTwoY = useTransform(scrollYProgress, [0.24, 0.46, 0.74], [28, 0, -18]);
  const storyThreeOpacity = useTransform(scrollYProgress, [0.58, 0.74, 1], [0.18, 1, 1]);
  const storyThreeY = useTransform(scrollYProgress, [0.58, 0.8, 1], [28, 0, -12]);

  const mediaOneOpacity = useTransform(scrollYProgress, [0, 0.22, 0.34], [1, 1, 0]);
  const mediaTwoOpacity = useTransform(scrollYProgress, [0.24, 0.42, 0.6, 0.74], [0, 1, 1, 0]);
  const mediaThreeOpacity = useTransform(scrollYProgress, [0.62, 0.8, 1], [0, 1, 1]);

  const mediaOneScale = useTransform(scrollYProgress, [0, 0.34], [1, 1.03]);
  const mediaTwoScale = useTransform(scrollYProgress, [0.24, 0.74], [1.04, 1]);
  const mediaThreeScale = useTransform(scrollYProgress, [0.62, 1], [1.05, 1]);

  return (
    <section id="story" ref={sectionRef} className="relative min-h-[260dvh] px-5 md:px-8">
      <div className="sticky top-0 flex min-h-[100dvh] items-center overflow-hidden py-20 md:py-24">
        <div className="section-shell grid gap-12 lg:grid-cols-[0.42fr_0.58fr] lg:items-center">
          <div className="relative flex min-h-[70dvh] flex-col justify-between">
            <div className="max-w-lg">
              <span className="eyebrow">Story chapter</span>
              <h2 className="mt-6 text-[3rem] leading-[0.88] text-white md:text-[4.8rem] font-satoshi font-black tracking-tight">
                Scroll becomes
                <span className="block text-outline italic font-medium opacity-90">the transition system.</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-7 text-white/62 md:text-lg md:leading-8">
                The second chapter is a guided sequence. As the page moves, the scene, the crop,
                and the message all hand off cleanly from one beat to the next.
              </p>
            </div>

            <div className="relative pl-6">
              <div className="absolute left-0 top-0 h-full w-px bg-white/10">
                <motion.div
                  className="absolute left-0 top-0 w-full origin-top bg-[linear-gradient(180deg,#ffffff_0%,#8dc9ff_48%,#0066b1_100%)]"
                  style={{ scaleY: railScale, height: "100%" }}
                />
              </div>

              <div className="space-y-8">
                <motion.div style={{ opacity: storyOneOpacity, y: storyOneY }}>
                  <p className="text-[10px] font-black uppercase tracking-[0.52em] text-white/30">01 / Arrival</p>
                  <p className="mt-3 text-[1.65rem] font-black uppercase leading-[0.94] text-white md:text-[2.4rem] font-satoshi">
                    Start with quiet
                    <span className="block text-outline italic">before the pressure.</span>
                  </p>
                  <p className="mt-4 max-w-md text-sm leading-6 text-white/56 md:text-base md:leading-7">
                    The first frame should feel open and controlled. Minimal copy. Strong silhouette. Immediate tone.
                  </p>
                </motion.div>

                <motion.div style={{ opacity: storyTwoOpacity, y: storyTwoY }}>
                  <p className="text-[10px] font-black uppercase tracking-[0.52em] text-white/30">02 / Surface</p>
                  <p className="mt-3 text-[1.65rem] font-black uppercase leading-[0.94] text-white md:text-[2.4rem] font-satoshi">
                    Let reflection,
                    <span className="block text-outline italic">crop, and motion speak.</span>
                  </p>
                  <p className="mt-4 max-w-md text-sm leading-6 text-white/56 md:text-base md:leading-7">
                    The story shifts from overview to material detail, using scale changes and crossfades instead of cards.
                  </p>
                </motion.div>

                <motion.div style={{ opacity: storyThreeOpacity, y: storyThreeY }}>
                  <p className="text-[10px] font-black uppercase tracking-[0.52em] text-white/30">03 / Cabin</p>
                  <p className="mt-3 text-[1.65rem] font-black uppercase leading-[0.94] text-white md:text-[2.4rem] font-satoshi">
                    Finish with the
                    <span className="block text-outline italic">driver’s point of view.</span>
                  </p>
                  <p className="mt-4 max-w-md text-sm leading-6 text-white/56 md:text-base md:leading-7">
                    The last beat gets tighter and darker, so the sequence ends with intimacy instead of more spectacle.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="relative min-h-[58dvh] md:min-h-[70dvh]">
            <motion.div
              style={{ opacity: mediaOneOpacity, scale: mediaOneScale }}
              className="double-bezel absolute inset-0"
            >
              <div className="media-frame h-full w-full">
                <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover">
                  <source src="/hero.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,5,8,0.04)_0%,rgba(3,5,8,0.54)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.12),transparent_18%)]" />
              </div>
            </motion.div>

            <motion.div
              style={{ opacity: mediaTwoOpacity, scale: mediaTwoScale }}
              className="double-bezel absolute inset-0"
            >
              <div className="media-frame h-full w-full">
                <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover">
                  <source src="/m4-feature.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,5,8,0.02)_0%,rgba(3,5,8,0.56)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(255,255,255,0.08),transparent_16%)]" />
              </div>
            </motion.div>

            <motion.div
              style={{ opacity: mediaThreeOpacity, scale: mediaThreeScale }}
              className="double-bezel absolute inset-0"
            >
              <div className="media-frame h-full w-full">
                <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover">
                  <source src="/m4-interior.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,5,8,0.06)_0%,rgba(3,5,8,0.62)_100%)]" />
              </div>
            </motion.div>

            <div className="absolute inset-x-0 bottom-0 grid gap-4 border-t border-white/10 bg-[linear-gradient(180deg,rgba(3,5,8,0)_0%,rgba(3,5,8,0.66)_48%,rgba(3,5,8,0.9)_100%)] p-6 md:grid-cols-3 md:p-8 z-10 rounded-b-[2rem]">
              {[
                ["Arrival", "Open frame / low noise"],
                ["Surface", "Tighter crop / brighter edge"],
                ["Cabin", "Dark finish / interior focus"],
              ].map(([label, copy]) => (
                <div key={label}>
                  <p className="text-[10px] font-black uppercase tracking-[0.48em] text-white/28">{label}</p>
                  <p className="mt-3 text-sm leading-6 text-white/58">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
