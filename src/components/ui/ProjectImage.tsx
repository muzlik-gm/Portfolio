"use client";

import { motion } from "framer-motion";

interface ProjectImageProps {
  projectId: string;
  title: string;
  category: 'web' | 'game' | 'other';
  className?: string;
}

export function ProjectImage({ projectId, title, category, className = "" }: ProjectImageProps) {
  // Generate meaningful visual representations for each project
  const getProjectVisual = () => {
    switch (projectId) {
      case "super-team":
        return (
          <div className="relative w-full h-full overflow-hidden">
            {/* Actual project screenshot */}
            <img 
              src="/super-team-screenshot.png" 
              alt="Super Team project screenshot"
              className="w-full h-full object-cover"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent" />
            
            {/* Status indicator */}
            <div className="absolute top-2 right-2 bg-green-500/20 backdrop-blur-sm rounded-full px-2 py-1">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-300 font-medium">Live</span>
              </div>
            </div>
          </div>
        );

      case "zypher-cloud":
        return (
          <div className="relative w-full h-full overflow-hidden">
            {/* Actual project screenshot */}
            <img 
              src="/zypher-cloud-screenshot.png" 
              alt="Zypher Cloud project screenshot"
              className="w-full h-full object-cover"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 via-transparent to-transparent" />
            
            {/* Status indicator */}
            <div className="absolute top-2 right-2 bg-green-500/20 backdrop-blur-sm rounded-full px-2 py-1">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-300 font-medium">Live</span>
              </div>
            </div>
          </div>
        );

      case "cute-cloud":
        return (
          <div className="relative w-full h-full overflow-hidden">
            {/* Actual project screenshot */}
            <img 
              src="/cute-cloud-screenshot.png" 
              alt="Cute Cloud project screenshot"
              className="w-full h-full object-cover"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 via-transparent to-transparent" />
            
            {/* Status indicator */}
            <div className="absolute top-2 right-2 bg-green-500/20 backdrop-blur-sm rounded-full px-2 py-1">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-300 font-medium">Live</span>
              </div>
            </div>
          </div>
        );

      case "gamer-grove":
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-gray-500/20 to-gray-700/20 flex items-center justify-center overflow-hidden">
            {/* Background pattern with desaturated effect */}
            <div className="absolute inset-0 opacity-30 grayscale">
              <img 
                src="/globe.svg" 
                alt="Globe pattern"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Gaming visual with muted colors */}
            <div className="relative z-10">
              <motion.div
                className="w-14 h-10 bg-gray-400/30 rounded-lg border border-gray-400/40 flex items-center justify-center"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span className="text-2xl opacity-80">🎮</span>
              </motion.div>
              
              {/* Muted elements */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-gray-400/40 rounded-full" />
              <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-gray-400/40 rounded-full" />
            </div>
            
            {/* Terminated status */}
            <div className="absolute top-2 right-2 bg-red-500/20 backdrop-blur-sm rounded-full px-2 py-1">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                <span className="text-xs text-red-300 font-medium">Terminated</span>
              </div>
            </div>
            
            {/* Overlay to show it's archived */}
            <div className="absolute inset-0 bg-gray-900/20" />
          </div>
        );

      default:
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
            <span className="text-4xl opacity-60">💻</span>
          </div>
        );
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {getProjectVisual()}
      
      {/* Overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        <div className="text-center space-y-2">
          <span className="text-3xl opacity-80">↗</span>
          <div className="text-sm font-medium text-foreground">View Project</div>
        </div>
      </motion.div>
    </div>
  );
}