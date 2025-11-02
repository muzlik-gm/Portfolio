"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section, Typography, Button, Card, TechStack } from "@/components/ui";
import { ProjectImage } from "@/components/ui/ProjectImage";
import { projects, Project } from "@/data/projects";
import { staggerContainer, scrollReveal } from "@/lib/animations";

export function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'web' | 'game'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'web', label: 'Web Apps' },
    { id: 'game', label: 'Games' }
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <Section 
      id="projects" 
      className="projects-section fade-in-section grid-pattern"
      background="surface"
    >
      <div className="space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-6">
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Typography variant="heading" className="text-reveal">
              Featured Projects
            </Typography>
          </motion.div>
          
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Typography variant="body" className="max-w-3xl mx-auto text-foreground/80">
              A showcase of my passion projects, from innovative web applications 
              to immersive gaming experiences. Each project represents a unique 
              challenge and creative solution.
            </Typography>
          </motion.div>
        </div>

        {/* Category Filter */}
        <motion.div
          className="flex justify-center"
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex bg-surface/50 backdrop-blur-sm rounded-2xl p-2 border border-accent/10">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-accent text-background shadow-soft"
                    : "text-foreground/70 hover:text-foreground hover:bg-surface/50"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Project Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <ProjectModal
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}

function ProjectCard({ 
  project, 
  index, 
  onClick 
}: { 
  project: Project; 
  index: number; 
  onClick: () => void; 
}) {
  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      className="project-card group cursor-pointer"
      onClick={onClick}
      whileHover={{ y: -8 }}
      transition={{ 
        delay: index * 0.1,
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94] as any
      }}
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
            <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
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
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent border border-accent/30 backdrop-blur-sm">
                Featured
              </span>
            )}
          </div>

          {/* Light Sweep Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
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
                onClick();
              }}
            >
              Details
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function ProjectModal({ 
  project, 
  onClose 
}: { 
  project: Project; 
  onClose: () => void; 
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
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
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-surface/50 hover:bg-accent/20 transition-colors"
        >
          ×
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <Typography variant="heading">{project.title}</Typography>
            <div className="flex items-center gap-4 text-sm text-foreground/60">
              <span>{project.year}</span>
              <span>•</span>
              <span className="capitalize">{project.category}</span>
              <span>•</span>
              <span className="capitalize">{project.status}</span>
            </div>
          </div>

          {/* Description */}
          <Typography variant="body" className="text-foreground/80 leading-relaxed">
            {project.longDescription}
          </Typography>

          {/* Technologies */}
          <div className="space-y-3">
            <Typography variant="subheading" className="text-sm font-semibold text-foreground/80">
              Technologies Used
            </Typography>
            <TechStack technologies={project.technologies} />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            {project.liveUrl ? (
              <Button href={project.liveUrl} className="flex-1">
                View Live Project
              </Button>
            ) : (
              <Button className="flex-1 opacity-50 cursor-not-allowed" disabled>
                {project.status === 'archived' ? 'Project Terminated' : 'Unavailable'}
              </Button>
            )}
            {project.githubUrl && (
              <Button variant="secondary" href={project.githubUrl} className="flex-1">
                View Code
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}