"use client";

import { motion } from "framer-motion";
import { ReactNode, ElementType } from "react";

interface TypographyProps {
  children: ReactNode;
  variant?: "hero" | "heading" | "subheading" | "body" | "caption";
  className?: string;
  animate?: boolean;
  as?: ElementType;
}

export function Typography({ 
  children, 
  variant = "body", 
  className = "", 
  animate = false,
  as 
}: TypographyProps) {
  const variantClasses = {
    hero: "typography-hero font-semibold text-foreground",
    heading: "typography-heading font-medium text-foreground",
    subheading: "typography-subheading font-medium text-foreground",
    body: "typography-body text-foreground/90",
    caption: "text-sm text-foreground/70"
  };
  
  const defaultTags = {
    hero: "h1",
    heading: "h2", 
    subheading: "h3",
    body: "p",
    caption: "span"
  };
  
  const Component = as || defaultTags[variant];
  const classes = `${variantClasses[variant]} ${className}`;
  
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Component className={classes}>
          {children}
        </Component>
      </motion.div>
    );
  }
  
  return (
    <Component className={classes}>
      {children}
    </Component>
  );
}