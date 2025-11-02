"use client";

import { Layout } from "@/components/layout";
import { Section, Typography, ProfileImage, TechStack, SectionDivider } from "@/components/ui";
import { ParallaxBackground } from "@/components/effects";
import { personalInfo, timeline, skills, achievements, getSkillsByCategory } from "@/data/about";
import { motion } from "framer-motion";
import { scrollReveal, staggerContainer } from "@/lib/animations";

export default function AboutPage() {
  const skillCategories = [
    { id: 'frontend', label: 'Frontend', color: 'from-primary to-secondary' },
    { id: 'backend', label: 'Backend', color: 'from-accent to-neutral' },
    { id: 'game', label: 'Game Dev', color: 'from-secondary to-accent' }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <Section 
        id="about-hero" 
        className="hero-grid relative overflow-hidden flex items-center justify-center pt-20 md:pt-24"
        fullHeight={true}
      >
        <ParallaxBackground speed="slow" className="absolute inset-0">
          <div className="absolute inset-0 opacity-20">
            <img 
              src="/stacked-peaks-haikei.svg" 
              alt="Mountain peaks"
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
            <Typography variant="hero">About Me</Typography>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Typography variant="body" className="text-foreground/80 text-lg leading-relaxed max-w-3xl mx-auto">
              Discover my journey as a developer, and the Frameworks I work with, 
              and the thrive that makes me continue and provide best experiences.
            </Typography>
          </motion.div>
        </div>
      </Section>

      <SectionDivider type="wave" />

      {/* Detailed About Section */}
      <Section background="surface">
        <div className="space-y-20">
          {/* Profile and Bio */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex justify-center lg:justify-start"
            >
              <ProfileImage />
            </motion.div>
            
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Typography variant="heading">Hello, I'm Hamza</Typography>
              <Typography variant="body" className="text-foreground/80 leading-relaxed">
                {personalInfo.bio}
              </Typography>
              <Typography variant="body" className="text-foreground/80 leading-relaxed">
                {personalInfo.mission}
              </Typography>
            </motion.div>
          </div>

          {/* Timeline */}
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <Typography variant="heading" className="text-center">My Journey</Typography>
            
            <div className="relative max-w-4xl mx-auto">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-secondary" />
              
              {/* Timeline Items */}
              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <motion.div
                    key={`${item.year}-${index}`}
                    variants={scrollReveal}
                    transition={{ delay: index * 0.2 }}
                    className="relative flex items-start gap-8"
                  >
                    {/* Timeline Dot */}
                    <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-4 ${
                      item.type === 'milestone' 
                        ? 'bg-primary border-primary/30' 
                        : item.type === 'project'
                        ? 'bg-accent border-accent/30'
                        : 'bg-secondary border-secondary/30'
                    }`}>
                      <span className="text-background font-bold text-sm">
                        {item.year}
                      </span>
                    </div>
                    
                    {/* Timeline Content */}
                    <div className="flex-1 bg-background/50 backdrop-blur-sm rounded-xl p-6 border border-accent/10">
                      <Typography variant="subheading" className="text-foreground mb-2">
                        {item.title}
                      </Typography>
                      <Typography variant="body" className="text-foreground/70 leading-relaxed">
                        {item.description}
                      </Typography>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      <SectionDivider type="layered-wave" flip />

      {/* Skills Section */}
      <Section>
        <div className="space-y-16">
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <Typography variant="heading">Skills & Technologies</Typography>
            <Typography variant="body" className="text-foreground/70 mt-4 max-w-2xl mx-auto">
              The tools and technologies I use to bring ideas to life
            </Typography>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {skillCategories.map((category, categoryIndex) => {
              const categorySkills = getSkillsByCategory(category.id as any);
              
              return (
                <motion.div
                  key={category.id}
                  variants={scrollReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: categoryIndex * 0.1 }}
                  className="space-y-4"
                >
                  <div className={`bg-gradient-to-r ${category.color} p-4 rounded-xl text-center`}>
                    <Typography variant="body" className="font-semibold text-background">
                      {category.label}
                    </Typography>
                  </div>
                  
                  <TechStack 
                    technologies={categorySkills.map(skill => skill.name)}
                    className="justify-center flex-col"
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      <SectionDivider type="wave" />

      {/* Achievements Section */}
      <Section background="surface">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center space-y-12"
        >
          <Typography variant="heading">Achievements & Highlights</Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement}
                variants={scrollReveal}
                transition={{ delay: index * 0.1 }}
                className="bg-background/50 backdrop-blur-sm rounded-xl p-6 border border-accent/10 hover:border-accent/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-accent rounded-full mt-2 flex-shrink-0" />
                  <Typography variant="body" className="text-foreground/80 text-left">
                    {achievement}
                  </Typography>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>
    </Layout>
  );
}