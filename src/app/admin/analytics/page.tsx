"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Typography, Button, Card } from "@/components/ui";
import { scrollReveal, staggerContainer } from "@/lib/animations";
import { base64UrlDecode } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function AdminAnalyticsPage() {
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
      const tokenData = JSON.parse(base64UrlDecode(token.split('.')[1]));
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
            Loading analytics...
          </Typography>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const [analyticsData, setAnalyticsData] = useState({
    metrics: [
      { label: "Page Views", value: "0", change: "0%", color: "text-gray-600" },
      { label: "Unique Visitors", value: "0", change: "0%", color: "text-gray-600" },
      { label: "Blog Views", value: "0", change: "0%", color: "text-gray-600" },
      { label: "Project Views", value: "0", change: "0%", color: "text-gray-600" },
    ],
    isLoading: true,
    error: null as string | null
  });

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch('/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();
      setAnalyticsData({
        metrics: data.metrics,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalyticsData({
        metrics: analyticsData.metrics,
        isLoading: false,
        error: 'Failed to load analytics data'
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics();
    }
  }, [isAuthenticated]);

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
                Analytics
              </Typography>
              <Typography variant="body" className="text-foreground/60 mt-2">
                Portfolio performance metrics
              </Typography>
            </motion.div>

            {/* Analytics Cards */}
            <motion.div variants={scrollReveal}>
              <Typography variant="subheading" className="text-foreground mb-6">
                Overview (Last 30 Days)
              </Typography>

              {analyticsData.isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, index) => (
                    <motion.div
                      key={index}
                      variants={scrollReveal}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 bg-background/50 border-accent/20">
                        <div className="space-y-2">
                          <div className="h-4 bg-accent/20 rounded animate-pulse" />
                          <div className="flex items-end gap-2">
                            <div className="h-8 bg-accent/20 rounded animate-pulse w-20" />
                            <div className="h-4 bg-accent/20 rounded animate-pulse w-12" />
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : analyticsData.error ? (
                <Card className="p-6 bg-background/50 border-accent/20 text-center">
                  <Typography variant="body" className="text-red-600 mb-4">
                    {analyticsData.error}
                  </Typography>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={fetchAnalytics}
                  >
                    Try Again
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {analyticsData.metrics.map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      variants={scrollReveal}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 bg-background/50 border-accent/20">
                        <div className="space-y-2">
                          <Typography variant="body" className="text-foreground/70 text-sm">
                            {metric.label}
                          </Typography>
                          <div className="flex items-end gap-2">
                            <Typography variant="heading" className="text-2xl font-bold text-foreground">
                              {metric.value}
                            </Typography>
                            <span className={`text-sm font-medium ${metric.color}`}>
                              {metric.change}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Coming Soon */}
            <motion.div variants={scrollReveal}>
              <Card className="p-12 bg-background/50 border-accent/20 text-center">
                <div className="space-y-4">
                  <div className="text-4xl mb-4">📊</div>
                  <Typography variant="heading" className="text-foreground">
                    Advanced Analytics Coming Soon
                  </Typography>
                  <Typography variant="body" className="text-foreground/70 max-w-md mx-auto">
                    Detailed analytics including visitor demographics, popular content, 
                    and performance insights will be available in future updates.
                  </Typography>
                  <div className="pt-4">
                    <Typography variant="body" className="text-foreground/60 text-sm">
                      Current data shown is for demonstration purposes
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