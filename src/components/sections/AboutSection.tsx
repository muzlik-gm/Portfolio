"use client";

import { motion } from "framer-motion";
import { Section, Typography, ProfileImage, TechStack } from "@/components/ui";
import { ParallaxBackground } from "@/components/effects";
import { personalInfo, timeline, skills, achievements, getSkillsByCategory } from "@/data/about";
import { scrollReveal, staggerContainer, createSweepingTextAnimation } from "@/lib/animations";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FileCode, Layers, Database } from "lucide-react";
import { useEffect, useRef } from "react";

export function AboutSection() {
  const prefersReducedMotion = useReducedMotion();
  const aboutRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);

  // Intersection observer for text animations
  const { ref: sectionRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true
  });

  // Apply sweeping text animation
  useEffect(() => {
    if (!prefersReducedMotion && isIntersecting && bioRef.current) {
      createSweepingTextAnimation(bioRef.current, {
        direction: 'left',
        stagger: 30,
        delay: 300
      });
    }
  }, [isIntersecting, prefersReducedMotion]);

  const skillCategories = [
    { id: 'frontend', label: 'Frontend', color: 'from-primary to-secondary' },
    { id: 'backend', label: 'Backend', color: 'from-accent to-neutral' },
    { id: 'game', label: 'Game Dev', color: 'from-secondary to-accent' },
    { id: 'tools', label: 'Tools', color: 'from-neutral to-primary' },
  ];

  return (
    <div ref={sectionRef as any}>
      <Section
        id="about"
        className="about-section fade-in-section grid-pattern-dots relative overflow-hidden"
      >
      {/* Multi-layer Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <ParallaxBackground speed="slow" className="absolute inset-0 parallax-bg">
          {/* Stacked peaks background */}
          <div className="absolute inset-0 opacity-15">
            <img 
              src="/stacked-peaks-haikei.svg" 
              alt="Mountain peaks"
              className="w-full h-full object-cover"
              style={{ 
                filter: 'hue-rotate(200deg) saturate(0.6)',
              }}
            />
          </div>
          
          {/* Subtle wave background */}
          <div className="absolute inset-0 opacity-10">
            <img 
              src="/wave-haikei.svg" 
              alt="Background waves"
              className="w-full h-full object-cover"
              style={{ 
                filter: 'hue-rotate(60deg) saturate(0.6)',
              }}
            />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8" />
          
          {/* Developer-themed background elements */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
          
          {/* Code snippets in background */}
          <div className="absolute top-1/6 right-1/6 text-primary/5 font-mono text-xs transform rotate-12 whitespace-pre-line">
            {`const developer = {
  name: 'Hamza',
  passion: 'coding'
};`}
          </div>
          
          <div className="absolute bottom-1/6 left-1/6 text-accent/5 font-mono text-xs transform -rotate-12 whitespace-pre-line">
            {`function createAmazingThings() {
  return innovation + creativity;
}`}
          </div>
        </ParallaxBackground>

        <ParallaxBackground speed="medium" className="absolute inset-0">
          {/* Floating tech icons */}
          <div className="absolute top-1/3 left-1/5 opacity-10 parallax-float">
            <FileCode className="w-8 h-8 text-yellow-500" />
          </div>
          <div className="absolute bottom-1/3 right-1/5 opacity-10 parallax-float">
            <Layers className="w-8 h-8 text-green-500" />
          </div>
          <div className="absolute top-2/3 left-2/3 opacity-10 parallax-float">
            <Database className="w-8 h-8 text-green-600" />
          </div>
        </ParallaxBackground>
      </div>

      <div className="relative z-10 space-y-20">
        {/* Section Header */}
        <div className="text-center space-y-6">
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Typography variant="heading" className="text-reveal">
              My Story
            </Typography>
          </motion.div>
          
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div
              ref={bioRef}
              data-scroll-reveal="sweep"
              data-sweep-direction="left"
            >
              <Typography variant="body" className="text-foreground/80 text-lg leading-relaxed">
                {personalInfo.bio}
              </Typography>
            </div>
          </motion.div>
        </div>

        {/* Profile Image */}
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex justify-center mb-16"
        >
          <ProfileImage />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Column - Personal Info & Mission */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            {/* Mission Statement */}
            <motion.div
              variants={scrollReveal}
              className="bg-surface/30 backdrop-blur-sm rounded-2xl p-8 border border-accent/10"
            >
              <Typography variant="subheading" className="text-accent mb-4">
                My Mission
              </Typography>
              <Typography variant="body" className="text-foreground/80 leading-relaxed">
                {personalInfo.mission}
              </Typography>
            </motion.div>

            {/* Core Values */}
            <motion.div variants={scrollReveal} className="space-y-6">
              <Typography variant="subheading" className="text-foreground">
                Core Values
              </Typography>
              <div className="grid grid-cols-1 gap-4">
                {personalInfo.values.map((value, index) => (
                  <motion.div
                    key={value}
                    variants={scrollReveal}
                    transition={{ delay: index * 0.1 }}
                    className="bg-background/50 rounded-xl p-4 border border-accent/10 hover:border-accent/30 transition-colors"
                  >
                    <Typography variant="body" className="text-sm font-medium text-foreground/90">
                      {value}
                    </Typography>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div variants={scrollReveal} className="space-y-6">
              <Typography variant="subheading" className="text-foreground">
                Achievements
              </Typography>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement}
                    variants={scrollReveal}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                    <Typography variant="body" className="text-sm text-foreground/80">
                      {achievement}
                    </Typography>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Timeline */}
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <Typography variant="subheading" className="text-foreground">
              Journey Timeline
            </Typography>
            
            <div className="relative">
              {/* Timeline Line - Hide on mobile, show on larger screens */}
              <div className="hidden md:block absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-secondary" />

              {/* Timeline Items */}
              <div className="space-y-6 md:space-y-8">
                {timeline.map((item, index) => (
                  <motion.div
                    key={`${item.year}-${index}`}
                    variants={scrollReveal}
                    transition={{ delay: index * 0.2 }}
                    className="relative flex flex-col md:flex-row items-start gap-4 md:gap-6"
                  >
                    {/* Timeline Dot - Adjust positioning for mobile */}
                    <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                      item.type === 'milestone'
                        ? 'bg-primary border-primary/30'
                        : item.type === 'project'
                        ? 'bg-accent border-accent/30'
                        : 'bg-secondary border-secondary/30'
                    }`}>
                      <span className="text-background font-bold text-sm">
                        {item.year.slice(-2)}
                      </span>
                    </div>

                    {/* Timeline Content - Full width on mobile, flex-1 on larger screens */}
                    <div className="w-full md:flex-1 bg-surface/20 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-accent/10 hover:border-accent/20 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <Typography variant="body" className="font-semibold text-foreground">
                          {item.title}
                        </Typography>
                        <span className="text-xs text-foreground/50 font-medium self-start sm:self-center">
                          {item.year}
                        </span>
                      </div>
                      <Typography variant="body" className="text-sm text-foreground/70 leading-relaxed">
                        {item.description}
                      </Typography>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Skills Section */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="text-center">
            <Typography variant="subheading" className="text-foreground">
              Skills & Technologies
            </Typography>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8">
            {skillCategories.map((category, categoryIndex) => {
              const categorySkills = getSkillsByCategory(category.id as any);
              
              return (
                <motion.div
                  key={category.id}
                  variants={scrollReveal}
                  transition={{ delay: categoryIndex * 0.1 }}
                  className="space-y-4"
                >
                  <div className={`bg-gradient-to-r ${category.color} p-4 rounded-xl text-center`}>
                    <Typography variant="body" className="font-semibold text-background">
                      {category.label}
                    </Typography>
                  </div>
                  
                  <motion.div
                    variants={scrollReveal}
                    transition={{ delay: categoryIndex * 0.1 }}
                  >
                    <TechStack 
                      technologies={categorySkills.map(skill => skill.name)}
                      className="justify-center"
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </Section>
    </div>
  );
}