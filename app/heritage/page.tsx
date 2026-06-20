"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll } from "framer-motion";

const timeline = [
  {
    year: "1972",
    title: "The Birth of M",
    description: "BMW Motorsport GmbH is founded. 35 employees. One goal: to win on the track.",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
    span: "col-span-1 md:col-span-2",
  },
  {
    year: "1978",
    title: "M1: The Legend",
    description: "The only mid-engine BMW supercar ever built. A masterpiece of Giugiaro design.",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80",
    span: "col-span-1",
  },
  {
    year: "1986",
    title: "E30 M3",
    description: "The most successful touring car in history. Designed for Group A, built for the street.",
    image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=800&q=80",
    span: "col-span-1",
  },
  {
    year: "2023",
    title: "The Future is M",
    description: "Hybrid performance and all-electric precision. The letter M remains the benchmark.",
    image: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=800&q=80",
    span: "col-span-1 md:col-span-2",
  },
];

export default function HeritagePage() {
  const containerRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <main ref={containerRef} className="relative min-h-screen bg-[#020305] text-[#e8edf2] overflow-x-hidden">
      <div className="film-grain pointer-events-none fixed inset-0 z-10 opacity-[0.03]" />
      <Navbar scrollYProgress={scrollYProgress} />
      
      {/* Hero Section */}
      <section className="section-shell pt-48 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        >
          <span className="eyebrow">M Heritage</span>
          <h1 className="mt-8 text-[clamp(3.5rem,10vw,8rem)] font-black uppercase leading-[0.82] tracking-[-0.04em] font-frick">
            Decades of <br />
            <span className="text-white/20 italic">Dominance.</span>
          </h1>
          <p className="mt-12 max-w-2xl text-lg leading-relaxed text-white/50 font-satoshi font-light">
            Tracing the lineage of the most powerful letter in the world. From the 
            legendary M1 to the current GT3 champions.
          </p>
        </motion.div>
      </section>

      {/* Timeline Bento Grid */}
      <section className="section-shell py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timeline.map((item, index) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.32, 0.72, 0, 1] }}
              className={`double-bezel ${item.span}`}
            >
              <div className="relative group overflow-hidden h-full min-h-[300px]">
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="absolute inset-0 h-full w-full object-cover grayscale opacity-20 group-hover:opacity-40 transition-opacity duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020305] via-[#020305]/60 to-transparent" />
                
                <div className="relative h-full flex flex-col justify-end p-8 md:p-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#b11f2a]">{item.year}</span>
                  <h3 className="mt-4 text-[2.5rem] font-black uppercase leading-none font-frick">{item.title}</h3>
                  <p className="mt-6 max-w-sm text-sm leading-6 text-white/40 font-light">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-shell py-32 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <span className="eyebrow mx-auto">Philosophy</span>
          <h2 className="mt-12 text-[2.5rem] md:text-[4rem] font-black uppercase leading-[0.9] font-frick">
            We do not build cars. <br />
            <span className="text-outline italic">We build M.</span>
          </h2>
          <p className="mt-12 text-xl leading-9 text-white/60 font-light">
            Every BMW M model is developed and tested at the Nürburgring Nordschleife. 
            It is not about the numbers. It is about the feedback, the balance, and the 
            unwavering connection between driver and machine.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
