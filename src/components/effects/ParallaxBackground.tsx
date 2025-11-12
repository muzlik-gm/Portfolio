"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { animate } from 'animejs';

interface ParallaxLayer {
  speed: "slow" | "medium" | "fast";
  translateX?: number;
  translateY?: number;
}

interface ParallaxBackgroundProps {
  children?: React.ReactNode;
  layers?: ParallaxLayer[];
  speed?: "slow" | "medium" | "fast";
  className?: string;
  enableXY?: boolean;
}

export function ParallaxBackground({
  children,
  layers,
  speed = "medium",
  className = "",
  enableXY = false
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getSpeedMultiplier = (speed: "slow" | "medium" | "fast") => ({
    slow: 0.2,
    medium: 0.5,
    fast: 0.8
  }[speed]);

  const getViewportScale = () => {
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const scrollY = window.pageYOffset;
    const scrollX = window.pageXOffset;

    // Scale effects based on viewport position (0-1)
    const yScale = Math.min(scrollY / viewportHeight, 1);
    const xScale = Math.min(scrollX / viewportWidth, 1);

    return { yScale, xScale };
  };

  const calculateParallaxValues = useCallback((
    layerSpeed: "slow" | "medium" | "fast",
    scrolled: number,
    scrollX: number = 0
  ) => {
    const multiplier = getSpeedMultiplier(layerSpeed);
    const { yScale, xScale } = getViewportScale();

    // Scale translate values (±2-8px range)
    const baseY = scrolled * -multiplier;
    const scaledY = baseY * (0.8 + yScale * 0.4); // Range: 0.8-1.2

    let translateX = 0;
    let translateY = scaledY;

    if (enableXY) {
      // Add subtle X movement based on scroll position
      translateX = scrollX * multiplier * (0.2 + xScale * 0.3) * (Math.random() > 0.5 ? 1 : -1);
      // Clamp to ±8px range
      translateX = Math.max(-8, Math.min(8, translateX));
    }

    // Clamp Y to ±8px range for subtle effects
    translateY = Math.max(-8, Math.min(8, translateY));

    return { translateX, translateY };
  }, [enableXY]);

  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Debounce scroll events and add delay
    scrollTimeoutRef.current = setTimeout(() => {
      const element = ref.current;
      if (!element) return;

      const scrolled = window.pageYOffset;
      const scrollX = window.pageXOffset;

      if (layers && layers.length > 0) {
        // Multi-layer parallax
        const layerElements = element.querySelectorAll('[data-parallax-layer]');
        layers.forEach((layer, index) => {
          const layerElement = layerElements[index] as HTMLElement;
          if (layerElement) {
            const { translateX, translateY } = calculateParallaxValues(
              layer.speed,
              scrolled,
              scrollX
            );

            // Create smooth animation
            if (animationRef.current) {
              animationRef.current.pause();
            }

            animationRef.current = animate(layerElement, {
              translateX: translateX + (layer.translateX || 0),
              translateY: translateY + (layer.translateY || 0),
              duration: 300,
              easing: 'easeOutQuad'
            });
          }
        });
      } else {
        // Single layer parallax
        const { translateX, translateY } = calculateParallaxValues(speed, scrolled, scrollX);

        animate(element, {
          translateX: translateX,
          translateY: translateY,
          duration: 300,
          easing: 'easeOutQuad'
        });
      }
    }, 100 + Math.random() * 200); // Random delay between 100-300ms
  }, [layers, speed, calculateParallaxValues]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Add will-change for GPU acceleration
    element.style.willChange = 'transform';

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initialize multi-layer elements
    if (layers && layers.length > 0) {
      layers.forEach((layer, index) => {
        const layerDiv = document.createElement('div');
        layerDiv.setAttribute('data-parallax-layer', index.toString());
        layerDiv.style.willChange = 'transform';
        layerDiv.style.position = 'absolute';
        layerDiv.style.inset = '0';
        layerDiv.style.pointerEvents = 'none';
        element.appendChild(layerDiv);
      });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (animationRef.current) {
        animationRef.current.pause();
      }
      element.style.willChange = 'auto';
    };
  }, [handleScroll, layers]);

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