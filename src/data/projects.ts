// Project data for the portfolio
export interface Project {
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

export const projects: Project[] = [
  {
    id: "super-team",
    title: "Super Team",
    description: "An E-Commerce website that sells multiple types of products",
    longDescription: "Super Team is an E-Commerce platform currently in development that will offer a wide variety of products across different categories. Built with modern web technologies, it features a clean user interface, secure payment processing, and an intuitive shopping experience. The project showcases full-stack development skills and modern e-commerce best practices.",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Supabase"],
    liveUrl: "https://super-team.vercel.app",
    githubUrl: "",
    imageUrl: "/projects/super-team.jpg",
    featured: true,
    category: "web",
    year: "2025",
    status: "development"
  },
  {
    id: "zypher-cloud",
    title: "Zypher Cloud",
    description: "A hosting provider offering Minecraft, VPS, Web, and Bot hosting at affordable prices",
    longDescription: "Zypher Cloud is a hosting provider that offers Minecraft server hosting, VPS solutions, web hosting, and bot hosting services at competitive prices. It is a Demo Project, based on an actual Hosting Provider!",
    technologies: ["React", "Next.js", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    liveUrl: "https://zypher-cloud.vercel.app",
    githubUrl: "",
    imageUrl: "/projects/zypher-cloud.jpg",
    featured: true,
    category: "web",
    year: "2025",
    status: "development"
  },
  {
    id: "cute-cloud",
    title: "Cute Cloud",
    description: "A hosting provider offering Minecraft, VPS, Web, and Bot hosting with a cute, user-friendly interface",
    longDescription: "Cute Cloud is a hosting provider that offers Minecraft server hosting, VPS solutions, web hosting, and bot hosting services with an emphasis on user-friendly design and affordable pricing. It is a Demo Project based on an actual Hosting Provider!.",
    technologies: ["React", "Next.js", "Tailwind CSS", "Node.js", "MongoDB"],
    liveUrl: "https://cute-cloud.vercel.app",
    githubUrl: "",
    imageUrl: "/projects/cute-cloud.jpg",
    featured: false,
    category: "web",
    year: "2025",
    status: "development"
  },
  {
    id: "gamer-grove",
    title: "Gamer Grove",
    description: "An immersive gaming community platform where players connect, share experiences, and discover new games together.",
    longDescription: "Gamer Grove was the ultimate destination for gaming enthusiasts. It combined social networking with gaming discovery, featuring game reviews, community discussions, achievement tracking, and personalized game recommendations powered by advanced algorithms. The project has been terminated but showcases advanced full-stack development skills.",
    technologies: ["Next.js", "Prisma", "MongoDB", "Socket.io"],
    liveUrl: "",
    githubUrl: "",
    imageUrl: "/projects/gamer-grove.jpg",
    featured: false,
    category: "game",
    year: "2024",
    status: "archived"
  }
];

export const getProjectsByCategory = (category: Project['category']) => {
  return projects.filter(project => project.category === category);
};

export const getFeaturedProjects = () => {
  return projects.filter(project => project.featured);
};

export const getProjectById = (id: string) => {
  return projects.find(project => project.id === id);
};