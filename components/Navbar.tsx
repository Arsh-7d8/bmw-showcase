"use client";

import { AnimatePresence, LayoutGroup, motion, useMotionValue, useMotionValueEvent, useReducedMotion, type MotionValue, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { sfx } from "@/lib/audio";
import { useMediaQuery } from "@/lib/useMediaQuery";

const navItems = [
  { label: "Intro", href: "/#top", selector: "#top" },
  { label: "Performance", href: "/#performance", selector: "#performance" },
  { label: "Cockpit", href: "/#story", selector: "#story" },
  { label: "Garage", href: "/#m-cars", selector: "#m-cars" },
] as const;

type NavHref = (typeof navItems)[number]["href"];

type NavPhase = "entrance" | "hero" | "past-hero";

export default function Navbar({ scrollYProgress }: { scrollYProgress?: MotionValue<number> }) {
  const prefersReducedMotion = useReducedMotion();
  const isDesktopViewport = useMediaQuery("(min-width: 1024px)");
  const [phase, setPhase] = useState<NavPhase>("entrance");
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showInterior, setShowInterior] = useState(false);
  const [isDesktopIntroAnimating, setIsDesktopIntroAnimating] = useState(false);
  const [activeHref, setActiveHref] = useState<NavHref>("/#top");
  const [hoveredHref, setHoveredHref] = useState<NavHref | null>(null);
  const phaseRef = useRef<NavPhase>("entrance");
  const showInteriorRef = useRef(false);
  const interiorTimerRef = useRef<number | null>(null);
  const introAnimationTimerRef = useRef<number | null>(null);
  const fallbackScrollY = useMotionValue(0);
  const progress = scrollYProgress || fallbackScrollY;
  const heroReveal = isDesktopViewport ? 0.82 : 0;
  const heroComplete = isDesktopViewport ? 0.94 : 0.72;
  const interiorDelay = prefersReducedMotion ? 0 : isDesktopViewport ? 300 : 0;
  const desktopIntroDuration = prefersReducedMotion ? 0 : 2500;

  const clearInteriorTimer = useCallback(() => {
    if (interiorTimerRef.current === null) return;
    window.clearTimeout(interiorTimerRef.current);
    interiorTimerRef.current = null;
  }, []);

  const clearIntroAnimationTimer = useCallback(() => {
    if (introAnimationTimerRef.current === null) return;
    window.clearTimeout(introAnimationTimerRef.current);
    introAnimationTimerRef.current = null;
  }, []);

  const revealHeaderInterior = useCallback(() => {
    if (showInteriorRef.current) {
      return;
    }

    if (interiorTimerRef.current !== null) {
      return;
    }

    if (interiorDelay === 0) {
      showInteriorRef.current = true;
      setShowInterior(true);
      if (isDesktopViewport && !prefersReducedMotion) {
        setIsDesktopIntroAnimating(true);
        clearIntroAnimationTimer();
        introAnimationTimerRef.current = window.setTimeout(() => {
          setIsDesktopIntroAnimating(false);
          introAnimationTimerRef.current = null;
        }, desktopIntroDuration);
      }
      return;
    }

    interiorTimerRef.current = window.setTimeout(() => {
      showInteriorRef.current = true;
      setShowInterior(true);
      interiorTimerRef.current = null;
      if (isDesktopViewport && !prefersReducedMotion) {
        setIsDesktopIntroAnimating(true);
        clearIntroAnimationTimer();
        introAnimationTimerRef.current = window.setTimeout(() => {
          setIsDesktopIntroAnimating(false);
          introAnimationTimerRef.current = null;
        }, desktopIntroDuration);
      }
    }, interiorDelay);
  }, [clearIntroAnimationTimer, desktopIntroDuration, interiorDelay, isDesktopViewport, prefersReducedMotion]);

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
      clearInteriorTimer();
      clearIntroAnimationTimer();
    };
  }, [clearInteriorTimer, clearIntroAnimationTimer]);

  useEffect(() => {
    let frame = 0;

    const updateActiveHref = () => {
      frame = 0;
      const sectionMarker = window.innerHeight * 0.34;
      let nextHref: NavHref = navItems[0].href;

      for (const item of navItems) {
        const section = document.querySelector<HTMLElement>(item.selector);
        if (!section) continue;

        const rect = section.getBoundingClientRect();
        if (rect.top <= sectionMarker) {
          nextHref = item.href;
        }
      }

      setActiveHref((currentHref) => (currentHref === nextHref ? currentHref : nextHref));
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveHref);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("hashchange", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("hashchange", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const currentProgress = progress.get();
      const nextPhase: NavPhase =
        currentProgress < heroReveal ? "entrance" : currentProgress < heroComplete ? "hero" : "past-hero";
      phaseRef.current = nextPhase;
      setPhase(nextPhase);

      if (nextPhase === "entrance") {
        clearIntroAnimationTimer();
        showInteriorRef.current = false;
        setShowInterior(false);
        setIsDesktopIntroAnimating(false);
        return;
      }

      revealHeaderInterior();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [clearIntroAnimationTimer, heroComplete, heroReveal, progress, revealHeaderInterior]);

  useMotionValueEvent(progress, "change", (latest) => {
    if (latest < heroReveal) {
      clearInteriorTimer();
      clearIntroAnimationTimer();
      if (showInteriorRef.current) {
        showInteriorRef.current = false;
        setShowInterior(false);
      }
      setIsDesktopIntroAnimating(false);
      if (phaseRef.current !== "entrance") {
        phaseRef.current = "entrance";
      }
      setPhase("entrance");
      return;
    }

    if (latest < heroComplete) {
      if (phaseRef.current !== "hero") {
        phaseRef.current = "hero";
        revealHeaderInterior();
      }
      setPhase("hero");
      return;
    }

    revealHeaderInterior();
    if (phaseRef.current !== "past-hero") {
      phaseRef.current = "past-hero";
    }
    setPhase("past-hero");
  });

  const isVisible = isDesktopViewport
    ? phase !== "entrance" && showInterior
    : phase === "hero" || (phase === "past-hero" && !isScrolling);
  const showShell = isDesktopViewport ? phase !== "entrance" && showInterior : phase !== "entrance";
  const highlightedHref = hoveredHref ?? activeHref;
  const shouldShowDesktopAccent = !isDesktopIntroAnimating;

  const navVariants: Variants = {
    hidden: {
      y: prefersReducedMotion ? 0 : -18,
      opacity: 0,
      transition: {
        duration: 0.26,
        ease: [0.32, 0.72, 0, 1],
      },
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.42,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const logoVariants: Variants = {
    hidden: {
      x: prefersReducedMotion ? 0 : -18,
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 0.98,
    },
    visible: {
      x: 0,
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.28,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const logoRunnerVariants: Variants = {
    hidden: {
      x: prefersReducedMotion ? 0 : "min(78vw, 1180px)",
      opacity: prefersReducedMotion ? 1 : 0.96,
      scale: prefersReducedMotion ? 1 : 0.94,
    },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.9,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.16,
        ease: "linear",
      },
    },
  };

  const logoRunnerSpinVariants: Variants = {
    hidden: {
      rotate: prefersReducedMotion ? 0 : 12,
      scale: prefersReducedMotion ? 1 : 0.96,
    },
    visible: {
      rotate: prefersReducedMotion ? 0 : 372,
      scale: prefersReducedMotion ? 1 : 1,
      transition: {
        duration: 2.1,
        rotate: {
          duration: 2.1,
          ease: "linear",
        },
        scale: {
          duration: 0.32,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    },
  };

  const linkSweepVariants: Variants = {
    hidden: {
      opacity: prefersReducedMotion ? 1 : 0,
      x: prefersReducedMotion ? 0 : 120,
      clipPath: prefersReducedMotion ? "inset(0% 0% 0% 0%)" : "inset(0% 100% 0% 0%)",
    },
    visible: {
      opacity: 1,
      x: 0,
      clipPath: "inset(0% 0% 0% 0%)",
      transition: {
        duration: 1.18,
        delay: prefersReducedMotion ? 0 : 0.48,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const navRailVariants: Variants = {
    hidden: {
      opacity: 0,
      x: 220,
    },
    visible: {
      opacity: 1,
      x: -42,
      transition: {
        duration: 1.14,
        delay: prefersReducedMotion ? 0 : 1.72,
        ease: [0.16, 1, 0.3, 1],
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
      <div className="relative mx-auto flex w-full max-w-[1600px] items-center justify-between">
        <Link href="/#top" className="relative z-20 block">
          <motion.div
            initial={false}
            animate={showInterior && !isDesktopIntroAnimating ? "visible" : "hidden"}
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

        <AnimatePresence>
          {isDesktopIntroAnimating ? (
            <motion.div
              key="desktop-header-logo-runner"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={logoRunnerVariants}
              className="pointer-events-none absolute left-0 top-1/2 z-30 hidden -translate-y-1/2 md:block"
            >
              <div className="relative">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={logoRunnerSpinVariants}
                  className="relative will-change-transform"
                >
                  <motion.span
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 h-14 w-48 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.08),rgba(255,255,255,0.03)_44%,transparent_76%)] blur-lg"
                  />
                  <Image
                    src="/bmw-logo-v2.png"
                    alt=""
                    width={160}
                    height={160}
                    unoptimized
                    sizes="(min-width: 1024px) 86px, 72px"
                    className="relative h-auto w-[86px] object-contain drop-shadow-[0_18px_26px_rgba(0,0,0,0.4)]"
                    priority
                  />
                </motion.div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.div
          initial={false}
          animate={showInterior ? "visible" : "hidden"}
          variants={linkSweepVariants}
          className="relative hidden flex-1 items-center justify-end overflow-hidden pr-6 md:flex"
        >
          <LayoutGroup id="header-indicator">
            <div className="relative flex items-center gap-6 lg:gap-9">
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={showInterior && shouldShowDesktopAccent ? "visible" : "hidden"}
                variants={navRailVariants}
                className="pointer-events-none absolute right-[-2.25rem] top-1/2 h-10 w-36 -translate-y-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.16),rgba(255,255,255,0.07),transparent)] blur-xl"
              />
              {navItems.map(({ label, href }) => {
                const isHighlighted = highlightedHref === href && isVisible && shouldShowDesktopAccent;
                const isActive = activeHref === href;

                return (
                  <Link
                    key={label}
                    href={href}
                    onMouseEnter={() => {
                      sfx.playHover();
                      setHoveredHref(href);
                    }}
                    onMouseLeave={() => {
                      setHoveredHref((currentHref) => (currentHref === href ? null : currentHref));
                    }}
                    onClick={() => {
                      sfx.playClick();
                      setActiveHref(href);
                    }}
                    className={`group relative py-2 text-[10px] font-black uppercase tracking-[0.32em] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:text-[11px] lg:tracking-[0.4em] ${
                      isHighlighted || isActive ? "text-white" : "text-white/68 hover:text-white/92"
                    }`}
                  >
                    {isHighlighted ? (
                      <>
                        <motion.span
                          layoutId="desktop-nav-indicator"
                          transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.72 }}
                          className="absolute inset-x-0 -bottom-[8px] h-px bg-[linear-gradient(90deg,transparent,rgba(70,181,255,0.24),#46b5ff,rgba(70,181,255,0.24),transparent)]"
                        />
                        <motion.span
                          layoutId="desktop-nav-indicator-line"
                          transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.72 }}
                          className="absolute left-1/2 top-1/2 h-6 w-14 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_54%,transparent_76%)]"
                        />
                      </>
                    ) : null}

                    <span className="relative z-10 flex items-center gap-2">
                      <motion.span
                        animate={{
                          scale: isActive ? 1 : 0.55,
                          opacity: isActive ? 1 : 0.24,
                          backgroundColor:
                            isActive && shouldShowDesktopAccent ? "rgb(70 181 255)" : "rgba(255,255,255,0.28)",
                          boxShadow:
                            isActive && shouldShowDesktopAccent
                              ? "0 0 12px rgba(70,181,255,0.5)"
                              : "0 0 0 rgba(0,0,0,0)",
                        }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        className="h-[5px] w-[5px] shrink-0 rounded-full"
                      />
                      <span>{label}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </LayoutGroup>
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
          {navItems.map(({ label, href }, index) => (
            <Link
              key={label}
              href={href}
              onClick={() => {
                sfx.playClick();
                setIsMenuOpen(false);
                setActiveHref(href);
              }}
              className={`flex items-center justify-between border px-4 py-3 text-[11px] font-black uppercase tracking-[0.28em] transition-colors ${
                activeHref === href
                  ? "border-[#46b5ff]/28 bg-[linear-gradient(90deg,rgba(70,181,255,0.16),rgba(255,255,255,0.04))] text-white"
                  : "border-white/10 text-white/82 hover:bg-white/8"
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`h-[5px] w-[5px] rounded-full ${
                    activeHref === href ? "bg-[#46b5ff] shadow-[0_0_12px_rgba(70,181,255,0.55)]" : "bg-white/24"
                  }`}
                />
                <span>{label}</span>
              </span>
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
