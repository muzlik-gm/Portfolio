"use client";

import { Layout } from "@/components/layout";
import { Section, Typography, Button, Card, TechStack, SectionDivider } from "@/components/ui";
import { ProjectImage } from "@/components/ui/ProjectImage";
import { ParallaxBackground } from "@/components/effects";
import { projects, Project } from "@/data/projects";
import { motion, AnimatePresence } from "framer-motion";
import { scrollReveal, staggerContainer } from "@/lib/animations";
import { useState } from "react";

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'web' | 'game'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = [
    { id: 'all', label: 'All Projects', count: projects.length },
    { id: 'web', label: 'Web Applications', count: projects.filter(p => p.category === 'web').length },
    { id: 'game', label: 'Games', count: projects.filter(p => p.category === 'game').length }
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <Section 
        id="projects-hero" 
        className="hero-grid relative overflow-hidden flex items-center justify-center pt-20 md:pt-24"
        fullHeight={true}
      >
        <ParallaxBackground speed="slow" className="absolute inset-0">
          <div className="absolute inset-0 opacity-20">
            <img 
              src="/layered-waves-haikei.svg" 
              alt="Layered waves"
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
            <Typography variant="hero">My Projects</Typography>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Typography variant="body" className="text-foreground/80 text-lg leading-relaxed max-w-3xl mx-auto">
              A collection of web applications and games I've built, showcasing different 
              technologies and creative solutions to real-world problems.
            </Typography>
          </motion.div>

          {/* Project Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex justify-center gap-8 pt-8"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{projects.length}</div>
              <div className="text-sm text-foreground/60">Total Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{projects.filter(p => p.status === 'live').length}</div>
              <div className="text-sm text-foreground/60">Live Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">{projects.filter(p => p.featured).length}</div>
              <div className="text-sm text-foreground/60">Featured</div>
            </div>
          </motion.div>
        </div>
      </Section>

      <SectionDivider type="wave" />

      {/* Projects Section */}
      <Section background="surface" className="grid-pattern">
        <div className="space-y-16">
          {/* Category Filter */}
          <motion.div
            className="flex justify-center"
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex bg-background/50 backdrop-blur-sm rounded-2xl p-2 border border-accent/10">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as any)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? "bg-accent text-background shadow-soft"
                      : "text-foreground/70 hover:text-foreground hover:bg-surface/50"
                  }`}
                >
                  {category.label}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedCategory === category.id
                      ? "bg-background/20 text-background"
                      : "bg-accent/20 text-accent"
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={scrollReveal}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                  whileHover={{ y: -8 }}
                >
                  <Card className="h-full overflow-hidden bg-background/50 border-accent/20 hover:border-accent/40 hover:shadow-medium">
                    {/* Project Visual */}
                    <div className="relative h-48 overflow-hidden">
                      <ProjectImage 
                        projectId={project.id}
                        title={project.title}
                        category={project.category}
                        className="w-full h-full"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      
                      {/* Badges Container */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        {/* Status Badge */}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.status === 'live' 
                            ? 'bg-green-500/20 text-green-600 border border-green-500/30'
                            : project.status === 'development'
                            ? 'bg-yellow-500/20 text-yellow-600 border border-yellow-500/30'
                            : 'bg-red-500/20 text-red-600 border border-red-500/30'
                        }`}>
                          {project.status === 'live' ? 'Live' : project.status === 'development' ? 'In Dev' : 'Terminated'}
                        </span>

                        {/* Featured Badge */}
                        {project.featured && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent border border-accent/30">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Project Content */}
                    <div className="p-6 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Typography variant="subheading" className="text-foreground group-hover:text-accent transition-colors">
                            {project.title}
                          </Typography>
                          <span className="text-sm text-foreground/50 font-medium">
                            {project.year}
                          </span>
                        </div>
                        
                        <Typography variant="body" className="text-foreground/70 text-sm leading-relaxed">
                          {project.description}
                        </Typography>
                      </div>

                      {/* Technologies */}
                      <TechStack 
                        technologies={project.technologies.slice(0, 3)} 
                        className="justify-start"
                      />
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 text-foreground/50 text-xs">
                          +{project.technologies.length - 3} more
                        </span>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        {project.liveUrl ? (
                          <Button
                            href={project.liveUrl}
                            size="sm"
                            className="flex-1"
                            onClick={(e) => e?.stopPropagation()}
                          >
                            View Live
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="flex-1 opacity-50 cursor-not-allowed"
                            disabled
                          >
                            {project.status === 'archived' ? 'Terminated' : 'Unavailable'}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e?.stopPropagation();
                            setSelectedProject(project);
                          }}
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </Section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
            
            {/* Modal Content */}
            <motion.div
              className="relative bg-background border border-accent/20 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-strong"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-surface/50 hover:bg-accent/20 transition-colors"
              >
                ×
              </button>

              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <Typography variant="heading">{selectedProject.title}</Typography>
                  <div className="flex items-center gap-4 text-sm text-foreground/60">
                    <span>{selectedProject.year}</span>
                    <span>•</span>
                    <span className="capitalize">{selectedProject.category}</span>
                    <span>•</span>
                    <span className="capitalize">{selectedProject.status}</span>
                  </div>
                </div>

                {/* Description */}
                <Typography variant="body" className="text-foreground/80 leading-relaxed">
                  {selectedProject.longDescription}
                </Typography>

                {/* Technologies */}
                <div className="space-y-3">
                  <Typography variant="subheading" className="text-sm font-semibold text-foreground/80">
                    Technologies Used
                  </Typography>
                  <TechStack technologies={selectedProject.technologies} />
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  {selectedProject.liveUrl ? (
                    <Button href={selectedProject.liveUrl} className="flex-1">
                      View Live Project
                    </Button>
                  ) : (
                    <Button className="flex-1 opacity-50 cursor-not-allowed" disabled>
                      {selectedProject.status === 'archived' ? 'Project Terminated' : 'Unavailable'}
                    </Button>
                  )}
                  {selectedProject.githubUrl && (
                    <Button variant="secondary" href={selectedProject.githubUrl} className="flex-1">
                      View Code
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}