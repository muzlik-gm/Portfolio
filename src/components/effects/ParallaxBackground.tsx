"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ParallaxBackgroundProps {
  children?: React.ReactNode;
  speed?: "slow" | "medium" | "fast";
  className?: string;
}

export function ParallaxBackground({ 
  children, 
  speed = "medium", 
  className = "" 
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const speedMultipliers = {
      slow: 0.2,
      medium: 0.5,
      fast: 0.8
    };

    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const rate = scrolled * -speedMultipliers[speed];
          element.style.transform = `translateY(${rate}px)`;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      className={`parallax-${speed} ${className}`}
    >
      {children}
    </div>
  );
}

// Floating particles component for background effects
export function FloatingParticles({ count = 20 }: { count?: number }) {
  // Use deterministic positions to avoid hydration mismatch
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: (i * 37 + 23) % 100, // Deterministic positioning
    top: (i * 47 + 17) % 100,
    duration: 3 + (i % 3),
    delay: (i % 5) * 0.4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-accent/20 rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Breathing glow effect component
export function BreathingGlow({ 
  children, 
  className = "",
  intensity = "medium" 
}: { 
  children: React.ReactNode;
  className?: string;
  intensity?: "low" | "medium" | "high";
}) {
  const intensityValues = {
    low: {
      shadow: ["0 0 10px rgba(221, 215, 141, 0.2)", "0 0 20px rgba(221, 215, 141, 0.4)"],
      scale: [1, 1.01]
    },
    medium: {
      shadow: ["0 0 20px rgba(221, 215, 141, 0.3)", "0 0 40px rgba(221, 215, 141, 0.6)"],
      scale: [1, 1.02]
    },
    high: {
      shadow: ["0 0 30px rgba(221, 215, 141, 0.4)", "0 0 60px rgba(221, 215, 141, 0.8)"],
      scale: [1, 1.03]
    }
  };

  return (
    <motion.div
      className={className}
      animate={{
        boxShadow: intensityValues[intensity].shadow,
        scale: intensityValues[intensity].scale,
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}