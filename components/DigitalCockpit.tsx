"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const hotspotItems = [
  {
    src: "https://www.bmw-m.com/content/dam/bmw/marketBMW_M/www_bmw-m_com/topics/m-community-incar-app/in-car-apps/bmw-m-in-car-apps-011-9x16.jpg",
    title: "M SETUP MODE",
    description: "Configure engine, chassis, and steering response with precision presets."
  },
  {
    src: "https://www.bmw-m.com/content/dam/bmw/marketBMW_M/www_bmw-m_com/topics/m-community-incar-app/m-community/bmw-m-community-stage-01-9x16.jpg",
    title: "M COMMUNITY",
    description: "Connect with drivers worldwide and share track telemetry in real-time."
  },
  {
    src: "https://www.bmw-m.com/content/dam/bmw/marketBMW_M/www_bmw-m_com/fastlane/mpp/2025/bmw-m5-sedan-mpp-stage-01-9x16.jpg",
    title: "TELEMETRY PRO",
    description: "Advanced track analysis with sector-by-second performance breakdown."
  }
];

export default function DigitalCockpit() {
  return (
    <section id="story" className="relative z-0 min-h-screen bg-black py-32">
      <div className="section-shell">
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="font-frick text-[clamp(3.5rem,8vw,8rem)] uppercase leading-none tracking-tight text-white">
              DIGITAL<br />
              <span className="text-white/40">COCKPIT</span>
            </h2>
          </div>
          <div className="max-w-xs">
             <p className="font-frick-condensed text-xs uppercase tracking-[0.3em] text-[#00a0e9] border-l border-[#00a0e9] pl-6 py-2">
                The intersection of physical performance and digital intelligence.
             </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {hotspotItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="group flex flex-col"
            >
              <div className="relative aspect-[9/16] overflow-hidden border border-white/5 bg-white/2 grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:border-white/20">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
                
                {/* Scanner Line Effect */}
                <div className="absolute inset-x-0 h-px bg-[#00a0e9]/40 top-0 group-hover:animate-scan shadow-[0_0_15px_#00a0e9]" />
              </div>
              <div className="mt-8">
                <h3 className="font-frick text-2xl uppercase text-white mb-4 tracking-tight">{item.title}</h3>
                <p className="font-satoshi text-sm leading-relaxed text-white/50 max-w-[280px]">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </section>
  );
}
