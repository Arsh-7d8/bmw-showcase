"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function CreativeScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <div className="fixed left-0 top-0 z-40 h-[2px] w-full origin-left bg-white/[0.02]">
      <motion.div
        className="h-full bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(0,160,233,1)_48%,rgba(0,102,177,1)_100%)] shadow-[0_0_15px_rgba(0,160,233,0.5)]"
        style={{ scaleX }}
      />
    </div>
  );
}
