"use client";

import { Layout } from "@/components/layout";
import { Section, Typography, Button, Card, SectionDivider } from "@/components/ui";
import { ParallaxBackground } from "@/components/effects";
import { blogPosts, getBlogCategories, getFeaturedPosts } from "@/data/blog";
import { motion, AnimatePresence } from "framer-motion";
import { scrollReveal, staggerContainer } from "@/lib/animations";
import { formatDate } from "@/lib/date";
import { useState } from "react";
import Link from "next/link";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categories = ['all', ...getBlogCategories()];
  const featuredPosts = getFeaturedPosts();

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts.filter(post => post.status === 'published')
    : blogPosts.filter(post => post.category === selectedCategory && post.status === 'published');

  return (
    <Layout>
      {/* Hero Section */}
      <Section 
        id="blog-hero" 
        className="hero-grid relative overflow-hidden flex items-center justify-center pt-20 md:pt-24"
        fullHeight={true}
      >
        <ParallaxBackground speed="slow" className="absolute inset-0">
          <div className="absolute inset-0 opacity-20">
            <img 
              src="/wave-haikei.svg" 
              alt="Background waves"
              className="w-full h-full object-cover"
            />
          </div>
        </ParallaxBackground>

        <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Typography variant="hero">My Blog</Typography>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Typography variant="body" className="text-foreground/80 text-lg leading-relaxed max-w-3xl mx-auto">
              Thoughts, tutorials, and insights from my journey as a developer. 
              Sharing what I learn about web development, game creation, and technology.
            </Typography>
          </motion.div>

          {/* Blog Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex justify-center gap-8 pt-8"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{blogPosts.filter(p => p.status === 'published').length}</div>
              <div className="text-sm text-foreground/60">Articles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{categories.length - 1}</div>
              <div className="text-sm text-foreground/60">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">{featuredPosts.length}</div>
              <div className="text-sm text-foreground/60">Featured</div>
            </div>
          </motion.div>
        </div>
      </Section>

      <SectionDivider type="wave" />

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <Section background="surface" className="grid-pattern-dots">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-16"
          >
            <div className="text-center">
              <Typography variant="heading">Featured Articles</Typography>
              <Typography variant="body" className="text-foreground/70 mt-4 max-w-2xl mx-auto">
                Highlighted posts covering my latest projects and learning experiences
              </Typography>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {featuredPosts.slice(0, 2).map((post, index) => (
                <motion.div
                  key={post.id}
                  variants={scrollReveal}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/blog/${post.id}`}>
                    <Card className="h-full overflow-hidden bg-background/50 border-accent/20 hover:border-accent/40 hover:shadow-medium transition-all duration-300 group cursor-pointer">
                      {/* Post Image */}
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl opacity-50">📝</span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent border border-accent/30">
                            Featured
                          </span>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="p-6 space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm text-foreground/60">
                            <span>{post.category}</span>
                            <span>{post.readTime} min read</span>
                          </div>
                          
                          <Typography variant="subheading" className="text-foreground group-hover:text-accent transition-colors">
                            {post.title}
                          </Typography>
                          
                          <Typography variant="body" className="text-foreground/70 text-sm leading-relaxed">
                            {post.excerpt}
                          </Typography>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs bg-surface/50 text-foreground/60 rounded-lg"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Meta */}
                        <div className="flex items-center justify-between pt-2 text-sm text-foreground/60">
                          <span>By {post.author}</span>
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Section>
      )}

      <SectionDivider type="layered-wave" flip />

      {/* All Posts */}
      <Section>
        <div className="space-y-16">
          {/* Category Filter */}
          <motion.div
            className="flex justify-center"
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex flex-wrap justify-center bg-background/50 backdrop-blur-sm rounded-2xl p-2 border border-accent/10 gap-1 sm:gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 py-2 rounded-xl font-medium transition-all duration-300 text-xs sm:text-sm ${
                    selectedCategory === category
                      ? "bg-accent text-background shadow-soft"
                      : "text-foreground/70 hover:text-foreground hover:bg-surface/50"
                  }`}
                >
                  {category === 'all' ? 'All Posts' : category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Posts Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <AnimatePresence>
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  variants={scrollReveal}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/blog/${post.id}`}>
                    <Card className="h-full overflow-hidden bg-background/50 border-accent/20 hover:border-accent/40 hover:shadow-medium transition-all duration-300 group cursor-pointer">
                      {/* Post Image */}
                      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl opacity-40">
                            {post.category === 'Web Development' ? '💻' : 
                             post.category === 'Game Development' ? '🎮' : 
                             post.category === 'Projects' ? '🚀' : '📝'}
                          </span>
                        </div>
                        {post.featured && (
                          <div className="absolute top-3 right-3">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent border border-accent/30">
                              Featured
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Post Content */}
                      <div className="p-5 space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-foreground/60">
                            <span>{post.category}</span>
                            <span>{post.readTime} min</span>
                          </div>
                          
                          <Typography variant="body" className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                            {post.title}
                          </Typography>
                          
                          <Typography variant="body" className="text-foreground/70 text-sm leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </Typography>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs bg-surface/30 text-foreground/60 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Meta */}
                        <div className="flex items-center justify-between pt-2 text-xs text-foreground/60 border-t border-accent/10">
                          <span>{post.author}</span>
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredPosts.length === 0 && (
            <motion.div
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center py-16"
            >
              <Typography variant="body" className="text-foreground/60">
                No posts found in this category.
              </Typography>
            </motion.div>
          )}
        </div>
      </Section>
    </Layout>
  );
}