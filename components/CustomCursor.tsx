"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'button' || 
          target.tagName.toLowerCase() === 'a' || 
          target.closest('button') || 
          target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 1000, damping: 50, mass: 0.1 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border border-white/[0.15] rounded-full pointer-events-none z-[9998]"
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
          scale: isHovering ? 1.4 : 1,
          backgroundColor: isHovering ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0)",
          borderColor: isHovering ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)",
        }}
        transition={{ type: "spring", stiffness: 350, damping: 35, mass: 0.4 }}
      />
      {/* Motion Blur Ghost */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border border-white/[0.05] rounded-full pointer-events-none z-[9997]"
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
          scale: isHovering ? 1.6 : 1.1,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 40, mass: 0.8 }}
      />
    </>
  );
}
