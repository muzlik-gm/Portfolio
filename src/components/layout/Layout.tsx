"use client";

import { ReactNode, Suspense, useEffect } from "react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { ErrorBoundary } from "./ErrorBoundary";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useScrollAnimations } from "@/hooks/useScrollAnimations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { SkipLink } from "@/components/accessibility";

// Lazy load effects for better performance
import dynamic from "next/dynamic";

const LoadingAnimation = dynamic(() => import("@/components/effects/LoadingAnimation").then(mod => mod.LoadingAnimation), {
  ssr: false
});

const AnimatedBackground = dynamic(() => import("@/components/effects/AnimatedBackground").then(mod => mod.AnimatedBackground), {
  ssr: false
});

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const disableBackground = isMobile || prefersReducedMotion;
  
  // Initialize smooth scrolling and animations
  const lenisRef = useSmoothScroll();
  useScrollAnimations();
  
  // Disable smooth scroll if reduced motion is preferred
  useEffect(() => {
    if (prefersReducedMotion && lenisRef.current) {
      lenisRef.current.destroy();
    }
  }, [prefersReducedMotion, lenisRef]);

  return (
    <ErrorBoundary>
      {/* Accessibility */}
      <SkipLink />

      {/* Performance optimized effects */}
      <Suspense fallback={null}>
        {!prefersReducedMotion && (
          <LoadingAnimation />
        )}
        {!disableBackground && (
          <AnimatedBackground />
        )}
      </Suspense>

      <div className="min-h-screen bg-background text-foreground relative z-10">
        <Navigation />
        <main id="main-content" className="relative" role="main">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
