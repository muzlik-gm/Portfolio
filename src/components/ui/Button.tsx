"use client";

import { motion } from "framer-motion";
import { ReactNode, useRef, useEffect } from "react";
import { theme, motionVariants } from "@/lib/theme";
import { useReducedMotion } from "@/hooks/useReducedMotion";
// @ts-ignore - Anime.js has complex module structure
import { animate } from "animejs";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  href?: string;
  className?: string;
  disabled?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  href,
  className = "",
  disabled = false
}: ButtonProps) {
  const prefersReducedMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-primary to-secondary text-background font-semibold hover:from-secondary hover:to-primary shadow-medium hover:shadow-strong border border-primary/20",
    secondary: "bg-background/80 backdrop-blur-sm text-foreground border-2 border-accent/40 hover:border-accent hover:bg-accent/10 font-medium shadow-soft hover:shadow-medium",
    ghost: "text-foreground hover:text-accent hover:bg-surface/50 border border-transparent hover:border-accent/20"
  };
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl", 
    lg: "px-8 py-4 text-lg rounded-2xl"
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const MotionComponent = motion.button;

  // Anime.js hover and press animations
  useEffect(() => {
    if (prefersReducedMotion || disabled) return;

    const element = buttonRef.current || linkRef.current;
    if (!element) return;

    const handleMouseEnter = () => {
      animate(element, {
        scale: 0.95,
        duration: 200,
        easing: 'cubicBezier(0.25, 0.46, 0.45, 0.94)'
      });
    };

    const handleMouseLeave = () => {
      animate(element, {
        scale: 1,
        duration: 500,
        easing: 'spring(1, 80, 10, 0)'
      });
    };

    const handleMouseDown = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      // Create ripple effect
      const rect = element.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      const x = mouseEvent.clientX - rect.left - size / 2;
      const y = mouseEvent.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        width: 0;
        height: 0;
        pointer-events: none;
        z-index: 10;
      `;

      element.style.position = 'relative';
      element.appendChild(ripple);

      animate(ripple, {
        width: size * 2,
        height: size * 2,
        opacity: [0.6, 0],
        duration: 600,
        easing: 'easeOutQuart',
        complete: () => {
          ripple.remove();
        }
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousedown', handleMouseDown);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousedown', handleMouseDown);
    };
  }, [prefersReducedMotion, disabled]);
  
  if (href) {
    return (
      <motion.a
        ref={linkRef}
        href={href}
        className={`${classes} relative overflow-hidden`}
        variants={motionVariants.gentleLift}
        initial="rest"
        whileHover={prefersReducedMotion ? undefined : "hover"}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as any }}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {/* Light sweep effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <span className="relative z-10">{children}</span>
      </motion.a>
    );
  }
  
  return (
    <MotionComponent
      ref={buttonRef}
      className={`${classes} relative overflow-hidden`}
      onClick={onClick}
      disabled={disabled}
      variants={motionVariants.gentleLift}
      initial="rest"
      whileHover={disabled || prefersReducedMotion ? "rest" : "hover"}
      whileTap={disabled || prefersReducedMotion ? "rest" : { scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as any }}
    >
      {/* Light sweep effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
        initial={{ x: "-100%" }}
        whileHover={disabled ? { x: "-100%" } : { x: "100%" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <span className="relative z-10">{children}</span>
    </MotionComponent>
  );
}