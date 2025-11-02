"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Simplified gradient - no mouse following */}
      <div
        className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl top-1/4 left-1/4"
        style={{
          background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
        }}
      />

      {/* Simplified static shapes - no animation */}
      {Array.from({ length: 6 }).map((_, i) => {
        const shapes = [
          <div key="circle" className="w-4 h-4 border border-accent rounded-full" />,
          <div key="square" className="w-3 h-3 bg-primary/30 transform rotate-45" />,
          <div key="line" className="w-2 h-6 bg-secondary/30 rounded-full" />
        ];
        
        return (
          <div
            key={i}
            className="absolute opacity-5"
            style={{
              left: `${15 + (i * 15)}%`,
              top: `${20 + (i % 3) * 30}%`,
            }}
          >
            {shapes[i % 3]}
          </div>
        );
      })}

      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-accent) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-accent) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Static lines - no animation */}
      <svg className="absolute inset-0 w-full h-full opacity-5">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        <path
          d="M 0 0 Q 400 200 800 400"
          stroke="url(#lineGradient)"
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />
      </svg>
    </div>
  );
}