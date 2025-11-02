"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function MorphingShapes() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Primary Morphing Shape */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-64 h-64 opacity-20"
        animate={{
          borderRadius: [
            "60% 40% 30% 70%",
            "30% 60% 70% 40%", 
            "50% 60% 30% 60%",
            "60% 40% 30% 70%"
          ],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background: "linear-gradient(45deg, var(--color-primary), var(--color-accent))",
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />

      {/* Secondary Shape */}
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-48 h-48 opacity-15"
        animate={{
          borderRadius: [
            "40% 60% 60% 40%",
            "60% 40% 40% 60%",
            "50% 50% 50% 50%",
            "40% 60% 60% 40%"
          ],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: "linear-gradient(135deg, var(--color-secondary), var(--color-ash-gray))",
          transform: `translateY(${scrollY * -0.05}px)`,
        }}
      />

      {/* Tertiary Shape */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-32 h-32 opacity-10"
        animate={{
          borderRadius: [
            "20% 80% 80% 20%",
            "80% 20% 20% 80%",
            "50% 50% 50% 50%",
            "20% 80% 80% 20%"
          ],
          x: [-50, 50, -50],
          y: [-30, 30, -30],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: "radial-gradient(circle, var(--color-accent), transparent)",
          transform: `translate(-50%, -50%) translateY(${scrollY * 0.08}px)`,
        }}
      />

      {/* Floating Orbs */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 rounded-full opacity-30"
          style={{
            background: i % 2 === 0 ? "var(--color-primary)" : "var(--color-accent)",
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 30}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(i) * 20, 0],
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}