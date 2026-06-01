"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
}

export default function Button({ children, variant = "secondary", className = "", onClick }: ButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <motion.button
      whileHover={{ scale: 0.985 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`group relative flex items-center gap-4 rounded-full py-2 pl-6 pr-2 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        isPrimary 
          ? "bg-[#0066b1] text-white hover:bg-[#00a0e9] hover:shadow-[0_0_25px_rgba(0,160,233,0.3)]" 
          : "bg-white/5 text-white ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/20"
      } ${className}`}
    >
      <span className="text-[10px] font-black uppercase tracking-[0.4em]">{children}</span>
      <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
        isPrimary ? "bg-white/20" : "bg-white/10"
      }`}>
        <ArrowRight className="h-4 w-4" />
      </div>
    </motion.button>
  );
}
