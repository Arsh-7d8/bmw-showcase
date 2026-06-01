"use client";

import { motion } from "framer-motion";

const featurePanels = [
  {
    title: "Carbon Core",
    description: "Lightweight architecture reframed as a silhouette study instead of a feature tile.",
    media: "/m4-feature.mp4",
    type: "video",
  },
  {
    title: "Cabin Tension",
    description: "The cockpit behaves like a dark control room, not a showroom spread.",
    media: "/m4-interior.mp4",
    type: "video",
  },
  {
    title: "Signal Blue",
    description: "BMW light blue only appears as a cue line and pressure point, never as decorative noise.",
    type: "gradient",
  },
  {
    title: "Editorial Layout",
    description: "Large margins, hard labels, and cut-down copy keep the composition authored.",
    type: "text",
  },
];

export default function FeatureGrid() {
  return (
    <section id="details" className="relative px-5 py-24 md:px-8 md:py-36">
      <div className="section-shell">
        <div className="mb-14 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <span className="eyebrow">Detail chapter</span>
            <h2 className="mt-6 text-[3rem] leading-[0.88] text-white md:text-[5rem] font-satoshi tracking-tight">
              The supporting frames still need
              <span className="block text-outline italic">their own attitude.</span>
            </h2>
          </div>
          <div className="chapter-line self-end pt-6">
            <p className="max-w-2xl text-sm leading-7 text-white/60 md:text-base">
              The end of the page should still feel cinematic. Supporting media and graphic moments exist to extend
              the visual thesis, not to fall back into interchangeable boxes.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {featurePanels.map((panel, index) => (
            <motion.article
              key={panel.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ duration: 0.8, delay: index * 0.07, ease: [0.23, 1, 0.32, 1] }}
              className={[
                "group relative overflow-hidden",
                panel.type === "text" ? "chapter-line min-h-[22rem] lg:col-span-8" : "double-bezel",
                index === 0 ? "min-h-[30rem] lg:col-span-7" : "",
                index === 1 ? "min-h-[30rem] lg:col-span-5" : "",
                index === 2 ? "min-h-[22rem] lg:col-span-4" : "",
                index === 3 ? "lg:self-end" : "",
              ].join(" ")}
            >
              {panel.type !== "text" ? (
                <div className="media-frame h-full w-full">
                  {panel.type === "video" && (
                    <>
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
                      >
                        <source src={panel.media} type="video/mp4" />
                      </video>
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,5,0.12),rgba(2,3,5,0.82))]" />
                    </>
                  )}

                  {panel.type === "gradient" && (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(125,211,252,0.34),transparent_22%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(140deg,#08111b_0%,#09131d_38%,#050b12_100%)]" />
                  )}

                  <div className="relative flex h-full flex-col justify-between p-6 md:p-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/34">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="max-w-lg text-3xl leading-[0.95] text-white md:text-4xl">{panel.title}</h3>
                      <p className="mt-4 max-w-md text-sm leading-6 text-white/60 md:text-base md:leading-7">
                        {panel.description}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative flex h-full flex-col justify-between p-6 md:p-8">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.02),transparent_60%)]" />
                  <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.5em] text-white/34">
                    0{index + 1}
                  </span>
                  <div className="relative z-10">
                    <h3 className="max-w-lg text-3xl leading-[0.95] text-white md:text-4xl">{panel.title}</h3>
                    <p className="mt-4 max-w-md text-sm leading-6 text-white/60 md:text-base md:leading-7">
                      {panel.description}
                    </p>
                  </div>
                </div>
              )}
            </motion.article>
          ))}
        </div>

        <div className="chapter-line mt-10 grid gap-8 pt-8 md:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Closing note</p>
            <p className="mt-4 text-[2.6rem] uppercase leading-[0.92] text-white md:text-[4rem] font-satoshi tracking-tight">
              Built to feel
              <span className="block text-outline italic font-medium opacity-90">authored.</span>
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              ["01", "Sharper silhouette"],
              ["02", "More intentional pacing"],
              ["03", "Portfolio-first framing"],
            ].map(([num, title]) => (
              <div key={num}>
                <p className="text-[10px] font-black uppercase tracking-[0.46em] text-white/30">{num}</p>
                <p className="mt-4 text-lg font-bold uppercase tracking-tight text-white">{title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
