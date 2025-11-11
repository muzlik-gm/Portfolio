"use client";

import { Layout } from "@/components/layout";
import { Section, Typography, Button, SectionDivider } from "@/components/ui";
import { ContactForm } from "@/components/forms";
import { ParallaxBackground, BreathingGlow } from "@/components/effects";
import { motion } from "framer-motion";
import { scrollReveal, staggerContainer } from "@/lib/animations";
import { Briefcase, GraduationCap, Hand, Mail, Github, Linkedin, Twitter, MapPin, Clock } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

export default function ContactPage() {
  const socialLinks = [
    {
      name: "Email",
      href: `mailto:${APP_CONFIG.contact.email}`,
      icon: "email",
      description: "Drop me a line",
      color: "from-red-500 to-red-600"
    },
    {
      name: "GitHub",
      href: APP_CONFIG.social.github,
      icon: "github",
      description: "Check out my code",
      color: "from-gray-700 to-gray-900"
    },
    {
      name: "LinkedIn",
      href: APP_CONFIG.social.linkedin,
      icon: "linkedin",
      description: "Let's connect professionally",
      color: "from-blue-600 to-blue-700"
    },
    {
      name: "Twitter",
      href: APP_CONFIG.social.twitter,
      icon: "twitter",
      description: "Follow my journey",
      color: "from-sky-400 to-sky-500"
    },
  ];

  const contactMethods = [
    {
      title: "Project Collaboration",
      description: "Have an exciting project idea? Let's build something amazing together.",
      action: "Discuss Project",
      href: `mailto:${APP_CONFIG.contact.email}?subject=Project Collaboration`,
      icon: Briefcase
    },
    {
      title: "Mentorship & Learning",
      description: "Questions about development? I'm happy to share knowledge and learn together.",
      action: "Ask Questions",
      href: `mailto:${APP_CONFIG.contact.email}?subject=Mentorship`,
      icon: GraduationCap
    },
    {
      title: "Just Say Hello",
      description: "Want to connect with a fellow developer? I'd love to hear from you!",
      action: "Say Hi",
      href: `mailto:${APP_CONFIG.contact.email}?subject=Hello`,
      icon: Hand
    }
  ];

  const iconComponents = {
    email: Mail,
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    discord: Mail,
  };

  return (
    <Layout>
      {/* Hero Section */}
      <Section 
        id="contact-hero" 
        className="animated-grid relative overflow-hidden flex items-center justify-center pt-20 md:pt-24"
        fullHeight={true}
      >
        <ParallaxBackground speed="slow" className="absolute inset-0">
          <div className="absolute inset-0 opacity-25">
            <img 
              src="/wave-haikei.svg" 
              alt="Background waves"
              className="w-full h-full object-cover"
            />
          </div>
        </ParallaxBackground>

        <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <BreathingGlow intensity="low" className="inline-block">
              <Typography variant="hero">Let's Connect</Typography>
            </BreathingGlow>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Typography variant="body" className="text-foreground/80 text-lg leading-relaxed max-w-3xl mx-auto">
              Ready to collaborate on your next project? Have questions about development? 
              Or just want to say hello? I'd love to hear from you!
            </Typography>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col sm:flex-row justify-center items-center gap-8 pt-8"
          >
            <div className="flex items-center gap-3">
              <MapPin className="text-accent" size={20} />
              <span className="text-foreground/80">{APP_CONFIG.contact.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-accent" size={20} />
              <span className="text-foreground/80">Usually responds within 24 hours</span>
            </div>
          </motion.div>
        </div>
      </Section>

      <SectionDivider type="layered-wave" />

      {/* Contact Methods */}
      <Section background="surface">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-16"
        >
          <div className="text-center">
            <Typography variant="heading">How Can I Help?</Typography>
            <Typography variant="body" className="text-foreground/70 mt-4 max-w-2xl mx-auto">
              Choose the best way to reach out based on what you need
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                variants={scrollReveal}
                transition={{ delay: index * 0.1 }}
                className="bg-background/50 backdrop-blur-sm rounded-2xl p-6 border border-accent/10 hover:border-accent/30 transition-all duration-300 group text-center"
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <method.icon className="text-accent" size={28} />
                  </div>
                  <Typography variant="subheading" className="text-foreground group-hover:text-accent transition-colors">
                    {method.title}
                  </Typography>
                  <Typography variant="body" className="text-foreground/70 text-sm leading-relaxed">
                    {method.description}
                  </Typography>
                  <Button 
                    href={method.href} 
                    variant="ghost" 
                    size="sm"
                    className="w-full"
                  >
                    {method.action}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      <SectionDivider type="wave" flip />

      {/* Contact Form & Social Links */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-16 items-start">
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
            
            <div className="bg-surface/30 backdrop-blur-sm rounded-2xl p-8 border border-accent/10">
              <ContactForm />
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="text-center lg:text-left">
              <Typography variant="subheading" className="text-foreground mb-4">
                Connect with me
              </Typography>
              <Typography variant="body" className="text-foreground/70">
                Follow me on social media or reach out directly
              </Typography>
            </div>
            
            <div className="space-y-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={scrollReveal}
                  transition={{ delay: index * 0.1 }}
                  className="bg-surface/30 backdrop-blur-sm rounded-xl p-4 border border-accent/10 hover:border-accent/30 hover:bg-surface/50 transition-all duration-300 group block"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${link.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      {(() => {
                        const IconComponent = iconComponents[link.icon as keyof typeof iconComponents];
                        return <IconComponent className="text-white" size={24} />;
                      })()}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground group-hover:text-accent transition-colors">
                        {link.name}
                      </div>
                      <div className="text-sm text-foreground/60">
                        {link.description}
                      </div>
                    </div>
                    <div className="text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm">↗</span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Direct Contact */}
            <motion.div
              variants={scrollReveal}
              className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6 border border-accent/20 text-center"
            >
              <Typography variant="body" className="text-foreground/80 mb-4">
                Prefer a direct approach?
              </Typography>
              <Button
                href={`mailto:${APP_CONFIG.contact.email}`}
                size="lg"
                className="min-w-[180px]"
              >
                Email Me Directly
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </Section>

      <SectionDivider type="layered-wave" />

      {/* FAQ Section */}
      <Section background="surface">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="text-center">
            <Typography variant="heading">Frequently Asked Questions</Typography>
            <Typography variant="body" className="text-foreground/70 mt-4 max-w-2xl mx-auto">
              Quick answers to common questions
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: "What's your typical response time?",
                answer: "I usually respond to emails within 24 hours, often much sooner during business hours."
              },
              {
                question: "Do you work on freelance projects?",
                answer: "Yes! I'm available for freelance web development and game development projects."
              },
              {
                question: "What technologies do you specialize in?",
                answer: "I specialize in React, Next.js, TypeScript, Node.js, and game development with Unity."
              },
              {
                question: "Can you help with existing projects?",
                answer: "Absolutely! I can help with bug fixes, feature additions, or complete project overhauls."
              }
            ].map((faq, index) => (
              <motion.div
                key={faq.question}
                variants={scrollReveal}
                transition={{ delay: index * 0.1 }}
                className="bg-background/50 backdrop-blur-sm rounded-xl p-6 border border-accent/10"
              >
                <Typography variant="body" className="font-semibold text-foreground mb-2">
                  {faq.question}
                </Typography>
                <Typography variant="body" className="text-foreground/70 text-sm leading-relaxed">
                  {faq.answer}
                </Typography>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>
    </Layout>
  );
}