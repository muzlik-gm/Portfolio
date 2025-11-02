"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Container } from "./Container";
import { motionVariants } from "@/lib/theme";

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  containerSize?: "sm" | "md" | "lg" | "full";
  fullHeight?: boolean;
  background?: "default" | "surface" | "gradient";
  spacing?: "default" | "sm" | "lg" | "none";
}

export function Section({ 
  children, 
  id, 
  className = "", 
  containerSize = "lg",
  fullHeight = true,
  background = "default",
  spacing = "default"
}: SectionProps) {
  const heightClasses = fullHeight ? "min-h-screen" : "";
  
  const spacingClasses = {
    default: "py-16 md:py-24",
    sm: "py-8 md:py-12", 
    lg: "py-24 md:py-32",
    none: ""
  };
  
  const backgroundClasses = {
    default: "",
    surface: "bg-surface/30",
    gradient: "bg-gradient-to-br from-surface/20 to-background"
  };
  
  const classes = `${heightClasses} ${spacingClasses[spacing]} ${backgroundClasses[background]} ${className}`;
  
  return (
    <motion.section
      id={id}
      className={classes}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      variants={motionVariants.fadeInUp}
    >
      <Container size={containerSize}>
        {children}
      </Container>
    </motion.section>
  );
}