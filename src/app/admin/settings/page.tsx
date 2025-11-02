"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Typography, Button, Card } from "@/components/ui";
import { scrollReveal, staggerContainer } from "@/lib/animations";
import { useRouter } from "next/navigation";

export default function AdminSettingsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

    // Verify token
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      if (tokenData.exp * 1000 < Date.now()) {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
        return;
      }
      
      setIsAuthenticated(true);
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
            Loading settings...
          </Typography>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const settingsSections = [
    {
      title: "Profile Settings",
      description: "Update your personal information and bio",
      icon: "👤",
      items: [
        "Personal Information",
        "Bio and Description", 
        "Social Media Links",
        "Profile Picture"
      ]
    },
    {
      title: "Site Configuration",
      description: "Configure portfolio appearance and behavior",
      icon: "⚙️",
      items: [
        "Theme Settings",
        "Navigation Menu",
        "Footer Content",
        "SEO Settings"
      ]
    },
    {
      title: "Content Management",
      description: "Manage blog and project content settings",
      icon: "📝",
      items: [
        "Blog Settings",
        "Project Categories",
        "Featured Content",
        "Content Moderation"
      ]
    },
    {
      title: "Security",
      description: "Security and authentication settings",
      icon: "🔒",
      items: [
        "Change Password",
        "Two-Factor Authentication",
        "Login Sessions",
        "Security Logs"
      ]
    }
  ];

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
                Settings
              </Typography>
              <Typography variant="body" className="text-foreground/60 mt-2">
                Configure your portfolio settings
              </Typography>
            </motion.div>

            {/* Settings Sections */}
            <motion.div variants={scrollReveal}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {settingsSections.map((section, index) => (
                  <motion.div
                    key={section.title}
                    variants={scrollReveal}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 bg-background/50 border-accent/20 hover:border-accent/30 transition-all duration-300 group cursor-pointer h-full">
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                            <span className="text-2xl">{section.icon}</span>
                          </div>
                          
                          <div className="flex-1">
                            <Typography variant="subheading" className="text-foreground group-hover:text-accent transition-colors">
                              {section.title}
                            </Typography>
                            <Typography variant="body" className="text-foreground/70 text-sm mt-1">
                              {section.description}
                            </Typography>
                          </div>
                        </div>
                        
                        <div className="space-y-2 pl-16">
                          {section.items.map((item) => (
                            <div key={item} className="flex items-center gap-2 text-sm text-foreground/60">
                              <span className="w-1 h-1 bg-accent/60 rounded-full" />
                              {item}
                            </div>
                          ))}
                        </div>
                        
                        <div className="pl-16 pt-2">
                          <Button variant="ghost" size="sm">
                            Configure →
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Coming Soon Notice */}
            <motion.div variants={scrollReveal}>
              <Card className="p-8 bg-background/50 border-accent/20 text-center">
                <div className="space-y-4">
                  <div className="text-3xl mb-2">🚧</div>
                  <Typography variant="subheading" className="text-foreground">
                    Settings Panel Under Development
                  </Typography>
                  <Typography variant="body" className="text-foreground/70 max-w-md mx-auto">
                    The settings interface is currently being developed. 
                    Advanced configuration options will be available soon.
                  </Typography>
                  <div className="pt-4">
                    <Typography variant="body" className="text-foreground/60 text-sm">
                      For now, settings can be modified directly in the code
                    </Typography>
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