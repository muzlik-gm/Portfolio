"use client";

import { motion } from "framer-motion";
import { Section, Typography, Button } from "@/components/ui";
import { ContactForm } from "@/components/forms";
import { ParallaxBackground, BreathingGlow } from "@/components/effects";
import { scrollReveal, staggerContainer, createImageRevealAnimation } from "@/lib/animations";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MapPin, Clock, Briefcase, Mail, Github, Linkedin, Twitter, MessageCircle, Rocket } from "lucide-react";
import { useEffect, useRef } from "react";
import { animate, createTimeline } from "animejs";

export function ContactSection() {
  const prefersReducedMotion = useReducedMotion();
  const contactRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Intersection observer for image animations
  const { ref: sectionRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true
  });

  // Apply image reveal animations and link accent animations
  useEffect(() => {
    if (!prefersReducedMotion && isIntersecting && contactRef.current) {
      const images = contactRef.current.querySelectorAll('[data-scroll-reveal="image"]');
      images.forEach((image, index) => {
        createImageRevealAnimation(image as HTMLElement, {
          delay: 500 + index * 200,
          glowColor: 'rgba(221, 215, 141, 0.4)'
        });
      });
    }
  }, [isIntersecting, prefersReducedMotion]);

  // Link accent line and pulsing dot animations
  useEffect(() => {
    if (prefersReducedMotion) return;

    const links = linkRefs.current.filter(Boolean);
    if (!links.length) return;

    const handleLinkMouseEnter = (element: HTMLElement, index: number) => {
      // Create accent line and pulsing dot
      const line = document.createElement('div');
      const dot = document.createElement('div');

      // Style the accent line
      line.style.cssText = `
        position: absolute;
        bottom: -2px;
        left: 50%;
        width: 0%;
        height: 2px;
        background: linear-gradient(90deg, var(--accent), var(--primary));
        transform: translateX(-50%);
        border-radius: 1px;
        z-index: 1;
      `;

      // Style the pulsing dot
      dot.style.cssText = `
        position: absolute;
        bottom: -2px;
        left: 50%;
        width: 6px;
        height: 6px;
        background: var(--accent);
        border-radius: 50%;
        transform: translateX(-50%);
        opacity: 0;
        z-index: 2;
      `;

      element.style.position = 'relative';
      element.appendChild(line);
      element.appendChild(dot);

      // Animate accent line from center outward
      animate(line, {
        width: '100%',
        duration: 400,
        easing: 'cubicBezier(0.25, 0.46, 0.45, 0.94)'
      });

      // Animate pulsing dot
      createTimeline()
        .add(dot, {
          opacity: [0, 1],
          scale: [0.5, 1],
          duration: 300,
          easing: 'easeOutExpo'
        })
        .add(dot, {
          scale: [1, 1.2, 1],
          opacity: [1, 0.8, 0],
          duration: 800,
          easing: 'easeInOutQuad',
          loop: true
        });
    };

    const handleLinkMouseLeave = (element: HTMLElement) => {
      const line = element.querySelector('div[style*="bottom: -2px"]') as HTMLElement;
      const dot = element.querySelector('div[style*="border-radius: 50%"]') as HTMLElement;

      if (line) {
        animate(line, {
          width: '0%',
          duration: 400,
          easing: 'cubicBezier(0.25, 0.46, 0.45, 0.94)',
          complete: () => {
            line.remove();
          }
        });
      }

      if (dot) {
        animate(dot, {
          opacity: 0,
          scale: 0.5,
          duration: 300,
          easing: 'easeInOutQuad',
          complete: () => {
            dot.remove();
          }
        });
      }
    };

    links.forEach((link, index) => {
      if (!link) return;

      link.addEventListener('mouseenter', () => handleLinkMouseEnter(link, index));
      link.addEventListener('mouseleave', () => handleLinkMouseLeave(link));
    });

    return () => {
      links.forEach((link) => {
        if (!link) return;
        link.removeEventListener('mouseenter', () => handleLinkMouseEnter(link, 0));
        link.removeEventListener('mouseleave', () => handleLinkMouseLeave(link));
      });
    };
  }, [prefersReducedMotion]);

  const socialLinks = [
    {
      name: "Email",
      href: "mailto:hamza@example.com",
      icon: "email",
      description: "Drop me a line"
    },
    {
      name: "GitHub",
      href: "https://github.com/muzlik-gm",
      icon: "github",
      description: "Check out my code"
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/muzlik-gm",
      icon: "linkedin",
      description: "Let's connect professionally"
    },
    {
      name: "Twitter",
      href: "https://x.com/muzli-gm",
      icon: "twitter",
      description: "Follow my journey"
    },
    {
      name: "Discord",
      href: "https://discord.gg/kJxqXqFF2N",
      icon: "discord",
      description: "Chat about games & code"
    }
  ];

  const quickActions = [
    {
      title: "Project Collaboration",
      description: "Have an exciting project idea? Let's build something amazing together.",
      action: "Discuss Project",
      href: "mailto:hamza@example.com?subject=Project Collaboration"
    },
    {
      title: "Mentorship & Learning",
      description: "Questions about development? I'm happy to share knowledge and learn together.",
      action: "Ask Questions",
      href: "mailto:hamza@example.com?subject=Mentorship"
    },
    {
      title: "Just Say Hello",
      description: "Want to connect with a fellow developer? I'd love to hear from you!",
      action: "Say Hi",
      href: "mailto:hamza@example.com?subject=Hello"
    }
  ];

  return (
    <div ref={sectionRef as any}>
      <Section
        id="contact"
        className="contact-section fade-in-section grid-pattern-subtle relative overflow-hidden"
        background="surface"
      >
      {/* Background Effects */}
      <ParallaxBackground speed="slow" className="absolute inset-0 opacity-40">
        {/* Layered waves background */}
        <div className="absolute inset-0 opacity-25">
          <img 
            src="/layered-waves-haikei.svg" 
            alt="Background waves"
            className="w-full h-full object-cover"
            style={{ 
              filter: 'hue-rotate(120deg) saturate(0.7)',
            }}
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-primary/10 rounded-full blur-3xl" />
      </ParallaxBackground>

      <div className="relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-6">
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <BreathingGlow intensity="low" className="inline-block">
              <Typography variant="heading" className="text-reveal">
                Let's Create Together
              </Typography>
            </BreathingGlow>
          </motion.div>
          
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <Typography variant="body" className="text-foreground/80 text-lg leading-relaxed">
              I'm always excited to connect with fellow developers, potential collaborators, 
              and anyone passionate about technology. Whether you have a project idea, 
              want to discuss development, or just want to say hello – I'd love to hear from you!
            </Typography>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
        >
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              variants={scrollReveal}
              transition={{ delay: index * 0.1 }}
              className="bg-background/50 backdrop-blur-sm rounded-2xl p-6 border border-accent/10 hover:border-accent/30 transition-all duration-300 group"
            >
              <div className="space-y-4">
                <Typography variant="subheading" className="text-foreground group-hover:text-accent transition-colors">
                  {action.title}
                </Typography>
                <Typography variant="body" className="text-foreground/70 text-sm leading-relaxed">
                  {action.description}
                </Typography>
                <Button 
                  href={action.href} 
                  variant="ghost" 
                  size="sm"
                  className="w-full"
                >
                  {action.action}
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Contact Form */}
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="text-center lg:text-left">
              <Typography variant="subheading" className="text-foreground mb-4">
                Send me a message
              </Typography>
              <Typography variant="body" className="text-foreground/70">
                Fill out the form below and I'll get back to you as soon as possible.
              </Typography>
            </div>
            
            <div className="bg-background/30 backdrop-blur-sm rounded-2xl p-8 border border-accent/10">
              <ContactForm />
            </div>
          </motion.div>

          {/* Contact Info & Social Links */}
          <motion.div
            ref={contactRef}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Personal Info */}
            <motion.div
              variants={scrollReveal}
              className="text-center lg:text-left space-y-4"
            >
              <Typography variant="subheading" className="text-foreground">
                Get in touch
              </Typography>
              <div className="space-y-3">
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <MapPin className="text-accent" size={20} />
                  <Typography variant="body" className="text-foreground/80">
                    Pakistan
                  </Typography>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <Clock className="text-accent" size={20} />
                  <Typography variant="body" className="text-foreground/80">
                    Usually responds within 24 hours
                  </Typography>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <Briefcase className="text-accent" size={20} />
                  <Typography variant="body" className="text-foreground/80">
                    Available for freelance projects
                  </Typography>
                </div>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div variants={scrollReveal} className="space-y-6">
              <Typography variant="subheading" className="text-foreground text-center lg:text-left">
                Connect with me
              </Typography>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {socialLinks.map((link, index) => {
                  const iconComponents = {
                    email: Mail,
                    github: Github,
                    linkedin: Linkedin,
                    twitter: Twitter,
                    discord: MessageCircle,
                  };

                  const IconComponent = iconComponents[link.icon as keyof typeof iconComponents];

                  return (
                    <motion.a
                      key={link.name}
                      ref={(el) => {
                        if (el && linkRefs.current) {
                          linkRefs.current[index] = el;
                        }
                      }}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      variants={scrollReveal}
                      transition={{ delay: index * 0.1 }}
                      className="bg-surface/30 backdrop-blur-sm rounded-xl p-4 border border-accent/10 hover:border-accent/30 hover:bg-surface/50 transition-all duration-300 group block"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="text-accent group-hover:scale-110 transition-transform" size={20} />
                        <div>
                          <div className="font-medium text-foreground group-hover:text-accent transition-colors">
                            {link.name}
                          </div>
                          <div className="text-sm text-foreground/60">
                            {link.description}
                          </div>
                        </div>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              variants={scrollReveal}
              className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6 border border-accent/20 text-center"
            >
              <Typography variant="body" className="text-foreground/80 mb-4">
                Prefer a direct approach?
              </Typography>
              <Button 
                href="mailto:hamza@example.com" 
                size="lg"
                className="min-w-[180px]"
              >
                Email Me Directly
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center pt-8 border-t border-accent/10"
        >
          <div className="flex items-center justify-center gap-2">
            <Typography variant="body" className="text-foreground/60 text-sm">
              Thanks for visiting my portfolio! Looking forward to connecting with you.
            </Typography>
            <Rocket className="text-accent" size={16} />
          </div>
        </motion.div>
      </div>
    </Section>
    </div>
  );
}