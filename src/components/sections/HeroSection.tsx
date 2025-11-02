"use client";

import { motion } from "framer-motion";
import { Section, Typography, Button } from "@/components/ui";
import { ParallaxBackground, FloatingParticles, BreathingGlow } from "@/components/effects";
import { createWordRevealVariants, staggerContainer } from "@/lib/animations";
import { Atom, FileCode2, Server } from "lucide-react";

export function HeroSection() {
  const name = "Hamza";
  const tagline = "Providing Best Experience";
  const subtitle = "Web & Game Developer from Pakistan";
  
  const nameWords = name.split("");
  const taglineWords = tagline.split(" ");

  return (
    <Section 
      id="home" 
      className="hero-section hero-grid relative overflow-hidden flex items-center justify-center pt-20 md:pt-24"
      fullHeight={true}
    >
      {/* Stable Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Static Background Layer */}
        <div className="absolute inset-0">
          {/* Haikei blob scene background */}
          <div className="absolute inset-0 opacity-30">
            <img 
              src="/blob-scene-haikei.svg" 
              alt="Background blobs"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Stable gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          
          {/* Static geometric shapes */}
          <div className="absolute inset-0 opacity-8">
            <div className="absolute top-1/4 left-1/4 w-80 h-80 border border-accent/15 rounded-2xl" />
            <div className="absolute top-1/2 right-1/4 w-64 h-64 border border-primary/15 rounded-full" />
            <div className="absolute bottom-1/4 left-1/3 w-48 h-48 border border-secondary/15 rounded-lg" />
          </div>
          
          {/* Static code elements */}
          <div className="absolute top-1/4 left-1/6 text-accent/12 font-mono text-base font-medium">
            {"{ passion: 'code' }"}
          </div>
          <div className="absolute bottom-1/3 right-1/6 text-primary/12 font-mono text-base font-medium">
            {"<Creative />"}
          </div>
          <div className="absolute top-2/3 left-2/3 text-secondary/12 font-mono text-base font-medium">
            {"function innovate()"}
          </div>
          
          {/* Static decorative dots */}
          <div className="absolute top-1/6 right-1/6 w-3 h-3 bg-accent/25 rounded-full" />
          <div className="absolute bottom-1/6 left-1/6 w-4 h-4 bg-primary/25 rounded-full" />
          <div className="absolute top-3/5 left-1/2 w-2 h-2 bg-secondary/30 rounded-full" />
          <div className="absolute top-1/3 right-1/3 w-1 h-8 bg-accent/20 rounded-full" />
          <div className="absolute bottom-1/4 right-1/5 w-6 h-1 bg-primary/20 rounded-full" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-6 hero-content mt-8 md:mt-12">
        {/* Animated Name */}
        <BreathingGlow intensity="medium" className="inline-block">
          <motion.div
            className="typography-hero font-bold text-foreground"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {nameWords.map((letter, index) => (
              <motion.span
                key={index}
                variants={createWordRevealVariants(0.2)}
                custom={index}
                className="inline-block"
                whileHover={{ 
                  scale: 1.1, 
                  color: "var(--color-accent)",
                  transition: { duration: 0.2 }
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>
        </BreathingGlow>

        {/* Animated Tagline */}
        <motion.div
          className="typography-heading text-accent/90 font-medium"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {taglineWords.map((word, index) => (
            <motion.span
              key={index}
              variants={createWordRevealVariants(1)}
              custom={index}
              className="inline-block mr-3 text-reveal"
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Typography variant="subheading" className="text-foreground/70 font-normal">
            {subtitle}
          </Typography>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-2xl mx-auto"
        >
          <Typography variant="body" className="text-foreground/80 leading-relaxed">
            At the Age of 17, I'm passionate towards Developement. 
            I like Programming alot, and like to explore new things.
            
          </Typography>
        </motion.div>

        {/* Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-12"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
            <Button 
              href="/projects" 
              size="lg"
              className="relative min-w-[180px] px-8 py-4 bg-background/95 backdrop-blur-sm border border-accent/30 hover:border-accent/50 shadow-none"
            >
              View My Work
            </Button>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-secondary to-neutral rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
            <Button 
              variant="secondary" 
              href="/contact" 
              size="lg"
              className="relative min-w-[180px] px-8 py-4 bg-surface/95 backdrop-blur-sm border border-accent/30 hover:border-accent/50 shadow-none"
            >
              Let's Connect
            </Button>
          </div>
        </motion.div>

        {/* Personal Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-4 md:gap-6 pt-12 max-w-2xl mx-auto"
        >
          {[
            { label: "Age", value: "17" },
            { label: "Location", value: "Pakistan" },
            { label: "Focus", value: "Web & Games" },
            { label: "Experience", value: "Passionate" }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              className="bg-surface/30 backdrop-blur-sm border border-accent/10 rounded-xl px-4 py-3 md:px-6 md:py-4 text-center"
              whileHover={{ 
                y: -4, 
                boxShadow: "0 8px 30px rgba(139, 99, 92, 0.15)",
                transition: { duration: 0.3 }
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 3.5 + index * 0.1, 
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <div className="text-xs md:text-sm text-foreground/60 font-medium uppercase tracking-wider">
                {item.label}
              </div>
              <div className="text-base md:text-lg font-semibold text-accent mt-1">
                {item.value}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4, duration: 0.8 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-accent/30 rounded-full flex justify-center bg-background/20 backdrop-blur-sm"
          animate={{ 
            borderColor: ["rgba(139, 99, 92, 0.3)", "rgba(139, 99, 92, 0.8)", "rgba(139, 99, 92, 0.3)"]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-accent rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
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
  );
}