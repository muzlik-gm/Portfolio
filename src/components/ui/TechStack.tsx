"use client";

import { motion } from "framer-motion";
import * as LucideIcons from 'lucide-react';

interface TechStackProps {
  technologies: string[];
  className?: string;
}

// Map technology names to Lucide icons
const getTechIcon = (tech: string): keyof typeof LucideIcons => {
  const techMap: { [key: string]: keyof typeof LucideIcons } = {
    // Frontend
    "React": "Atom",
    "Next.js": "Triangle",
    "Vue.js": "Layers",
    "TypeScript": "FileCode2",
    "JavaScript": "FileCode",
    "HTML": "Globe",
    "CSS": "Palette",
    "Tailwind CSS": "Wind",
    "Material-UI": "Palette",
    "Framer Motion": "Film",
    
    // Backend
    "Node.js": "Server",
    "Express": "Zap",
    "MongoDB": "Database",
    "PostgreSQL": "Database",
    "MySQL": "Database",
    "Firebase": "Flame",
    "Prisma": "Triangle",
    
    // Tools & Others
    "Socket.io": "Plug",
    "Redis": "Package",
    "Three.js": "Box",
    "WebGL": "Box",
    "PWA": "Smartphone",
    "AWS S3": "Cloud",
    "AWS": "Cloud",
    "WebRTC": "Video",
    "GSAP": "Sparkles",
    "Lenis": "ScrollText",
    "Git": "GitBranch",
    "VS Code": "Code",
    "Vercel": "Triangle",
    "Unity": "Gamepad2",
    "C#": "FileCode2"
  };

  return techMap[tech] || "Wrench"; // Generic fallback
};

export function TechStack({ technologies, className = "" }: TechStackProps) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {technologies.map((tech, index) => {
        const iconName = getTechIcon(tech);
        const IconComponent = LucideIcons[iconName] as React.ComponentType<{ size?: number; className?: string }>;
        
        return (
          <motion.div
            key={tech}
            className="flex items-center gap-2 bg-surface/30 backdrop-blur-sm rounded-lg px-3 py-2 border-2 border-accent/40 hover:border-accent/60 transition-colors group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.1, 
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover={{ 
              y: -2,
              boxShadow: "0 4px 20px rgba(139, 99, 92, 0.15)"
            }}
          >
            <IconComponent 
              size={16} 
              className="group-hover:scale-110 transition-transform duration-200 text-accent" 
            />
            <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
              {tech}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}