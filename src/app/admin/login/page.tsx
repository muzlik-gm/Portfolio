"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Typography, Button } from "@/components/ui";
import { scrollReveal } from "@/lib/animations";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
   const [credentials, setCredentials] = useState({
     email: "",
     password: ""
   });
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState("");
   const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    console.log('[LOGIN PAGE] Submitting login with email:', credentials.email);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log('[LOGIN PAGE] Login response:', response.status, data);

      if (response.ok) {
        console.log('[LOGIN PAGE] Login successful, storing token');
        console.log('[LOGIN PAGE] Response data structure:', JSON.stringify(data, null, 2));
        // Store the token in localStorage
        localStorage.setItem("adminToken", data.data.token);
        console.log('[LOGIN PAGE] Token stored in localStorage:', localStorage.getItem("adminToken") ? 'YES' : 'NO');
        console.log('[LOGIN PAGE] Redirecting to dashboard');
        // Add a small delay to ensure token is persisted
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 100);
      } else {
        console.log('[LOGIN PAGE] Login failed with message:', data.message);
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error('[LOGIN PAGE] Login error:', error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-surface/20 to-background grid-pattern-lg flex items-center justify-center p-4 sm:p-6 overflow-auto">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-accent/5 rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 border border-primary/5 rounded-2xl rotate-45" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-sm sm:max-w-md"
        variants={scrollReveal}
        initial="hidden"
        animate="visible"
      >
        {/* Login Card */}
        <div className="bg-background/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-accent/10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="text-background" size={32} />
            </div>
            <Typography variant="heading" className="text-foreground mb-2 text-xl sm:text-2xl">
              Admin Login
            </Typography>
            <Typography variant="body" className="text-foreground/70 text-sm sm:text-base">
              Access the admin dashboard
            </Typography>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/80">
                Email
              </label>
              <motion.input
                type="email"
                value={credentials.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-3 sm:py-4 bg-surface/30 border border-accent/20 rounded-xl text-foreground placeholder-foreground/50 focus:outline-none focus:border-accent focus:bg-surface/50 focus:ring-2 focus:ring-accent/20 transition-all duration-300 text-sm sm:text-base"
                placeholder="Enter admin email"
                required
                whileFocus={{ 
                  scale: 1.01
                }}
                transition={{ duration: 0.2 }}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/80">
                Password
              </label>
              <motion.input
                type="password"
                value={credentials.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="w-full px-4 py-3 sm:py-4 bg-surface/30 border border-accent/20 rounded-xl text-foreground placeholder-foreground/50 focus:outline-none focus:border-accent focus:bg-surface/50 focus:ring-2 focus:ring-accent/20 transition-all duration-300 text-sm sm:text-base"
                placeholder="Enter admin password"
                required
                whileFocus={{ 
                  scale: 1.01
                }}
                transition={{ duration: 0.2 }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 sm:p-4"
              >
                <Typography variant="body" className="text-red-600 text-sm text-center">
                  {error}
                </Typography>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 sm:py-4 text-sm sm:text-base font-medium bg-accent text-background rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </motion.div>
          </form>

          {/* Footer */}
          <div className="mt-6 sm:mt-8 text-center">
            <Typography variant="body" className="text-foreground/60 text-xs sm:text-sm">
              Authorized personnel only
            </Typography>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <motion.button
            onClick={() => router.push("/")}
            className="text-foreground/60 hover:text-foreground transition-colors text-sm flex items-center justify-center gap-2 mx-auto"
            whileHover={{ x: -2 }}
            transition={{ duration: 0.2 }}
          >
            <span>←</span>
            <span>Back to Portfolio</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}