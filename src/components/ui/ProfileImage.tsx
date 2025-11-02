"use client";

import { motion } from "framer-motion";

export function ProfileImage({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Profile container */}
      <motion.div
        className="relative w-48 h-48 mx-auto"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <img 
            src="/blob-scene-haikei.svg" 
            alt="Profile background"
            className="w-full h-full object-cover opacity-20"
            style={{ filter: 'hue-rotate(45deg)' }}
          />
        </div>
        
        {/* Profile circle */}
        <motion.div
          className="relative w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-full border-4 border-accent/30 flex items-center justify-center overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          {/* Developer representation - static */}
          <div className="text-center space-y-2">
            <span className="text-6xl opacity-80">👨‍💻</span>
            <div className="text-2xl font-bold text-accent">H</div>
          </div>
          
          {/* Static elements */}
          <div className="absolute top-4 right-4 w-3 h-3 bg-primary/60 rounded-full" />
          <div className="absolute bottom-6 left-6 w-2 h-2 bg-secondary/60 rounded-full" />
        </motion.div>
        
        {/* Static decorative elements */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-accent/40 rounded-full" />
        <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 w-3 h-3 bg-primary/40 rounded-full" />
      </motion.div>
      
      {/* Name label */}
      <motion.div
        className="text-center mt-4"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="text-lg font-semibold text-accent">Hamza</div>
        <div className="text-sm text-foreground/60">Developer & Creator</div>
      </motion.div>
    </div>
  );
}