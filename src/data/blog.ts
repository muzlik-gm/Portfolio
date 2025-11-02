// Blog data for the portfolio
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  category: string;
  featured: boolean;
  readTime: number; // in minutes
  imageUrl?: string;
  status: 'published' | 'draft';
}

export const blogPosts: BlogPost[] = [
  {
    id: "getting-started-with-react",
    title: "Getting Started with React: A Beginner's Journey",
    excerpt: "My experience learning React from scratch and the challenges I faced along the way. Tips and tricks for new developers starting their React journey.",
    content: `# Getting Started with React: A Beginner's Journey

When I first started learning React, I was overwhelmed by the concepts of components, state, and props. Coming from vanilla JavaScript, the idea of JSX seemed foreign and complicated.

## The Learning Curve

React has a steep learning curve, but once you understand the fundamentals, it becomes incredibly powerful. Here are the key concepts that helped me:

### 1. Components are Everything
Think of components as reusable pieces of UI. Each component should have a single responsibility.

### 2. State Management
Understanding when and how to use state is crucial. Start with useState and gradually move to more complex state management solutions.

### 3. Props for Communication
Props are how components talk to each other. They flow down from parent to child components.

## My First Project

My first React project was a simple todo app. It taught me the basics of:
- Creating components
- Managing state
- Handling events
- Conditional rendering

## Tips for Beginners

1. **Start Small**: Don't try to build a complex app right away
2. **Practice Daily**: Consistency is key in learning React
3. **Read the Docs**: React's documentation is excellent
4. **Build Projects**: Theory is good, but practice makes perfect

React has become my favorite frontend framework, and I'm excited to continue learning and building with it!`,
    author: "Hamza",
    publishedAt: "2024-12-15",
    tags: ["React", "JavaScript", "Frontend", "Beginner"],
    category: "Web Development",
    featured: true,
    readTime: 5,
    imageUrl: "/blog/react-journey.jpg",
    status: "published"
  },
  {
    id: "building-my-first-game",
    title: "Building My First Game with Unity",
    excerpt: "The journey of creating my first game using Unity and C#. From concept to completion, here's what I learned about game development.",
    content: `# Building My First Game with Unity

Game development has always fascinated me. After months of web development, I decided to try my hand at creating games with Unity.

## Choosing Unity

Unity seemed like the perfect choice because:
- Great community support
- Excellent documentation
- Cross-platform deployment
- Visual scripting options

## The Game Concept

I started with a simple 2D platformer. The concept was straightforward:
- Player controls a character
- Collect coins
- Avoid obstacles
- Reach the end goal

## Challenges Faced

### 1. Physics System
Understanding Unity's physics system took time. Rigidbody components and colliders were new concepts.

### 2. Animation
Creating smooth character animations required learning Unity's Animator system.

### 3. Game Logic
Implementing game states, scoring, and level progression was more complex than expected.

## What I Learned

Game development is incredibly rewarding but requires patience and persistence. Every bug fixed and feature implemented feels like a small victory.

The combination of programming, art, and design makes game development a unique and exciting field.

## Next Steps

I'm planning to:
- Learn more about 3D game development
- Explore different game genres
- Participate in game jams
- Improve my art and design skills

Game development has opened up a whole new world of creativity for me!`,
    author: "Hamza",
    publishedAt: "2024-12-10",
    tags: ["Unity", "Game Development", "C#", "2D Games"],
    category: "Game Development",
    featured: true,
    readTime: 7,
    imageUrl: "/blog/unity-game.jpg",
    status: "published"
  },
  {
    id: "hosting-provider-demo-projects",
    title: "Building Demo Hosting Provider Platforms",
    excerpt: "Creating Zypher Cloud and Cute Cloud as demo projects to showcase modern hosting platform interfaces and user experiences.",
    content: `# Building Demo Hosting Provider Platforms

As part of my portfolio development, I created two demo hosting provider platforms: Zypher Cloud and Cute Cloud. These projects showcase different approaches to hosting service interfaces.

## Project Goals

The main objectives were:
- Demonstrate full-stack development skills
- Create modern, responsive interfaces
- Showcase different design philosophies
- Learn about the hosting industry

## Zypher Cloud

Zypher Cloud focuses on a professional, clean interface for hosting services including:
- Minecraft server hosting
- VPS solutions
- Web hosting
- Bot hosting

### Technical Stack
- React & Next.js for the frontend
- Node.js & Express for the backend
- MongoDB for data storage
- Tailwind CSS for styling

## Cute Cloud

Cute Cloud takes a different approach with a more playful, user-friendly design while offering the same hosting services.

### Design Philosophy
- Approachable for beginners
- Cute and friendly interface
- Simplified user experience
- Colorful and engaging design

## Challenges and Solutions

### 1. Service Management Interface
Creating intuitive dashboards for managing hosting services required careful UX planning.

### 2. Pricing Display
Designing clear pricing tables that work across different screen sizes.

### 3. Demo Limitations
Balancing functionality demonstration with the limitations of a demo project.

## What I Learned

Building these demo projects taught me:
- Industry-specific UI/UX patterns
- Complex dashboard design
- Service-oriented architecture concepts
- The importance of clear information hierarchy

## Future Enhancements

While these remain demo projects, potential improvements could include:
- Real payment integration
- Advanced server management features
- Live chat support
- Mobile applications

These projects demonstrate my ability to create industry-specific applications with modern web technologies.`,
    author: "Hamza",
    publishedAt: "2024-12-05",
    tags: ["Web Development", "Hosting", "Demo Projects", "UI/UX"],
    category: "Projects",
    featured: false,
    readTime: 6,
    imageUrl: "/blog/hosting-platforms.jpg",
    status: "published"
  },
  {
    id: "e-commerce-development-journey",
    title: "Developing Super Team: An E-Commerce Platform",
    excerpt: "The ongoing development of Super Team, an e-commerce platform. Challenges, solutions, and lessons learned in building a modern online store.",
    content: `# Developing Super Team: An E-Commerce Platform

Super Team is my most ambitious project yet - a full-featured e-commerce platform currently in development. Here's my journey building it.

## Project Overview

Super Team aims to be a comprehensive e-commerce solution offering:
- Multiple product categories
- Secure payment processing
- User account management
- Order tracking
- Admin dashboard

## Technical Decisions

### Frontend
- **Next.js**: For server-side rendering and performance
- **TypeScript**: For type safety and better development experience
- **Tailwind CSS**: For rapid UI development

### Backend
- **Node.js & Express**: For the API server
- **MongoDB**: For flexible data storage
- **JWT**: For authentication

## Development Challenges

### 1. Product Management
Creating a flexible product system that can handle various product types and categories.

### 2. Shopping Cart Logic
Implementing persistent shopping carts that work across sessions and devices.

### 3. Payment Integration
Planning for secure payment processing while maintaining user experience.

### 4. Inventory Management
Designing systems for tracking product availability and stock levels.

## Current Progress

The project is actively in development with these completed features:
- Product catalog display
- Basic user authentication
- Shopping cart functionality
- Responsive design

## Upcoming Features

Next development phases will include:
- Payment gateway integration
- Order management system
- Admin dashboard
- Email notifications
- Search and filtering

## Lessons Learned

E-commerce development is complex and requires careful planning of:
- Data relationships
- User workflows
- Security considerations
- Performance optimization

## The Road Ahead

Super Team represents my growth as a developer and my ability to handle complex, real-world applications. The project continues to evolve as I learn and implement new features.

Building an e-commerce platform has taught me the importance of user experience, security, and scalable architecture.`,
    author: "Hamza",
    publishedAt: "2024-11-28",
    tags: ["E-Commerce", "Next.js", "MongoDB", "Full-Stack"],
    category: "Projects",
    featured: true,
    readTime: 8,
    imageUrl: "/blog/super-team-development.jpg",
    status: "published"
  }
];

export const getBlogPostsByCategory = (category: string) => {
  return blogPosts.filter(post => post.category === category && post.status === 'published');
};

export const getFeaturedPosts = () => {
  return blogPosts.filter(post => post.featured && post.status === 'published');
};

export const getBlogPostById = (id: string) => {
  return blogPosts.find(post => post.id === id);
};

export const getPublishedPosts = () => {
  return blogPosts.filter(post => post.status === 'published');
};

export const getBlogCategories = () => {
  const categories = blogPosts.map(post => post.category);
  return [...new Set(categories)];
};

export const getAllTags = () => {
  const tags = blogPosts.flatMap(post => post.tags);
  return [...new Set(tags)];
};