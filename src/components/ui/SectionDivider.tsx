"use client";

import { motion } from "framer-motion";

interface SectionDividerProps {
  type?: "wave" | "layered-wave";
  className?: string;
  flip?: boolean;
}

export function SectionDivider({ 
  type = "wave", 
  className = "", 
  flip = false 
}: SectionDividerProps) {
  const imageSrc = type === "layered-wave" ? "/layered-waves-haikei.svg" : "/wave-haikei.svg";
  
  return (
    <div className={`relative w-full h-24 md:h-32 overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, y: flip ? -20 : 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <img 
          src={imageSrc}
          alt="Section divider"
          className={`w-full h-full object-cover ${flip ? 'transform rotate-180' : ''}`}
          style={{ 
            filter: 'hue-rotate(20deg) saturate(0.8)',
          }}
        />
      </motion.div>
      
      {/* Gradient overlay for better blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-transparent" />
    </div>
  );
}