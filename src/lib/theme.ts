// Theme configuration and design tokens
export const theme = {
  colors: {
    // Primary palette - warm neutrals
    flax: "#ddd78d",
    ecru: "#dcbf85", 
    roseTaupe: "#8b635c",
    walnut: "#60594d",
    ashGray: "#93a29b",
    
    // Semantic colors
    primary: "#ddd78d", // flax
    secondary: "#dcbf85", // ecru
    accent: "#8b635c", // rose-taupe
    neutral: "#60594d", // walnut
    background: "#fafaf9",
    foreground: "#60594d",
    surface: "rgba(147, 162, 155, 0.1)",
  },
  
  typography: {
    fontFamily: "var(--font-inter)",
    scales: {
      hero: "clamp(3rem, 8vw, 6rem)",
      heading: "clamp(2rem, 4vw, 3rem)",
      subheading: "clamp(1.5rem, 3vw, 2rem)",
      body: "clamp(1rem, 2vw, 1.125rem)",
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  spacing: {
    section: "clamp(4rem, 10vh, 8rem)",
    component: "clamp(2rem, 5vw, 4rem)",
    element: "clamp(0.5rem, 2vw, 1rem)",
  },
  
  animation: {
    // Subtle, refined timing
    durations: {
      fast: "0.2s",
      normal: "0.3s",
      slow: "0.8s",
      breathe: "4s",
    },
    easings: {
      smooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      ease: "ease-in-out",
    },
  },
  
  shadows: {
    soft: "0 4px 20px rgba(139, 99, 92, 0.1)",
    medium: "0 8px 30px rgba(139, 99, 92, 0.15)",
    strong: "0 20px 40px rgba(139, 99, 92, 0.2)",
  },
  
  breakpoints: {
    mobile: "320px",
    tablet: "768px", 
    desktop: "1024px",
    wide: "1400px",
  },
} as const;

// Animation variants for Framer Motion
export const motionVariants = {
  // Fade in up animation
  fadeInUp: {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  
  // Stagger container for multiple elements
  staggerContainer: {
    animate: { 
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2 
      } 
    }
  },
  
  // Breathing animation for signature elements
  breathe: {
    animate: { 
      scale: [1, 1.02, 1],
      transition: { 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }
    }
  },
  
  // Light sweep effect
  lightSweep: {
    initial: { x: "-100%" },
    animate: { x: "100%" },
    transition: { duration: 0.6, ease: "easeOut" }
  },
  
  // Gentle lift on hover
  gentleLift: {
    rest: { y: 0, scale: 1 },
    hover: { 
      y: -8, 
      scale: 1.02
    }
  },
  
  // Page transition
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

// Scroll animation configurations for GSAP
export const scrollAnimations = {
  hero: {
    trigger: '.hero-section',
    start: 'top center',
    end: 'bottom center',
    scrub: 1,
  },
  
  projects: {
    trigger: '.projects-section', 
    start: 'top 80%',
    stagger: 0.2,
  },
  
  about: {
    trigger: '.about-section',
    start: 'top 70%',
    scrub: 0.5,
  },
  
  contact: {
    trigger: '.contact-section',
    start: 'top 80%',
  }
};

export type Theme = typeof theme;
export type MotionVariants = typeof motionVariants;