import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';

export interface IAnalytics extends Document {
  contentId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  eventType: 'page_view' | 'content_view' | 'download' | 'share' | 'like' | 'comment' | 'search' | 'contact_form';
  eventData: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  sessionId: string;
  timestamp: Date;
  url?: string;
  duration?: number; // in seconds, for page views
  country?: string;
  city?: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  browser?: string;
  os?: string;
}

// Zod schema for Analytics validation
export const AnalyticsValidationSchema = z.object({
  contentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid content ID').optional(),
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID').optional(),
  eventType: z.enum(['page_view', 'content_view', 'download', 'share', 'like', 'comment', 'search', 'contact_form']),
  eventData: z.record(z.string(), z.unknown()).default({}),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  referrer: z.string().url().optional().or(z.literal('')),
  sessionId: z.string().min(1, 'Session ID is required'),
  url: z.string().url().optional().or(z.literal('')),
  duration: z.number().positive().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  deviceType: z.enum(['desktop', 'mobile', 'tablet']).optional(),
  browser: z.string().optional(),
  os: z.string().optional(),
});

const AnalyticsSchema: Schema = new Schema({
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  eventType: {
    type: String,
    required: true,
    enum: ['page_view', 'content_view', 'download', 'share', 'like', 'comment', 'search', 'contact_form'],
  },
  eventData: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {},
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  referrer: {
    type: String,
  },
  sessionId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  url: {
    type: String,
  },
  duration: {
    type: Number,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  deviceType: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet'],
  },
  browser: {
    type: String,
  },
  os: {
    type: String,
  },
});

// Create indexes for better query performance
AnalyticsSchema.index({ eventType: 1, timestamp: -1 });
AnalyticsSchema.index({ contentId: 1, timestamp: -1 });
AnalyticsSchema.index({ userId: 1, timestamp: -1 });
AnalyticsSchema.index({ sessionId: 1 });
AnalyticsSchema.index({ timestamp: -1 });
AnalyticsSchema.index({ url: 1 });

export default mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);