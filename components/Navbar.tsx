"use client";

import { motion, useReducedMotion, useMotionValueEvent, type MotionValue, useScroll } from "framer-motion";
import Image from "next/image";
import { useState, useRef } from "react";

const navItems = [
  ["Overview", "#top"],
  ["Story", "#story"],
  ["Performance", "#performance"],
  ["Catalog", "#catalog"],
];

export default function Navbar({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  
  const [hasEntered, setHasEntered] = useState(false);
  const [entranceComplete, setEntranceComplete] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showNav, setShowNav] = useState(false);
  
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger entrance sequence when scrolling past the hero
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!hasEntered && latest > 0.9) {
      setHasEntered(true);
      setShowNav(true); // Drop down the background
      
      // Delay the logo sweep to start after the background has smoothly entered
      setTimeout(() => {
        setIsRevealed(true);
        // Mark the entire entrance sequence as complete after the sweep finishes
        setTimeout(() => setEntranceComplete(true), 2500); 
      }, 800);
    }
  });

  // Scroll-hide behavior: hide on scroll, show 2.5s after stopping
  useMotionValueEvent(scrollY, "change", () => {
    if (!entranceComplete) return; // Ignore scrolling during the initial entrance
    
    setShowNav(false);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      setShowNav(true);
    }, 2500);
  });

  // Premium, "genuine" sweep speed (smooth, deliberate, not overly fast)
  const sweepTransition = {
    duration: 2.4,
    ease: [0.25, 1, 0.36, 1] as const
  };

  // Background drop-down transition
  const bgTransition = {
    duration: 0.8,
    ease: [0.32, 0.72, 0, 1] as const
  };

  return (
    <motion.nav
      initial={{ y: "-116%", opacity: 0 }}
      animate={{ 
        y: hasEntered && showNav ? "0%" : "-116%", 
        opacity: hasEntered && showNav ? 1 : 0 
      }}
      transition={bgTransition}
      className="fixed left-0 top-0 z-40 flex w-full items-center border-b border-white/10 bg-black/52 px-5 py-4 backdrop-blur-2xl md:px-10 md:py-6"
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between">
        
        {/* The Rolling Logo */}
        <motion.a
          href="#top"
          initial={false}
          animate={{ 
            x: isRevealed ? 0 : (prefersReducedMotion ? 0 : "80vw"),
            rotate: isRevealed ? 0 : (prefersReducedMotion ? 0 : 720),
            scale: isRevealed ? 1 : (prefersReducedMotion ? 1 : 1.2)
          }}
          transition={sweepTransition}
          className="relative z-20 block"
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

        {/* The Nav Links (Revealed from right to left by the sweep) */}
        <motion.div 
          initial={false}
          animate={{ 
            opacity: isRevealed ? 1 : 0, 
            clipPath: isRevealed ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 0% 100%)",
            x: isRevealed ? 0 : -30
          }}
          transition={sweepTransition}
          className="hidden flex-1 items-center justify-end pr-10 lg:flex"
        >
          <div className="flex items-center gap-10">
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
        </motion.div>

        {/* The Munich Tag (Static on the far right) */}
        <div className="flex items-center gap-6 relative z-10">
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
