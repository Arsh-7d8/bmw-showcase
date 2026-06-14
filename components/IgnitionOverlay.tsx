"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sfx } from "@/lib/audio";

export default function IgnitionOverlay({ onIgnite }: { onIgnite: () => void }) {
  const [isActive, setIsActive] = useState(true);

  const handleIgnite = () => {
    sfx.init();
    sfx.playClick();
    setIsActive(false);
    
    // Unlock body scroll and trigger main logic
    setTimeout(() => {
      onIgnite();
    }, 150);
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, pointerEvents: "none" }}
          transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020305] backdrop-blur-md"
        >
          <button
            type="button"
            onClick={handleIgnite}
            onMouseEnter={() => { sfx.init(); sfx.playHover(); }}
            className="group relative flex overflow-hidden rounded-full border border-white/20 bg-transparent px-10 py-5 transition-all duration-700 hover:border-white/60 hover:bg-white/5"
          >
            <div className="absolute inset-0 z-0 bg-white/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="relative z-10 font-satoshi text-xs font-black uppercase tracking-[0.4em] text-white">
              Start Engine
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
