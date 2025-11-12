"use client";

import { motion } from "framer-motion";
import { Section, Typography, Button } from "@/components/ui";
import { BreathingGlow } from "@/components/effects";
import { createWordRevealAnimation } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Atom, FileCode2, Server } from "lucide-react";
import { useEffect, useRef } from "react";

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const name = "Hamza";
  const tagline = "Providing Best Experience";
  const subtitle = "Web & Game Developer from Pakistan";
  const description = "At the Age of 17, I'm passionate towards Developement. I like Programming alot, and like to explore new things.";

  const { displayText: typedDescription, isComplete: typingComplete } = useTypingEffect(description, 50);

  // Refs for Anime.js animations
  const taglineRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  // Intersection observer for trigger animations
  const { ref: heroRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true
  });

  // Apply word-by-word reveal animations
  useEffect(() => {
    if (!prefersReducedMotion && isIntersecting) {
      if (nameRef.current) {
        const letters = nameRef.current.querySelectorAll('.hero-letter');
        createWordRevealAnimation(letters, {
          stagger: 80,
          rotationalBias: true,
          delay: 200
        });
      }

      if (taglineRef.current) {
        const words = taglineRef.current.querySelectorAll('.tagline-word');
        createWordRevealAnimation(words, {
          stagger: 120,
          rotationalBias: true,
          delay: 800
        });
      }
    }
  }, [isIntersecting, prefersReducedMotion]);

  const taglineWords = tagline.split(" ");

  return (
    <div ref={heroRef as any}>
      <Section
        id="home"
        className="hero-section hero-grid relative overflow-hidden flex items-center justify-center pt-20 md:pt-24"
        fullHeight={true}
      >
      {/* Full Screen Interactive Spline Scene */}
      {/* Replace "YOUR_SPLINE_URL_HERE" with your actual Spline scene URL */}
      {/* Example: https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode */}
      <div 
        className="absolute inset-0"
        style={{ 
          zIndex: 1,
          pointerEvents: 'auto'
        }}
        dangerouslySetInnerHTML={{
          __html: `
            <script type="module" src="https://unpkg.com/@splinetool/viewer@1.10.99/build/spline-viewer.js"></script>
            <script type="module" src="https://unpkg.com/@splinetool/viewer@1.10.99/build/spline-viewer.js" async></script>
<spline-viewer hint loading-anim-type="spinner-small-light" url="https://prod.spline.design/ph3u4tmokFXXGnUw/scene.splinecode"><img src="data:image/png;base64,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" alt="Spline preview" style="width: 100%; height: 100%;"/></spline-viewer>
          `
        }}
      />

      {/* Stylish Overlays and Visual Effects */}
      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        {/* Top gradient fade */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background via-background/50 to-transparent" />
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/70 to-transparent" />
        
        {/* Left side gradient */}
        <div className="absolute top-0 bottom-0 left-0 w-48 bg-gradient-to-r from-background/80 via-background/30 to-transparent" />
        
        {/* Right side gradient */}
        <div className="absolute top-0 bottom-0 right-0 w-48 bg-gradient-to-l from-background/80 via-background/30 to-transparent" />
      </div>

      {/* Robot Context UI - Floating Code Windows & Holographic Panels */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        
        {/* Floating Code Window - Top Right (moved further right and up) */}
        <motion.div
          className="absolute top-20 right-4 md:right-8 lg:right-16 bg-background/80 backdrop-blur-md border border-accent/20 rounded-lg p-3 shadow-2xl w-48 md:w-56"
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs text-foreground/50 font-mono">app.tsx</span>
          </div>
          <div className="font-mono text-xs space-y-1">
            <div className="text-purple-400">const <span className="text-blue-400">buildProject</span> = () =&gt; {'{'}</div>
            <div className="text-foreground/60 pl-4">console.log(<span className="text-green-400">'Building...'</span>);</div>
            <div className="text-foreground/60 pl-4">deploy();</div>
            <div className="text-purple-400">{'}'}</div>
          </div>
          <motion.div 
            className="mt-2 h-1 bg-accent/20 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 2, duration: 3, repeat: Infinity }}
          >
            <motion.div 
              className="h-full bg-accent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </motion.div>

        {/* Terminal Output - Moved to bottom right near robot */}
        <motion.div
          className="absolute bottom-4 right-[25%] md:right-[28%] lg:right-[30%] bg-black/70 backdrop-blur-md border border-green-500/30 rounded-lg p-3 shadow-2xl w-48"
          initial={{ opacity: 0, y: 20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-400 font-mono">terminal</span>
          </div>
          <div className="font-mono text-xs space-y-1">
            <div className="text-green-400">$ npm run build</div>
            <div className="text-green-300/60">✓ Compiled successfully</div>
            <div className="text-green-300/60">✓ 127 modules transformed</div>
            <div className="text-green-400 flex items-center gap-1">
              <span>$</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                _
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* Stats Panel - Moved to left side, more compact */}
        <motion.div
          className="absolute top-1/3 left-4 md:left-8 lg:left-12 bg-background/70 backdrop-blur-md border border-primary/20 rounded-lg p-2.5 shadow-2xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
        >
          <div className="text-[10px] font-semibold text-foreground/70 mb-1.5">System Status</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-foreground/50 w-16">Perf</span>
              <div className="flex items-center gap-1">
                <div className="w-10 h-1 bg-foreground/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-green-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "95%" }}
                    transition={{ delay: 2.5, duration: 1 }}
                  />
                </div>
                <span className="text-[10px] text-green-500 font-mono">95%</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-foreground/50 w-16">Uptime</span>
              <span className="text-[10px] text-accent font-mono">24/7</span>
            </div>
          </div>
        </motion.div>

        {/* Holographic Ring around robot area */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border-2 border-accent/20"
          animate={prefersReducedMotion ? undefined : {
            rotate: 360,
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{
            background: 'radial-gradient(circle, transparent 60%, rgba(139, 99, 92, 0.05) 100%)',
          }}
        />

        {/* Floating Tech Icons - repositioned around robot */}
        <motion.div
          className="absolute top-[35%] right-[28%] bg-accent/10 backdrop-blur-sm border border-accent/30 rounded-lg p-2"
          animate={prefersReducedMotion ? undefined : {
            y: [-10, 10, -10],
            rotate: [-5, 5, -5],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <FileCode2 className="w-5 h-5 text-accent" />
        </motion.div>

        <motion.div
          className="absolute bottom-[35%] right-[20%] bg-primary/10 backdrop-blur-sm border border-primary/30 rounded-lg p-2"
          animate={prefersReducedMotion ? undefined : {
            y: [10, -10, 10],
            rotate: [5, -5, 5],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Server className="w-5 h-5 text-primary" />
        </motion.div>

      </div>
      <div className="absolute top-24 left-6 md:left-12 z-10 max-w-md space-y-4" style={{ pointerEvents: 'auto' }}>
          {/* Animated Name */}
          <BreathingGlow intensity="medium" className="inline-block">
            <div
              ref={nameRef}
              className="typography-hero font-bold text-foreground text-left"
              data-scroll-reveal="words"
            >
              {name.split('').map((letter, index) => (
                <span
                  key={index}
                  className="hero-letter inline-block"
                  style={{
                    opacity: prefersReducedMotion ? 1 : 0,
                    transform: prefersReducedMotion ? 'none' : 'translateY(30px) scale(0.9) rotateX(10deg)'
                  }}
                >
                  {letter}
                </span>
              ))}
            </div>
          </BreathingGlow>

          {/* Animated Tagline */}
          <div
            ref={taglineRef}
            className="typography-heading text-foreground font-medium text-left"
            data-scroll-reveal="words"
          >
            {taglineWords.map((word, index) => (
              <span
                key={index}
                className="tagline-word inline-block mr-3"
                style={{
                  opacity: prefersReducedMotion ? 1 : 0,
                  transform: prefersReducedMotion ? 'none' : 'translateY(30px) scale(0.9) rotateX(10deg)'
                }}
              >
                {word}
              </span>
            ))}
          </div>

          {/* Subtitle */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0.01 } : { delay: 2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Typography variant="subheading" className="text-foreground/70 font-normal text-left">
              {subtitle}
            </Typography>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0.01 } : { delay: 2.5, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Typography variant="body" className="text-foreground/80 leading-relaxed text-left">
              {typedDescription}
              {!typingComplete && (
                <motion.span
                  className="inline-block w-0.5 h-5 bg-accent ml-1"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
            </Typography>
          </motion.div>
      </div>

      {/* CTA Buttons - Bottom Right Corner */}
      <div className="absolute bottom-16 right-6 md:right-12 z-10" style={{ pointerEvents: 'auto' }}>
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0.01 } : { delay: 3, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col sm:flex-row gap-4"
        >
            <Button 
              href="#projects" 
              size="lg" 
              className="min-w-[160px] group cursor-target"
            >
              View My Work
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Button>
            <Button 
              href="#contact" 
              variant="secondary" 
              size="lg" 
              className="min-w-[160px] cursor-target"
            >
              Let's Connect
            </Button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20"
        initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? { duration: 0.01 } : { delay: 4, duration: 0.8 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-accent/30 rounded-full flex justify-center bg-background/20 backdrop-blur-sm"
          animate={prefersReducedMotion ? undefined : {
            borderColor: ["rgba(139, 99, 92, 0.3)", "rgba(139, 99, 92, 0.8)", "rgba(139, 99, 92, 0.3)"]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-accent rounded-full mt-2"
            animate={prefersReducedMotion ? undefined : { y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        <div className="text-xs text-foreground/50 mt-2 text-center font-medium bg-background/30 backdrop-blur-sm rounded px-2 py-1">
          Scroll to explore
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 opacity-30">
        <Atom className="w-6 h-6 animate-pulse text-accent" />
      </div>
      <div className="absolute top-1/3 right-16 opacity-40">
        <FileCode2 
          className="w-4 h-4 animate-pulse text-primary"
          style={{ animationDelay: "1s" }}
        />
      </div>
      <div className="absolute bottom-1/4 left-1/4 opacity-35">
        <Server 
          className="w-5 h-5 animate-pulse text-secondary"
          style={{ animationDelay: "2s" }}
        />
      </div>
    </Section>
    </div>
  );
}