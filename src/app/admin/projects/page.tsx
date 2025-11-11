"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Typography, Button, Card } from "@/components/ui";
import { scrollReveal, staggerContainer } from "@/lib/animations";
import { base64UrlDecode } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  liveUrl: string;
  githubUrl?: string;
  imageUrl?: string;
  featured: boolean;
  category: 'web' | 'game' | 'other';
  year: string;
  status: 'live' | 'development' | 'archived';
}

export default function AdminProjectsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [filter, setFilter] = useState<'all' | 'live' | 'development' | 'archived'>('all');
  const router = useRouter();

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects');
      if (response.ok) {
        const data = await response.json();
        setProjectList(data.projects || []);
      } else {
        console.error('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    // Force solid background on body
    document.body.style.background = '#fafaf9';
    document.body.style.backgroundImage = 'none';
    document.documentElement.style.background = '#fafaf9';
    document.documentElement.style.backgroundImage = 'none';

    // Check authentication
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    // Verify token
    try {
      const tokenData = JSON.parse(base64UrlDecode(token.split('.')[1]));
      if (tokenData.exp * 1000 < Date.now()) {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
        return;
      }

      setIsAuthenticated(true);
      // Fetch projects from API instead of using hardcoded data
      fetchProjects();
    } catch (error) {
      localStorage.removeItem("adminToken");
      router.push("/admin/login");
    } finally {
      setIsLoading(false);
    }

    // Cleanup
    return () => {
      document.body.style.background = '';
      document.body.style.backgroundImage = '';
      document.documentElement.style.background = '';
      document.documentElement.style.backgroundImage = '';
    };
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const filteredProjects = projectList.filter(project => {
    if (filter === 'all') return true;
    return project.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'development':
        return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'archived':
        return 'bg-red-500/20 text-red-600 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web':
        return '💻';
      case 'game':
        return '🎮';
      default:
        return '🚀';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <Typography variant="body" className="text-foreground/60">
            Loading projects management...
          </Typography>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fafaf9]" style={{ background: '#fafaf9' }}>
      {/* Solid background overlay to prevent any background images from showing */}
      <div className="fixed inset-0 bg-[#fafaf9] z-0" style={{ background: '#fafaf9', backgroundImage: 'none' }} />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-background border-b border-accent/10 sticky top-0 z-20 shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/admin/dashboard")}
              >
                ← Dashboard
              </Button>
              
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/projects")}
                >
                  View Projects
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Page Title */}
            <motion.div variants={scrollReveal}>
              <Typography variant="heading" className="text-foreground text-3xl">
                Projects Management
              </Typography>
              <Typography variant="body" className="text-foreground/60 mt-2">
                Manage your portfolio projects
              </Typography>
            </motion.div>

            {/* Stats and Actions */}
            <motion.div variants={scrollReveal} className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{projectList.length}</div>
                  <div className="text-sm text-foreground/60">Total Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{projectList.filter((p: Project) => p.status === 'live').length}</div>
                  <div className="text-sm text-foreground/60">Live</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{projectList.filter((p: Project) => p.status === 'development').length}</div>
                  <div className="text-sm text-foreground/60">In Development</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{projectList.filter((p: Project) => p.status === 'archived').length}</div>
                  <div className="text-sm text-foreground/60">Archived</div>
                </div>
              </div>

              <Button size="lg">
                + New Project
              </Button>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div variants={scrollReveal}>
              <div className="flex bg-background/50 backdrop-blur-sm rounded-2xl p-2 border border-accent/10 w-fit">
                {[
                  { id: 'all', label: 'All Projects' },
                  { id: 'live', label: 'Live' },
                  { id: 'development', label: 'Development' },
                  { id: 'archived', label: 'Archived' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id as any)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm ${
                      filter === tab.id
                        ? "bg-accent text-background shadow-soft"
                        : "text-foreground/70 hover:text-foreground hover:bg-surface/50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Projects Grid */}
            <motion.div variants={scrollReveal} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={scrollReveal}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-background/50 border-accent/20 hover:border-accent/30 transition-colors h-full">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getCategoryIcon(project.category)}</span>
                          <div>
                            <Typography variant="subheading" className="text-foreground">
                              {project.title}
                            </Typography>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                                {project.status}
                              </span>
                              {project.featured && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent border border-accent/30">
                                  Featured
                                </span>
                              )}
                              <span className="text-xs text-foreground/60">
                                {project.year} • {project.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <Typography variant="body" className="text-foreground/70 text-sm leading-relaxed">
                        {project.description}
                      </Typography>
                      
                      {/* Technologies */}
                      <div className="space-y-2">
                        <Typography variant="body" className="text-foreground/80 text-xs font-medium">
                          Technologies:
                        </Typography>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 text-xs bg-surface/30 text-foreground/60 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* URLs */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-foreground/60">Live URL:</span>
                          <span className="text-foreground/80 font-mono">
                            {project.liveUrl || 'Not available'}
                          </span>
                        </div>
                        {project.githubUrl && (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-foreground/60">GitHub:</span>
                            <span className="text-foreground/80 font-mono">
                              {project.githubUrl}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-4 border-t border-accent/10">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {/* TODO: Implement edit functionality */}}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {/* TODO: Implement view functionality */}}
                        >
                          View
                        </Button>
                        {project.liveUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(project.liveUrl, '_blank')}
                          >
                            Visit
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 ml-auto"
                          onClick={async () => {
                            if (confirm('Are you sure you want to delete this project?')) {
                              try {
                                const response = await fetch(`/api/admin/projects/${project.id}`, {
                                  method: 'DELETE',
                                });
                                if (response.ok) {
                                  fetchProjects(); // Refresh the list
                                } else {
                                  alert('Failed to delete project');
                                }
                              } catch (error) {
                                console.error('Error deleting project:', error);
                                alert('Error deleting project');
                              }
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {filteredProjects.length === 0 && (
              <motion.div
                variants={scrollReveal}
                className="text-center py-16"
              >
                <Typography variant="body" className="text-foreground/60">
                  No projects found for the selected filter.
                </Typography>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}