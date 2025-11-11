"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scrollToElement } from "@/lib/utils";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface NavigationProps {
  className?: string;
}

const navigationItems = [
  { id: "home", label: "Home", href: "/" },
  { id: "about", label: "About", href: "/about" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "contact", label: "Contact", href: "/contact" },
];

export function Navigation({ className = "" }: NavigationProps) {
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lenis = useSmoothScroll();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    
    // Set initial active section based on current path
    const path = window.location.pathname;
    const currentItem = navigationItems.find(item => item.href === path);
    if (currentItem) {
      setActiveSection(currentItem.id);
    } else {
      setActiveSection("home");
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Only update active section on home page
      if (window.location.pathname === "/") {
        const sections = navigationItems.map(item => item.id);
        const currentSection = sections.find(section => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
          }
          return false;
        });
        
        if (currentSection) {
          setActiveSection(currentSection);
        }
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleNavClick = (item: typeof navigationItems[0]) => {
    setActiveSection(item.id);
    if (item.href) {
      // Use Next.js navigation instead of direct window.location
      const currentPath = window.location.pathname;
      if (currentPath !== item.href) {
        window.location.href = item.href;
      } else {
        if (lenis.current && !prefersReducedMotion) {
          lenis.current.scrollTo(`#${item.id}`, { offset: -80 });
        } else {
          scrollToElement(item.id, 80);
        }
      }
    } else {
      if (lenis.current && !prefersReducedMotion) {
        lenis.current.scrollTo(`#${item.id}`, { offset: -80 });
      } else {
        scrollToElement(item.id, 80);
      }
    }
  };

  if (isMobile) {
    return <MobileNavigation activeSection={activeSection} onNavClick={handleNavClick} />;
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${className}`}
      initial={prefersReducedMotion ? { y: 0 } : { y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="container mx-auto px-6">
        <motion.div
          className={`flex items-center justify-between py-4 transition-all duration-300 ${
            isScrolled 
              ? "bg-background/80 backdrop-blur-md rounded-2xl mt-4 px-6 shadow-soft border border-accent/10" 
              : "bg-transparent"
          }`}
          layout
        >
          {/* Logo */}
          <motion.div
            className="text-xl font-semibold text-foreground"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Hamza
          </motion.div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-8">
            {navigationItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                  activeSection === item.id 
                    ? "text-accent" 
                    : "text-foreground/70 hover:text-foreground"
                }`}
                whileHover={prefersReducedMotion ? {} : { y: -2 }}
                whileTap={prefersReducedMotion ? {} : { y: 0 }}
              >
                {item.label}
                
                {/* Active indicator */}
                <AnimatePresence>
                  {activeSection === item.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full"
                      layoutId="activeIndicator"
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      exit={{ opacity: 0, scaleX: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>

          {/* Scroll Progress Indicator */}
          <ScrollProgress />
        </motion.div>
      </div>
    </motion.nav>
  );
}

function MobileNavigation({
  activeSection,
  onNavClick
}: {
  activeSection: string;
  onNavClick: (item: typeof navigationItems[0]) => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.nav
      className="fixed bottom-6 left-6 right-6 z-50"
      initial={prefersReducedMotion ? { y: 0 } : { y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="bg-background/90 backdrop-blur-md rounded-2xl border border-accent/10 shadow-medium">
        <div className="flex items-center justify-around py-3">
          {navigationItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => onNavClick(item)}
              className={`relative flex flex-col items-center px-4 py-2 ${
                activeSection === item.id 
                  ? "text-accent" 
                  : "text-foreground/70"
              }`}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
            >
              <div className={`w-2 h-2 rounded-full mb-1 transition-colors duration-300 ${
                activeSection === item.id ? "bg-accent" : "bg-foreground/30"
              }`} />
              <span className="text-xs font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}

function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-16 h-1 bg-surface rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-accent rounded-full"
        style={{ scaleX: scrollProgress }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}