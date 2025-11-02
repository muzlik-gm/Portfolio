// Application constants and configuration
export const APP_CONFIG = {
  name: "Hamza Portfolio",
  version: "1.0.0",
  author: "Hamza",
  description: "Portfolio of Hamza, a 17-year-old web and game developer from Pakistan",
  url: "https://hamza-portfolio.vercel.app",
  
  // Performance settings
  performance: {
    targetFPS: 60,
    maxAnimationDuration: 2000,
    debounceDelay: 100,
    throttleDelay: 16, // ~60fps
  },
  
  // Animation settings
  animations: {
    defaultDuration: 0.6,
    defaultEasing: [0.25, 0.46, 0.45, 0.94] as const,
    staggerDelay: 0.1,
    reducedMotionDuration: 0.01,
  },
  
  // Breakpoints
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
  },
  
  // Contact information
  contact: {
    email: "hamza@example.com",
    location: "Pakistan",
    timezone: "PKT",
    availability: "Available for freelance projects",
  },
  
  // Social links
  social: {
    github: "https://github.com/hamza",
    linkedin: "https://linkedin.com/in/hamza",
    twitter: "https://twitter.com/hamza",
    discord: "https://discord.com/users/hamza",
  },
} as const;

export const FEATURE_FLAGS = {
  enableCursorTrail: true,
  enableMorphingShapes: true,
  enableLoadingAnimation: true,
  enableWebVitals: process.env.NODE_ENV === 'production',
  enableSmoothScroll: true,
} as const;