"use client";

import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, type MotionValue, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { sfx } from "@/lib/audio";
import { useMediaQuery } from "@/lib/useMediaQuery";

const navItems = [
  ["Overview", "/#top"],
  ["Engineering", "/engineering"],
  ["Heritage", "/heritage"],
  ["Catalog", "/#m-cars"],
];

type NavPhase = "entrance" | "hero" | "past-hero";

export default function Navbar({ scrollYProgress }: { scrollYProgress?: MotionValue<number> }) {
  const prefersReducedMotion = useReducedMotion();
  const isDesktopViewport = useMediaQuery("(min-width: 768px)");
  const [phase, setPhase] = useState<NavPhase>("entrance");
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showInterior, setShowInterior] = useState(false);
  const phaseRef = useRef<NavPhase>("entrance");
  const showInteriorRef = useRef(false);
  const interiorTimerRef = useRef<number | null>(null);
  const fallbackScrollY = useMotionValue(0);
  const progress = scrollYProgress || fallbackScrollY;
  const revealStart = isDesktopViewport ? 0.84 : 0;
  const heroComplete = isDesktopViewport ? 0.955 : 0.72;
  const interiorDelay = prefersReducedMotion ? 0 : isDesktopViewport ? 240 : 0;

  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      setIsScrolling(true);

      if (scrollTimeout) clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 900);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (interiorTimerRef.current !== null) {
        window.clearTimeout(interiorTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isDesktopViewport) return;

    const frame = window.requestAnimationFrame(() => {
      const nextPhase: NavPhase = progress.get() < heroComplete ? "hero" : "past-hero";
      phaseRef.current = nextPhase;
      showInteriorRef.current = true;
      setPhase(nextPhase);
      setShowInterior(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [heroComplete, isDesktopViewport, progress]);

  useMotionValueEvent(progress, "change", (latest) => {
    const clearInteriorTimer = () => {
      if (interiorTimerRef.current === null) return;
      window.clearTimeout(interiorTimerRef.current);
      interiorTimerRef.current = null;
    };

    if (latest < revealStart) {
      clearInteriorTimer();
      if (showInteriorRef.current) {
        showInteriorRef.current = false;
        setShowInterior(false);
      }
      if (phaseRef.current !== "entrance") {
        phaseRef.current = "entrance";
      }
      setPhase("entrance");
      return;
    }

    if (latest < heroComplete) {
      if (phaseRef.current !== "hero") {
        clearInteriorTimer();
        phaseRef.current = "hero";
        if (prefersReducedMotion) {
          showInteriorRef.current = true;
          setShowInterior(true);
        } else {
          interiorTimerRef.current = window.setTimeout(() => {
            showInteriorRef.current = true;
            setShowInterior(true);
            interiorTimerRef.current = null;
          }, interiorDelay);
        }
      }
      setPhase("hero");
      return;
    }

    clearInteriorTimer();
    if (!showInteriorRef.current) {
      showInteriorRef.current = true;
      setShowInterior(true);
    }
    if (phaseRef.current !== "past-hero") {
      phaseRef.current = "past-hero";
    }
    setPhase("past-hero");
  });

  const isVisible = isDesktopViewport
    ? phase !== "entrance"
    : phase === "hero" || (phase === "past-hero" && !isScrolling);
  const showShell = phase !== "entrance";

  const navVariants: Variants = {
    hidden: {
      y: prefersReducedMotion ? 0 : -88,
      opacity: 0,
      transition: {
        duration: 0.44,
        ease: [0.32, 0.72, 0, 1],
      },
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.72,
        ease: [0.22, 1, 0.36, 1],
        when: "beforeChildren",
        staggerChildren: prefersReducedMotion ? 0 : 0.07,
      },
    },
  };

  const logoVariants: Variants = {
    hidden: {
      x: prefersReducedMotion ? 0 : "80vw",
      rotate: prefersReducedMotion ? 0 : 720,
      scale: prefersReducedMotion ? 1 : 1.2,
      opacity: 1,
    },
    visible: {
      x: 0,
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.8,
        ease: [0.25, 1, 0.36, 1],
      },
    },
  };

  const linkSweepVariants: Variants = {
    hidden: {
      opacity: prefersReducedMotion ? 1 : 0,
      clipPath: prefersReducedMotion ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 0% 100%)",
    },
    visible: {
      opacity: 1,
      clipPath: "inset(0% 0% 0% 0%)",
      transition: {
        duration: 1.8,
        ease: [0.25, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.nav
      initial="hidden"
      animate={showShell ? "visible" : "hidden"}
      variants={navVariants}
      className="fixed left-0 top-0 z-50 flex w-full items-center border-b border-white/10 bg-black/58 px-5 py-4 backdrop-blur-2xl md:px-10 md:py-6"
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between">
        <Link href="/#top" className="relative z-20 block">
          <motion.div
            initial={false}
            animate={showInterior ? "visible" : "hidden"}
            variants={logoVariants}
            aria-label="BMW M4 Showcase home"
          >
            <Image
              src="/bmw-logo-v2.png"
              alt="BMW"
              width={160}
              height={160}
              unoptimized
              sizes="(min-width: 1024px) 86px, (min-width: 768px) 72px, 56px"
              className="h-auto w-14 object-contain drop-shadow-[0_18px_26px_rgba(0,0,0,0.4)] md:w-[72px] lg:w-[86px]"
              priority
            />
          </motion.div>
        </Link>

        <motion.div
          initial={false}
          animate={showInterior ? "visible" : "hidden"}
          variants={linkSweepVariants}
          className="relative hidden flex-1 items-center justify-end overflow-hidden pr-6 md:flex"
        >
          <div className="flex items-center gap-6 lg:gap-10">
            {navItems.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                onMouseEnter={() => sfx.playHover()}
                onClick={() => sfx.playClick()}
                className="group relative text-[10px] font-black uppercase tracking-[0.32em] text-white/70 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-white lg:text-[11px] lg:tracking-[0.4em]"
              >
                <span className="relative z-10">{label}</span>
                <span className="absolute inset-x-0 -bottom-2 h-[2px] origin-left scale-x-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
              </Link>
            ))}
          </div>
        </motion.div>

        <div className="relative z-10 flex items-center gap-6 md:hidden">
          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="flex h-10 w-10 items-center justify-center border border-white/20 bg-white/5 text-white transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white/12"
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          >
            {isMenuOpen ? (
              <X size={18} strokeWidth={1.5} />
            ) : (
              <span className="flex w-5 flex-col gap-1.5">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-full bg-current" />
                <span className="h-px w-full bg-current" />
              </span>
            )}
          </button>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{
          opacity: isMenuOpen && isVisible ? 1 : 0,
          y: isMenuOpen && isVisible ? 0 : -12,
          pointerEvents: isMenuOpen && isVisible ? "auto" : "none",
        }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-5 top-full z-50 mt-3 border border-white/10 bg-black/92 p-4 shadow-[0_24px_50px_rgba(0,0,0,0.38)] backdrop-blur-2xl md:hidden"
      >
        <div className="grid gap-2">
          {navItems.map(([label, href], index) => (
            <Link
              key={label}
              href={href}
              onClick={() => {
                sfx.playClick();
                setIsMenuOpen(false);
              }}
              className="flex items-center justify-between border border-white/10 px-4 py-3 text-[11px] font-black uppercase tracking-[0.28em] text-white/82 transition-colors hover:bg-white/8"
            >
              <span>{label}</span>
              <span className="font-frick-condensed text-[0.65rem] text-white/38">
                0{index + 1}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
}
