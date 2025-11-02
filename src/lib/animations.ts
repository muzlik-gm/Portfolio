// Animation utilities and configurations
import { Variants } from "framer-motion";

// Word-by-word text reveal animation
export const createWordRevealVariants = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: delay + i * 0.1,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  })
});

// Staggered container animation
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Breathing glow effect
export const breathingGlow: Variants = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(221, 215, 141, 0.3)",
      "0 0 40px rgba(221, 215, 141, 0.5)", 
      "0 0 20px rgba(221, 215, 141, 0.3)"
    ],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Light sweep effect for hover interactions
export const lightSweep: Variants = {
  initial: { x: "-100%", opacity: 0 },
  animate: { 
    x: "100%", 
    opacity: [0, 1, 0],
    transition: { 
      duration: 0.6, 
      ease: "easeOut" 
    }
  }
};

// Parallax scroll effect
export const parallaxVariants = {
  slow: { y: "-20%" },
  medium: { y: "-50%" },
  fast: { y: "-80%" }
};

// Page transition variants
export const pageTransition: Variants = {
  initial: { 
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  animate: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Scroll-triggered reveal animation
export const scrollReveal: Variants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Magnetic hover effect
export const magneticHover = {
  rest: { x: 0, y: 0 },
  hover: { 
    x: 0, 
    y: -8,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 20 
    }
  }
};

// Utility function to create custom easing
export const customEasing = [0.25, 0.46, 0.45, 0.94];

// Reduced motion variants for accessibility
export const createReducedMotionVariants = (variants: Variants): Variants => {
  const reducedVariants: Variants = {};
  
  Object.keys(variants).forEach(key => {
    const variant = variants[key];
    if (typeof variant === 'object' && variant !== null) {
      reducedVariants[key] = {
        ...variant,
        transition: { duration: 0.01 }
      };
    } else {
      reducedVariants[key] = variant;
    }
  });
  
  return reducedVariants;
};