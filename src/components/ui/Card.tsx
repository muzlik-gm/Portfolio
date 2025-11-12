"use client";

import { motion } from "framer-motion";
import { ReactNode, useRef, useEffect } from "react";
import { motionVariants } from "@/lib/theme";
import { useReducedMotion } from "@/hooks/useReducedMotion";
// @ts-ignore - Anime.js has complex module structure
import { animate } from 'animejs';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className = "", hover = true, glow = false }: CardProps) {
  const prefersReducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const baseClasses = "bg-surface/50 backdrop-blur-sm border-2 border-accent/30 rounded-2xl overflow-hidden";
  const glowClasses = glow ? "shadow-medium hover:shadow-strong" : "shadow-soft";
  const classes = `${baseClasses} ${glowClasses} ${className}`;

  // Magnetic cursor effect state
  const magneticState = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    strength: 0.3,
    animationId: null as number | null
  });

  // Anime.js card animations
  useEffect(() => {
    if (prefersReducedMotion || !hover) return;

    const element = cardRef.current;
    if (!element) return;

    let initialShadow = element.style.boxShadow || '';

    const handleMouseEnter = () => {
      // 3D depth and shadow animation
      animate(element, {
        scale: 1.005,
        rotateY: [0, 3],
        boxShadow: [
          initialShadow,
          '0 20px 40px rgba(221, 215, 141, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1)'
        ],
        duration: 400,
        easing: 'cubicBezier(0.25, 0.46, 0.45, 0.94)'
      });
    };

    const handleMouseLeave = () => {
      // Reset to original state
      animate(element, {
        scale: 1,
        rotateY: 0,
        boxShadow: initialShadow,
        duration: 600,
        easing: 'spring(1, 80, 10, 0)'
      });

      // Stop magnetic effect
      if (magneticState.current.animationId) {
        cancelAnimationFrame(magneticState.current.animationId);
        magneticState.current.animationId = null;
      }

      magneticState.current.x = 0;
      magneticState.current.y = 0;
      magneticState.current.targetX = 0;
      magneticState.current.targetY = 0;

      element.style.transform = '';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate magnetic attraction
      const deltaX = (e.clientX - centerX) * magneticState.current.strength;
      const deltaY = (e.clientY - centerY) * magneticState.current.strength;

      magneticState.current.targetX = deltaX;
      magneticState.current.targetY = deltaY;

      // Start magnetic animation loop if not already running
      if (!magneticState.current.animationId) {
        const animate = () => {
          magneticState.current.x += (magneticState.current.targetX - magneticState.current.x) * 0.1;
          magneticState.current.y += (magneticState.current.targetY - magneticState.current.y) * 0.1;

          element.style.transform = `translate(${magneticState.current.x}px, ${magneticState.current.y}px) scale(1.005) rotateY(3deg)`;

          magneticState.current.animationId = requestAnimationFrame(animate);
        };
        animate();
      }
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);

      if (magneticState.current.animationId) {
        cancelAnimationFrame(magneticState.current.animationId);
      }
    };
  }, [prefersReducedMotion, hover]);

  return (
    <motion.div
      ref={cardRef}
      className={classes}
      variants={hover && !prefersReducedMotion ? motionVariants.gentleLift : undefined}
      initial={hover && !prefersReducedMotion ? "rest" : undefined}
      whileHover={hover && !prefersReducedMotion ? "hover" : undefined}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ willChange: 'transform, box-shadow' }}
    >
      {children}
    </motion.div>
  );
}