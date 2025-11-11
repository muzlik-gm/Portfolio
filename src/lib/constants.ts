// Application constants and configuration
export const APP_CONFIG = {
  name: process.env.SITE_NAME || "Hamza Portfolio",
  version: "1.0.0",
  author: process.env.SITE_AUTHOR || "Hamza",
  description: process.env.SITE_DESCRIPTION || "Portfolio of Hamza, a 17-year-old web and game developer from Pakistan",
  url: process.env.SITE_URL || "https://muzlik.vercel.app",

  // SEO settings
  seo: {
    title: process.env.SEO_TITLE || "Hamza - Web & Game Developer",
    description: process.env.SEO_DESCRIPTION || "Portfolio of Hamza, a 17-year-old web and game developer from Pakistan",
    keywords: process.env.SEO_KEYWORDS || "web developer, game developer, React, Next.js, Unity",
  },

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

  // Theme settings (for future dark mode implementation)
  theme: {
    defaultMode: process.env.THEME_DEFAULT || "light",
    enableDarkMode: process.env.ENABLE_DARK_MODE === "true",
  },

  // Contact information (now configurable via environment variables)
  contact: {
    email: process.env.CONTACT_EMAIL || "hamza@example.com",
    location: process.env.CONTACT_LOCATION || "Pakistan",
    timezone: process.env.CONTACT_TIMEZONE || "PKT",
    availability: process.env.CONTACT_AVAILABILITY || "Available for freelance projects",
  },

  // Social links (now configurable via environment variables)
  social: {
    github: process.env.SOCIAL_GITHUB || "https://github.com/hamza",
    linkedin: process.env.SOCIAL_LINKEDIN || "https://linkedin.com/in/hamza",
    twitter: process.env.SOCIAL_TWITTER || "https://twitter.com/hamza",
    discord: process.env.SOCIAL_DISCORD || "https://discord.com/users/hamza",
  },

  // Feature flags
  features: {
    enableBlog: process.env.ENABLE_BLOG !== "false",
    enableProjects: process.env.ENABLE_PROJECTS !== "false",
    enableContact: process.env.ENABLE_CONTACT !== "false",
    enableAnalytics: process.env.ENABLE_ANALYTICS === "true",
  },
} as const;

export const FEATURE_FLAGS = {
  enableCursorTrail: true,
  enableMorphingShapes: true,
  enableLoadingAnimation: true,
  enableWebVitals: process.env.NODE_ENV === 'production',
  enableSmoothScroll: true,
} as const;