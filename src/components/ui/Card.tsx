"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { motionVariants } from "@/lib/theme";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className = "", hover = true, glow = false }: CardProps) {
  const baseClasses = "bg-surface/50 backdrop-blur-sm border border-accent/10 rounded-2xl overflow-hidden";
  const glowClasses = glow ? "shadow-medium hover:shadow-strong" : "shadow-soft";
  const classes = `${baseClasses} ${glowClasses} ${className}`;
  
  return (
    <motion.div
      className={classes}
      variants={hover ? motionVariants.gentleLift : undefined}
      initial={hover ? "rest" : undefined}
      whileHover={hover ? "hover" : undefined}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}