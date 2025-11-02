// About section data
export interface TimelineItem {
  year: string;
  title: string;
  description: string;
  type: 'milestone' | 'project' | 'learning';
}

export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'game' | 'tools';
  proficiency: number; // 1-5 scale
  icon?: string;
}

export const personalInfo = {
  name: "Hamza",
  age: 17,
  location: "Pakistan",
  title: "Web & Game Developer",
  bio: "I'm a passionate Web & Game Developer from Pakistan. I like coding alot, and by alot I actually mean it. To-Be-Honest I spend most of my time programming something new or just recreating my versions of Famous SaaS products or just creating a new design. Even though I started Web Developement at the age of 15!",
  mission: "To create Beautiful & Powerful Websites that serves solely to it's Users and Benifit them in every way.",
  values: [
    "Innovation through simplicity",
    "User-centered design",
    "Continuous learning",
    "Community collaboration"
  ]
};

export const timeline: TimelineItem[] = [
  {
    year: "Early 2023",
    title: "Started Programming",
    description: "I started Programming and got very excited about that",
    type: "milestone"
  },
  {
    year: "Midst 2023",
    title: "Web Development Journey",
    description: "Started learning HTML, CSS, and JavaScript. Built my first Simple website.",
    type: "learning"
  },
  {
    year: "Early 2024",
    title: "React & Modern Frameworks",
    description: "Started Learning multiple Frameworks like React & Vite (Mainly)",
    type: "learning"
  },
  {
    year: "Midst 2024",
    title: "Game Development Exploration",
    description: "I found Game Developement interesting and started Learning Game Dev in my Free Time.",
    type: "learning"
  },
  {
    year: "2025",
    title: "Professional Projects",
    description: "I started working on Full Stack Projects like Game-Grove, ZypherCloud and some other Projects for learning Purposes.",
    type: "project"
  }
];

export const skills: Skill[] = [
  // Frontend
  { name: "React", category: "frontend", proficiency: 5 },
  { name: "Next.js", category: "frontend", proficiency: 5 },
  { name: "Tailwind CSS", category: "frontend", proficiency: 5 },
  { name: "HTML", category: "frontend", proficiency: 5 },
  { name: "CSS", category: "frontend", proficiency: 5 },
  { name: "JavaScript", category: "frontend", proficiency: 5 },
  
  // Backend
  { name: "Node.js", category: "backend", proficiency: 4 },
  { name: "Express", category: "backend", proficiency: 4 },
  { name: "MongoDB", category: "backend", proficiency: 4 },
  
  // Game Development
  { name: "Unity", category: "game", proficiency: 3 },
  { name: "C#", category: "game", proficiency: 3 },
  
  // Tools
  { name: "Git", category: "tools", proficiency: 4 },
  { name: "Vercel", category: "tools", proficiency: 5 },
];

export const getSkillsByCategory = (category: Skill['category']) => {
  return skills.filter(skill => skill.category === category);
};

export const achievements = [
  "Multiple Successfuly Deployements (I mean Working!)",
  "Self-taught developer with continuous learning mindset",
  "Active in developer communities (Sometime)",
  "I've Life Man, can't just Stare at Screen"
];