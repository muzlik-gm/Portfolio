"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Typography, Button, Card } from "@/components/ui";
import { scrollReveal, staggerContainer } from "@/lib/animations";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/date";
import { Eye, Archive, Trash2, CheckCircle, Mail, MessageSquare } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'responded' | 'archived';
  createdAt: string;
  updatedAt: string;
  respondedAt?: string;
  notes?: string;
}

export default function AdminMessagesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'responded' | 'archived'>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'name' | 'email'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const router = useRouter();

  const fetchMessages = async (page = 1) => {
    setIsLoadingMessages(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        status: filter === 'all' ? '' : filter,
        search: search,
        sortBy: sortBy,
        sortOrder: sortOrder,
      });

      const response = await fetch(`/api/admin/messages?${params}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.messages);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    const verifyAuthentication = async () => {
      try {
        const verifyResponse = await fetch('/api/admin/verify', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!verifyResponse.ok) {
          router.push("/admin/login");
          return;
        }

        setIsAuthenticated(true);
        fetchMessages();
      } catch (error) {
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuthentication();
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages(1);
    }
  }, [filter, search, sortBy, sortOrder, isAuthenticated]);

  const handleLogout = () => {
    fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    }).finally(() => {
      router.push("/admin/login");
    });
  };

  const updateMessageStatus = async (messageId: string, status: Message['status']) => {
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: messageId, status }),
      });

      if (response.ok) {
        fetchMessages(pagination.page);
      }
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin/messages?id=${messageId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        fetchMessages(pagination.page);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const getStatusColor = (status: Message['status']) => {
    switch (status) {
      case 'unread':
        return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'read':
        return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
      case 'responded':
        return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'archived':
        return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'unread':
        return <Mail className="w-4 h-4" />;
      case 'read':
        return <Eye className="w-4 h-4" />;
      case 'responded':
        return <CheckCircle className="w-4 h-4" />;
      case 'archived':
        return <Archive className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <Typography variant="body" className="text-foreground/60">
            Loading messages...
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
                  onClick={() => router.push("/")}
                >
                  View Portfolio
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
                Messages
              </Typography>
              <Typography variant="body" className="text-foreground/60 mt-2">
                Manage contact form submissions
              </Typography>
            </motion.div>

            {/* Stats */}
            <motion.div variants={scrollReveal} className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{pagination.total}</div>
                <div className="text-sm text-foreground/60">Total Messages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {messages.filter(m => m.status === 'unread').length}
                </div>
                <div className="text-sm text-foreground/60">Unread</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {messages.filter(m => m.status === 'responded').length}
                </div>
                <div className="text-sm text-foreground/60">Responded</div>
              </div>
            </motion.div>

            {/* Filters and Search */}
            <motion.div variants={scrollReveal} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 px-4 py-2 bg-background/50 border border-accent/20 rounded-xl focus:border-accent/40 focus:outline-none transition-colors"
                />

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 bg-background/50 border border-accent/20 rounded-xl focus:border-accent/40 focus:outline-none transition-colors"
                >
                  <option value="createdAt">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                  <option value="email">Sort by Email</option>
                </select>

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className="px-4 py-2 bg-background/50 border border-accent/20 rounded-xl focus:border-accent/40 focus:outline-none transition-colors"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex bg-background/50 backdrop-blur-sm rounded-2xl p-2 border border-accent/10 w-fit">
                {[
                  { id: 'all', label: 'All Messages' },
                  { id: 'unread', label: 'Unread' },
                  { id: 'read', label: 'Read' },
                  { id: 'responded', label: 'Responded' },
                  { id: 'archived', label: 'Archived' }
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

            {/* Messages List */}
            <motion.div variants={scrollReveal} className="space-y-4">
              {isLoadingMessages ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
                  <Typography variant="body" className="text-foreground/60">
                    Loading messages...
                  </Typography>
                </div>
              ) : messages.length === 0 ? (
                <Card className="p-12 bg-background/50 border-accent/20 text-center">
                  <div className="space-y-4">
                    <MessageSquare className="w-12 h-12 text-foreground/30 mx-auto" />
                    <Typography variant="subheading" className="text-foreground">
                      No messages found
                    </Typography>
                    <Typography variant="body" className="text-foreground/60 max-w-md mx-auto">
                      No messages match your current filters. Try adjusting your search or filter criteria.
                    </Typography>
                  </div>
                </Card>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    variants={scrollReveal}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 bg-background/50 border-accent/20 hover:border-accent/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <Typography variant="subheading" className="text-foreground">
                              {message.subject}
                            </Typography>
                            <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(message.status)}`}>
                              {getStatusIcon(message.status)}
                              {message.status}
                            </span>
                          </div>

                          <Typography variant="body" className="text-foreground/70 text-sm">
                            From: {message.name} ({message.email})
                          </Typography>

                          <Typography variant="body" className="text-foreground/80 text-sm leading-relaxed">
                            {message.message.length > 150
                              ? `${message.message.substring(0, 150)}...`
                              : message.message
                            }
                          </Typography>

                          <div className="flex items-center gap-4 text-xs text-foreground/60">
                            <span>Received: {formatDate(message.createdAt)}</span>
                            {message.respondedAt && (
                              <span>Responded: {formatDate(message.respondedAt)}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-6">
                          {message.status === 'unread' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateMessageStatus(message.id, 'read')}
                            >
                              Mark Read
                            </Button>
                          )}
                          {message.status !== 'responded' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateMessageStatus(message.id, 'responded')}
                            >
                              Mark Responded
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateMessageStatus(message.id, 'archived')}
                          >
                            Archive
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => deleteMessage(message.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <motion.div variants={scrollReveal} className="flex justify-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fetchMessages(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>

                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === pagination.page ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => fetchMessages(page)}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fetchMessages(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}