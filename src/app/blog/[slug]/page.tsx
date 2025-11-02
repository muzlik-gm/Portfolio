"use client";

import { Layout } from "@/components/layout";
import { Section, Typography, Button, SectionDivider } from "@/components/ui";
import { ParallaxBackground } from "@/components/effects";
import { getBlogPostById, blogPosts } from "@/data/blog";
import { motion } from "framer-motion";
import { scrollReveal } from "@/lib/animations";
import { formatDate } from "@/lib/date";
import { useParams } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = getBlogPostById(slug);

  if (!post || post.status !== 'published') {
    notFound();
  }

  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && p.status === 'published' && p.category === post.category)
    .slice(0, 2);

  return (
    <Layout>
      {/* Hero Section */}
      <Section 
        id="post-hero" 
        className="relative overflow-hidden flex items-center justify-center pt-20 md:pt-24"
        fullHeight={false}
      >
        <ParallaxBackground speed="slow" className="absolute inset-0">
          <div className="absolute inset-0 opacity-15">
            <img 
              src="/stacked-peaks-haikei.svg" 
              alt="Background peaks"
              className="w-full h-full object-cover"
            />
          </div>
        </ParallaxBackground>

        <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4 text-sm text-foreground/60">
                <span>{post.category}</span>
                <span>•</span>
                <span>{post.readTime} min read</span>
                <span>•</span>
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              
              <Typography variant="hero" className="text-4xl md:text-5xl">
                {post.title}
              </Typography>
              
              <Typography variant="body" className="text-foreground/80 text-lg leading-relaxed max-w-3xl mx-auto">
                {post.excerpt}
              </Typography>

              <div className="flex items-center justify-center gap-4 pt-4">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm bg-accent/20 text-accent rounded-full border border-accent/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      <SectionDivider type="wave" />

      {/* Article Content */}
      <Section background="surface">
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-background/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-accent/10">
            {/* Author Info */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-accent/10">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <span className="text-accent font-bold">H</span>
              </div>
              <div>
                <div className="font-semibold text-foreground">{post.author}</div>
                <div className="text-sm text-foreground/60">
                  Published on {formatDate(post.publishedAt)}
                  {post.updatedAt && (
                    <span> • Updated {formatDate(post.updatedAt)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-foreground/80 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ 
                  __html: post.content.replace(/\n/g, '<br />').replace(/#{1,6}\s/g, match => {
                    const level = match.trim().length;
                    return `<h${level} class="text-foreground font-bold mt-8 mb-4 ${
                      level === 1 ? 'text-3xl' : 
                      level === 2 ? 'text-2xl' : 
                      level === 3 ? 'text-xl' : 'text-lg'
                    }">`;
                  }).replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
                }}
              />
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-accent/10">
              <div className="flex items-center justify-between">
                <Typography variant="body" className="text-foreground/70">
                  Found this article helpful? Share it with others!
                </Typography>
                <div className="flex gap-3">
                  <Button variant="ghost" size="sm">
                    Share on Twitter
                  </Button>
                  <Button variant="ghost" size="sm">
                    Copy Link
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Section>

      <SectionDivider type="layered-wave" flip />

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <Section>
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="text-center">
              <Typography variant="heading">Related Articles</Typography>
              <Typography variant="body" className="text-foreground/70 mt-4">
                More posts in {post.category}
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  variants={scrollReveal}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/blog/${relatedPost.id}`}>
                    <div className="bg-background/50 backdrop-blur-sm rounded-2xl p-6 border border-accent/10 hover:border-accent/30 transition-all duration-300 group cursor-pointer">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-foreground/60">
                          <span>{relatedPost.category}</span>
                          <span>{relatedPost.readTime} min read</span>
                        </div>
                        
                        <Typography variant="subheading" className="text-foreground group-hover:text-accent transition-colors">
                          {relatedPost.title}
                        </Typography>
                        
                        <Typography variant="body" className="text-foreground/70 text-sm leading-relaxed">
                          {relatedPost.excerpt}
                        </Typography>

                        <div className="flex items-center justify-between pt-2 text-sm text-foreground/60">
                          <span>By {relatedPost.author}</span>
                          <span>{formatDate(relatedPost.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/blog">
                <Button variant="secondary" size="lg">
                  View All Articles
                </Button>
              </Link>
            </div>
          </motion.div>
        </Section>
      )}

      {/* Back to Blog */}
      <Section background="surface" className="blog-back-section">
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/blog">
            <Button size="lg" className="min-w-[200px]">
              ← Back to Blog
            </Button>
          </Link>
        </motion.div>
      </Section>
    </Layout>
  );
}