"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const watermarkY = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  const specs = [
    {
      index: "01",
      label: "Power output",
      value: "510 HP",
      note: "TwinPower Turbo delivery tuned for violence without chaos and framed like a hero line, not a stat tile.",
    },
    {
      index: "02",
      label: "Launch interval",
      value: "3.9 SEC",
      note: "M xDrive traction collapses the first movement into one clean forward hit.",
    },
    {
      index: "03",
      label: "Top speed",
      value: "290 KM/H",
      note: "Electronically limited, but visually treated with enough pressure to feel unconstrained.",
    },
  ];

  return (
    <section id="performance" ref={sectionRef} className="relative px-5 py-24 md:px-8 md:py-36">
      <div className="section-shell grid gap-16 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <span className="eyebrow">Performance chapter</span>
          <h2 className="mt-6 max-w-xl text-[3.2rem] leading-[0.84] text-white md:text-[5.8rem] font-satoshi tracking-tight">
            Numbers that feel
            <span className="block text-outline italic font-medium opacity-90">cut from steel.</span>
          </h2>
          <p className="mt-8 max-w-xl text-base leading-7 text-white/54 md:text-lg md:leading-8">
            This section stops behaving like a dashboard. It treats performance data as pacing, scale,
            and authored contrast so the machine still feels cinematic when the motion slows down.
          </p>

          <div className="chapter-line mt-10 pt-6">
            <p className="text-[10px] font-black uppercase tracking-[0.52em] text-white/30">Visual note</p>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/56">
              Keep the typography enormous and the support copy quiet. The spectacle is in the restraint.
            </p>
          </div>
        </div>

        <div className="relative">
          <motion.p 
            style={{ y: watermarkY }}
            className="pointer-events-none absolute right-0 top-0 hidden text-[clamp(5rem,13vw,12rem)] font-black uppercase leading-none tracking-[-0.08em] text-white/[0.08] xl:block"
          >
            G82
          </motion.p>

          <div className="chapter-line">
            {specs.map((spec, index) => (
              <motion.article
                key={spec.label}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: index * 0.08, ease: [0.32, 0.72, 0, 1] }}
                className="grid gap-6 border-b border-white/10 py-8 md:grid-cols-[0.16fr_0.44fr_0.4fr] md:gap-8 md:py-10"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/28">{spec.index}</p>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.52em] text-white/34">{spec.label}</p>
                  <p className="mt-4 font-satoshi text-[2.8rem] uppercase leading-[0.9] tracking-tight text-white md:text-[4.5rem]">
                    {spec.value}
                  </p>
                </div>
                <p className="max-w-md self-end text-sm leading-6 text-white/56 md:text-base md:leading-7">
                  {spec.note}
                </p>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.32, 0.72, 0, 1] }}
            className="grid gap-10 py-10 md:grid-cols-2"
          >
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Chassis language</p>
              <p className="mt-4 max-w-sm text-[2rem] font-black uppercase leading-[0.96] text-white md:text-[3rem]">
                Front axle precision.
                <span className="block text-outline italic font-medium opacity-90">Rear-biased intent.</span>
              </p>
            </div>

            <div className="chapter-line pt-6">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Atmosphere</p>
              <p className="mt-4 max-w-lg text-base leading-7 text-white/58 md:text-lg md:leading-8 font-satoshi font-light">
                Carbon blacks, fogged whites, and one disciplined BMW blue keep the visual language technical
                instead of ornamental.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
