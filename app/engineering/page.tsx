"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import Navbar from "@/components/Navbar";
import ModelViewer from "@/components/ModelViewer";
import Footer from "@/components/Footer";

const specs = [
  {
    label: "Engine",
    value: "3.0L M TwinPower Turbo",
    detail: "Straight-six output tuned for immediate road response and stable thermal performance.",
  },
  {
    label: "Output",
    value: "503 HP",
    detail: "Power delivery calibrated for both everyday composure and track-capable aggression.",
  },
  {
    label: "0-60 MPH",
    value: "3.4 Seconds",
    detail: "With M xDrive and launch calibration aligned for repeatable starts.",
  },
  {
    label: "Transmission",
    value: "8-Speed M Steptronic",
    detail: "Fast, clean shifts with enough refinement to feel premium outside the circuit.",
  },
];

export default function EngineeringPage() {
  const containerRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <main ref={containerRef} className="min-h-screen overflow-x-hidden bg-[#f3f4f6] text-[#15181d]">
      <Navbar scrollYProgress={scrollYProgress} />

      <section className="border-b border-black/[0.06] bg-white pt-40 pb-18 md:pt-48 md:pb-24">
        <div className="section-shell max-w-[1680px]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            className="grid gap-10 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] xl:items-end"
          >
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.38em] text-black/42">
                Engineering
              </p>
              <h1 className="mt-6 font-frick text-[clamp(3rem,7vw,5.8rem)] uppercase leading-[0.88] tracking-[-0.04em] text-[#111317]">
                Premium clarity,
                <br />
                precise control.
              </h1>
            </div>

            <div className="max-w-[42rem] xl:justify-self-end">
              <p className="text-lg leading-9 text-black/64">
                The lab is now approached like a real configurator, not a dark concept render.
                Cleaner surfaces, more readable controls, better car fit, and a calmer interaction
                model that keeps the BMW itself in focus.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <ModelViewer />

      <section className="py-16 md:py-20">
        <div className="section-shell max-w-[1680px]">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {specs.map((spec, index) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.55, delay: index * 0.06, ease: [0.32, 0.72, 0, 1] }}
                className="rounded-[1.7rem] border border-black/8 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-black/35">
                  {spec.label}
                </p>
                <p className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#111317]">
                  {spec.value}
                </p>
                <p className="mt-4 text-sm leading-7 text-black/58">{spec.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-24">
        <div className="section-shell max-w-[1680px]">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.06)]"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-black/35">
                Experience Direction
              </p>
              <h2 className="mt-5 font-frick text-[clamp(2.1rem,4vw,3.6rem)] uppercase leading-[0.9] tracking-[-0.04em] text-[#111317]">
                Designed to feel
                <br />
                closer to BMW.
              </h2>
              <p className="mt-6 max-w-[36rem] text-base leading-8 text-black/62">
                The interaction now follows the configurator logic more closely: clean neutral
                background, dominant vehicle stage, separated control zones, and far less visual
                noise competing with the model.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.65, ease: [0.32, 0.72, 0, 1] }}
              className="rounded-[2rem] border border-black/8 bg-[#111317] p-8 text-white shadow-[0_18px_60px_rgba(15,23,42,0.12)]"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/42">
                What changed
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  "White configurator stage with softer shadows.",
                  "Cleaner right-side option grouping for model, paint, and scene.",
                  "More conservative camera framing so the model reads correctly.",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-4 text-sm leading-7 text-white/68"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
