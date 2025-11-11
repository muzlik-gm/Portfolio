"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Typography, Button, Card } from "@/components/ui";
import { scrollReveal, staggerContainer } from "@/lib/animations";
import { base64UrlDecode } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/date";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  status: 'draft' | 'published' | 'archived';
  type: string;
  tags: string[];
  categories: string[];
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  versionCount: number;
}

export default function AdminBlogPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const router = useRouter();

  const fetchPosts = async (page = 1, searchTerm = '', statusFilter = filter) => {
    setIsLoadingPosts(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        status: statusFilter === 'all' ? '' : statusFilter,
        search: searchTerm,
        sortBy: 'updatedAt',
        sortOrder: 'desc'
      });

      const response = await fetch(`/api/admin/blog?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("adminToken")}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      setPosts(data.posts);
      setTotalPosts(data.pagination.total);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

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
      fetchPosts();
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
  }, [router, filter]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts(currentPage, search);
    }
  }, [currentPage, search, isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("adminToken")}`
        }
      });

      if (response.ok) {
        fetchPosts(currentPage, search);
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <Typography variant="body" className="text-foreground/60">
            Loading blog management...
          </Typography>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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
              
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/blog")}
                >
                  View Blog
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
                Blog Management
              </Typography>
              <Typography variant="body" className="text-foreground/60 mt-2">
                Manage your blog posts and content
              </Typography>
            </motion.div>

            {/* Stats and Actions */}
            <motion.div variants={scrollReveal} className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{totalPosts}</div>
                  <div className="text-sm text-foreground/60">Total Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{posts.filter(p => p.status === 'published').length}</div>
                  <div className="text-sm text-foreground/60">Published</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{posts.filter(p => p.status === 'draft').length}</div>
                  <div className="text-sm text-foreground/60">Drafts</div>
                </div>
              </div>

              <Button size="lg">
                + New Post
              </Button>
            </motion.div>

            {/* Search and Filter */}
            <motion.div variants={scrollReveal} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 px-4 py-2 bg-background/50 border border-accent/20 rounded-xl focus:border-accent/40 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex bg-background/50 backdrop-blur-sm rounded-2xl p-2 border border-accent/10 w-fit">
                {[
                  { id: 'all', label: 'All Posts' },
                  { id: 'published', label: 'Published' },
                  { id: 'draft', label: 'Drafts' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id as any)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm ${
                      filter === tab.id
                        ? "bg-accent text-background shadow-soft"
                        : "text-foreground/70 hover:text-foreground hover:bg-surface/50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Posts List */}
            <motion.div variants={scrollReveal} className="space-y-4">
              {isLoadingPosts ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
                  <Typography variant="body" className="text-foreground/60">
                    Loading posts...
                  </Typography>
                </div>
              ) : (
                posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    variants={scrollReveal}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 bg-background/50 border-accent/20 hover:border-accent/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <Typography variant="subheading" className="text-foreground">
                              {post.title}
                            </Typography>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}>
                              {post.status}
                            </span>
                          </div>

                          <Typography variant="body" className="text-foreground/70 text-sm leading-relaxed">
                            {post.excerpt || 'No excerpt available'}
                          </Typography>

                          <div className="flex items-center gap-6 text-sm text-foreground/60">
                            <span>Author: {post.author.firstName} {post.author.lastName}</span>
                            <span>Categories: {post.categories.join(', ') || 'None'}</span>
                            <span>Published: {post.publishedAt ? formatDate(post.publishedAt) : 'Not published'}</span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-surface/30 text-foreground/60 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 ml-6">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(post.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>

            {posts.length === 0 && !isLoadingPosts && (
              <motion.div
                variants={scrollReveal}
                className="text-center py-16"
              >
                <Typography variant="body" className="text-foreground/60">
                  No posts found for the selected filter.
                </Typography>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}