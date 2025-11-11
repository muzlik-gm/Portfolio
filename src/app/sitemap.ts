import { MetadataRoute } from 'next'
import { blogPosts } from '@/data/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://muzlik.vercel.app'
  const currentDate = new Date().toISOString()
  
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  const blogPages: MetadataRoute.Sitemap = blogPosts
    .filter(post => post.status === 'published')
    .map(post => ({
      url: `${baseUrl}/blog/${post.id}`,
      lastModified: post.publishedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

  return [...staticPages, ...blogPages]
}
