"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Typography, Button, Card, Icon } from "@/components/ui";
import { scrollReveal, staggerContainer } from "@/lib/animations";
import { useRouter } from "next/navigation";
import { blogPosts } from "@/data/blog";
import { projects } from "@/data/projects";

interface AdminStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalProjects: number;
  liveProjects: number;
  devProjects: number;
}

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalProjects: 0,
    liveProjects: 0,
    devProjects: 0
  });
  const router = useRouter();

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

    // Verify token (in a real app, you'd verify with the server)
    try {
      // Simple token validation (in production, verify with server)
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      if (tokenData.exp * 1000 < Date.now()) {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
        return;
      }
      
      setIsAuthenticated(true);
      
      // Calculate stats
      const totalPosts = blogPosts.length;
      const publishedPosts = blogPosts.filter(p => p.status === 'published').length;
      const draftPosts = blogPosts.filter(p => p.status === 'draft').length;
      const totalProjects = projects.length;
      const liveProjects = projects.filter(p => p.status === 'live').length;
      const devProjects = projects.filter(p => p.status === 'development').length;

      setStats({
        totalPosts,
        publishedPosts,
        draftPosts,
        totalProjects,
        liveProjects,
        devProjects
      });
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <Typography variant="body" className="text-foreground/60">
            Loading dashboard...
          </Typography>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const statCards = [
    {
      title: "Total Blog Posts",
      value: stats.totalPosts,
      subtitle: `${stats.publishedPosts} published, ${stats.draftPosts} drafts`,
      color: "from-primary to-secondary",
      icon: "blog"
    },
    {
      title: "Total Projects", 
      value: stats.totalProjects,
      subtitle: `${stats.liveProjects} live, ${stats.devProjects} in development`,
      color: "from-accent to-neutral",
      icon: "projects"
    },
    {
      title: "Published Content",
      value: stats.publishedPosts,
      subtitle: "Live blog posts",
      color: "from-secondary to-accent", 
      icon: "published"
    },
    {
      title: "Active Projects",
      value: stats.liveProjects + stats.devProjects,
      subtitle: "Live + Development",
      color: "from-neutral to-primary",
      icon: "live"
    }
  ];

  const quickActions = [
    {
      title: "Manage Blog Posts",
      description: "Create, edit, and publish blog posts",
      action: "View Posts",
      href: "/admin/blog",
      icon: "blog"
    },
    {
      title: "Manage Projects",
      description: "Update project information and status", 
      action: "View Projects",
      href: "/admin/projects",
      icon: "projects"
    },
    {
      title: "Site Analytics",
      description: "View portfolio performance metrics",
      action: "View Analytics", 
      href: "/admin/analytics",
      icon: "analytics"
    },
    {
      title: "Site Settings",
      description: "Configure portfolio settings",
      action: "Settings",
      href: "/admin/settings", 
      icon: "settings"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9]" style={{ background: '#fafaf9' }}>
      {/* Solid background overlay to prevent any background images from showing */}
      <div className="fixed inset-0 bg-[#fafaf9] z-0" style={{ background: '#fafaf9', backgroundImage: 'none' }} />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-background border-b border-accent/10 sticky top-0 z-20 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <Typography variant="heading" className="text-foreground text-xl sm:text-2xl">
                  Admin Dashboard
                </Typography>
                <Typography variant="body" className="text-foreground/60 text-sm">
                  Welcome back, Admin
                </Typography>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/")}
                  className="text-xs sm:text-sm"
                >
                  View Portfolio
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleLogout}
                  className="text-xs sm:text-sm"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Stats Grid */}
            <motion.div variants={scrollReveal}>
              <Typography variant="subheading" className="text-foreground mb-6">
                Overview
              </Typography>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {statCards.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    variants={scrollReveal}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-4 sm:p-6 bg-background/50 border-accent/20 hover:border-accent/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <Typography variant="body" className="text-foreground/70 text-sm">
                            {stat.title}
                          </Typography>
                          <Typography variant="heading" className="text-2xl sm:text-3xl font-bold text-foreground">
                            {stat.value}
                          </Typography>
                          <Typography variant="body" className="text-foreground/60 text-xs">
                            {stat.subtitle}
                          </Typography>
                        </div>
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                          <Icon name={stat.icon} size="lg" className="text-background" />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={scrollReveal}>
              <Typography variant="subheading" className="text-foreground mb-6">
                Quick Actions
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    variants={scrollReveal}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 bg-background/50 border-accent/20 hover:border-accent/30 transition-all duration-300 group cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                          <Icon name={action.icon} size="lg" />
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <Typography variant="body" className="font-semibold text-foreground group-hover:text-accent transition-colors">
                            {action.title}
                          </Typography>
                          <Typography variant="body" className="text-foreground/70 text-sm">
                            {action.description}
                          </Typography>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-3"
                            onClick={() => router.push(action.href)}
                          >
                            {action.action} →
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={scrollReveal}>
              <Typography variant="subheading" className="text-foreground mb-6">
                Recent Activity
              </Typography>
              
              <Card className="p-6 bg-background/50 border-accent/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-surface/30 rounded-lg">
                    <span className="text-green-500">✅</span>
                    <div className="flex-1">
                      <Typography variant="body" className="text-foreground text-sm">
                        Blog post "Getting Started with React" published
                      </Typography>
                      <Typography variant="body" className="text-foreground/60 text-xs">
                        2 hours ago
                      </Typography>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-surface/30 rounded-lg">
                    <span className="text-blue-500">🔄</span>
                    <div className="flex-1">
                      <Typography variant="body" className="text-foreground text-sm">
                        Project "Super Team" status updated to development
                      </Typography>
                      <Typography variant="body" className="text-foreground/60 text-xs">
                        1 day ago
                      </Typography>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-surface/30 rounded-lg">
                    <span className="text-purple-500">📝</span>
                    <div className="flex-1">
                      <Typography variant="body" className="text-foreground text-sm">
                        New blog post draft "Building My First Game" created
                      </Typography>
                      <Typography variant="body" className="text-foreground/60 text-xs">
                        3 days ago
                      </Typography>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}