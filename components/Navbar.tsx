"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";

const navItems = [
  ["Overview", "#top"],
  ["Story", "#story"],
  ["Performance", "#performance"],
  ["Catalog", "#catalog"],
];

export default function Navbar({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const prefersReducedMotion = useReducedMotion();

  const y = useTransform(scrollYProgress, [0.88, 0.94], ["-116%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0.88, 0.94], [0, 1]);
  const logoRotate = useTransform(scrollYProgress, [0.9, 0.96], [prefersReducedMotion ? 0 : -360, 0]);
  const logoX = useTransform(scrollYProgress, [0.9, 0.96], [prefersReducedMotion ? 0 : 100, 0]);

  return (
    <motion.nav
      style={{ y, opacity }}
      className="fixed left-0 top-0 z-40 flex w-full items-center border-b border-white/10 bg-black/52 px-5 py-4 backdrop-blur-2xl md:px-10 md:py-6"
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between">
        <div className="relative flex items-center">
          <motion.a
            href="#top"
            style={{ rotate: logoRotate, x: logoX }}
            className="relative z-10 block"
            aria-label="BMW M4 Showcase home"
          >
            <Image
              src="/bmw-logo-v2.png"
              alt="BMW"
              width={160}
              height={160}
              sizes="(min-width: 1024px) 86px, (min-width: 768px) 72px, 56px"
              className="h-auto w-14 object-contain drop-shadow-[0_18px_26px_rgba(0,0,0,0.4)] md:w-[72px] lg:w-[86px]"
              priority
            />
          </motion.a>
          <motion.span 
            style={{ opacity: useTransform(scrollYProgress, [0.93, 0.96], [0, 1]) }}
            className="absolute left-[80px] text-lg font-black tracking-widest text-white md:left-[100px] lg:left-[110px]"
          >
            M4
          </motion.span>
        </div>

        <div className="hidden items-center gap-10 lg:flex">
          {navItems.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="group relative text-[11px] font-black uppercase tracking-[0.4em] text-white/70 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-white"
            >
              <span className="relative z-10">{label}</span>
              <span className="absolute inset-x-0 -bottom-2 h-[2px] origin-left scale-x-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden text-right md:block">
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/42">
              Munich / 2026
            </p>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center border border-white/20 bg-white/5 text-white transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white/12 lg:hidden"
            aria-label="Open navigation"
          >
            <span className="flex w-5 flex-col gap-1.5">
              <span className="h-px w-full bg-current" />
              <span className="h-px w-full bg-current" />
              <span className="h-px w-full bg-current" />
            </span>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
