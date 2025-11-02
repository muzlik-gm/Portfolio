"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { theme, motionVariants } from "@/lib/theme";

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
  
  if (href) {
    return (
      <motion.a
        href={href}
        className={`${classes} relative overflow-hidden`}
        variants={motionVariants.gentleLift}
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: 0.98 }}
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
      className={`${classes} relative overflow-hidden`}
      onClick={onClick}
      disabled={disabled}
      variants={motionVariants.gentleLift}
      initial="rest"
      whileHover={disabled ? "rest" : "hover"}
      whileTap={disabled ? "rest" : { scale: 0.98 }}
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