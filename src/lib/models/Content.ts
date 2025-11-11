import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';

export interface IContent extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: mongoose.Types.ObjectId;
  status: 'draft' | 'published' | 'archived';
  type: 'blog' | 'page' | 'project';
  tags: string[];
  categories: string[];
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  versions: IContentVersion[];
}

export interface IContentVersion {
  version: number;
  content: string;
  title: string;
  excerpt?: string;
  updatedBy: mongoose.Types.ObjectId;
  updatedAt: Date;
  changes?: string;
}

// Zod schemas for Content validation
export const ContentValidationSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  slug: z.string().min(1, 'Slug is required').toLowerCase().trim(),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(500).optional(),
  author: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid author ID'),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  type: z.enum(['blog', 'page', 'project']),
  tags: z.array(z.string().trim()).default([]),
  categories: z.array(z.string().trim()).default([]),
  featuredImage: z.string().url().optional().or(z.literal('')),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
});

export const ContentUpdateSchema = ContentValidationSchema.partial().omit({ slug: true });

export const ContentVersionSchema = z.object({
  version: z.number().int().positive(),
  content: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().optional(),
  updatedBy: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
  changes: z.string().optional(),
});

const ContentVersionSchemaMongoose: Schema = new Schema({
  version: { type: Number, required: true },
  content: { type: String, required: true },
  title: { type: String, required: true },
  excerpt: { type: String },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updatedAt: { type: Date, default: Date.now },
  changes: { type: String },
});

const ContentSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    maxlength: 500,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  type: {
    type: String,
    enum: ['blog', 'page', 'project'],
    required: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  categories: [{
    type: String,
    trim: true,
  }],
  featuredImage: {
    type: String,
  },
  seoTitle: {
    type: String,
    maxlength: 60,
  },
  seoDescription: {
    type: String,
    maxlength: 160,
  },
  publishedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  versions: [ContentVersionSchemaMongoose],
});

// Update the updatedAt field before saving
ContentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Create indexes for better performance
ContentSchema.index({ slug: 1 });
ContentSchema.index({ author: 1 });
ContentSchema.index({ status: 1 });
ContentSchema.index({ type: 1 });
ContentSchema.index({ tags: 1 });
ContentSchema.index({ categories: 1 });

export default mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema);