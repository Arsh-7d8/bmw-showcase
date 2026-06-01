"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Button from "./Button";

const models = [
  {
    id: "m4",
    name: "M4 Competition",
    type: "Track coupe",
    note: "The cleanest fit for the core visual language: low, sharp, and already cinematic.",
    preview: "video-feature",
    accent: "Featured build",
  },
  {
    id: "m2",
    name: "M2 Coupe",
    type: "Compact coupe",
    note: "Shorter, denser proportions for a more aggressive and youthful catalog beat.",
    preview: "gradient-red",
    accent: "Short wheelbase",
  },
  {
    id: "m3",
    name: "M3 Touring",
    type: "Performance touring",
    note: "Adds utility and contrast without losing the disciplined, driver-first attitude.",
    preview: "gradient-silver",
    accent: "Long roof",
  },
  {
    id: "m5",
    name: "M5 Sedan",
    type: "Super sedan",
    note: "A heavier, more executive silhouette that suits a cleaner, quieter treatment.",
    preview: "video-interior",
    accent: "Executive force",
  },
  {
    id: "xm",
    name: "XM Label",
    type: "Performance SUV",
    note: "The outlier in the archive: wider stance, taller body, and a different kind of presence.",
    preview: "gradient-blue",
    accent: "High stance",
  },
];

export default function ModelsCatalog() {
  const [activeId, setActiveId] = useState("m4");
  const activeModel = models.find((model) => model.id === activeId) ?? models[0];
  const activeGlyph = activeModel.name.split(" ")[0];

  return (
    <section id="catalog" className="relative px-5 py-24 md:px-8 md:py-36">
      <div className="section-shell">
        <div className="grid gap-12 lg:grid-cols-[0.5fr_0.5fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <span className="eyebrow">Model catalog</span>
            <h2 className="mt-6 max-w-xl text-[3rem] leading-[0.88] text-white md:text-[4.8rem] font-frick tracking-[-0.04em]">
              One clean archive.
              <span className="block text-outline italic">Different silhouettes.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/62 md:text-lg md:leading-8">
              Instead of another block grid, the catalog becomes a selectable list with one active stage.
              It stays cleaner, and the focus remains on each model’s character.
            </p>

            <div className="double-bezel mt-10">
              <div className="media-frame min-h-[24rem] md:min-h-[34rem]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeModel.id}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.985 }}
                    transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute inset-0"
                  >
                    {activeModel.preview === "video-feature" && (
                      <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover">
                        <source src="/m4-feature.mp4" type="video/mp4" />
                      </video>
                    )}

                    {activeModel.preview === "video-interior" && (
                      <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover">
                        <source src="/m4-interior.mp4" type="video/mp4" />
                      </video>
                    )}

                    {activeModel.preview === "gradient-red" && (
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_22%,rgba(177,31,42,0.34),transparent_22%),linear-gradient(135deg,#12070a_0%,#080a0d_44%,#040609_100%)]" />
                    )}

                    {activeModel.preview === "gradient-silver" && (
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_18%,rgba(255,255,255,0.2),transparent_18%),linear-gradient(135deg,#12161c_0%,#090d11_48%,#040609_100%)]" />
                    )}

                    {activeModel.preview === "gradient-blue" && (
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,160,233,0.26),transparent_22%),linear-gradient(135deg,#07111b_0%,#05080d_48%,#040609_100%)]" />
                    )}

                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,5,8,0.04)_0%,rgba(3,5,8,0.58)_100%)]" />
                    <div className="relative flex h-full flex-col justify-end p-6 md:p-8">
                      <p className="pointer-events-none absolute right-6 top-6 text-[clamp(4rem,12vw,8rem)] font-frick uppercase leading-none tracking-[-0.08em] text-white/[0.08]">
                        {activeGlyph}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/32">{activeModel.accent}</p>
                      <p className="mt-4 text-[2.2rem] font-frick uppercase leading-[0.92] text-white md:text-[3.5rem] tracking-[-0.04em]">
                        {activeModel.name}
                      </p>
                      <p className="mt-3 max-w-md text-sm leading-6 text-white/58 md:text-base md:leading-7">
                        {activeModel.note}
                      </p>
                      
                      <div className="mt-8">
                        <Button variant="primary">Explore Engineering</Button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10">
            {models.map((model, index) => {
              const isActive = model.id === activeId;

              return (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.24 }}
                  transition={{ duration: 0.75, delay: index * 0.06, ease: [0.23, 1, 0.32, 1] }}
                  onMouseEnter={() => setActiveId(model.id)}
                  onFocus={() => setActiveId(model.id)}
                  tabIndex={0}
                  className="group grid cursor-pointer gap-4 border-b border-white/[0.03] py-5 outline-none transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:bg-white/[0.01] md:grid-cols-[0.14fr_0.42fr_0.44fr] md:py-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">0{index + 1}</span>
                    <span
                      className={[
                        "h-1.5 w-1.5 rounded-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
                        isActive ? "bg-[#00a0e9] scale-125 shadow-[0_0_12px_rgba(0,160,233,0.4)]" : "bg-white/10 group-hover:bg-white/30",
                      ].join(" ")}
                    />
                  </div>

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/22">{model.type}</p>
                    <p className="mt-2 text-[1.6rem] font-frick uppercase leading-none text-white md:text-[2.2rem] tracking-[-0.04em]">
                      {model.name}
                    </p>
                  </div>

                  <p className="max-w-md self-end text-sm leading-relaxed text-white/40 md:text-[15px] font-light">
                    {model.note}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
