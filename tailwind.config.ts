import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        // Warm neutral palette
        flax: "#ddd78d",
        ecru: "#dcbf85", 
        "rose-taupe": "#8b635c",
        walnut: "#60594d",
        "ash-gray": "#93a29b",
        
        // Semantic colors
        primary: "#ddd78d", // flax
        secondary: "#dcbf85", // ecru
        accent: "#8b635c", // rose-taupe
        neutral: "#60594d", // walnut
        surface: "rgba(147, 162, 155, 0.1)", // ash-gray with opacity
        
        background: "#fafaf9",
        foreground: "#60594d",
      },
      fontSize: {
        // Cinematic typography scale
        "hero": ["clamp(3rem, 8vw, 6rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "heading": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.2" }],
        "subheading": ["clamp(1.5rem, 3vw, 2rem)", { lineHeight: "1.3" }],
        "body": ["clamp(1rem, 2vw, 1.125rem)", { lineHeight: "1.6" }],
      },
      spacing: {
        // Breathing room focused spacing
        "section": "clamp(4rem, 10vh, 8rem)",
        "component": "clamp(2rem, 5vw, 4rem)",
        "element": "clamp(0.5rem, 2vw, 1rem)",
      },
      animation: {
        // Subtle, refined animations
        "breathe": "breathe 4s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
        "light-sweep": "lightSweep 0.6s ease-out forwards",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(60px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        lightSweep: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "soft": "0 4px 20px rgba(139, 99, 92, 0.1)",
        "medium": "0 8px 30px rgba(139, 99, 92, 0.15)",
        "strong": "0 20px 40px rgba(139, 99, 92, 0.2)",
      },
      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
    },
  },
  plugins: [],
};

export default config;