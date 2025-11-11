import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';

export interface ISettings extends Document {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  category: string;
  description?: string;
  isPublic: boolean;
  updatedBy: mongoose.Types.ObjectId;
  updatedAt: Date;
  createdAt: Date;
}

// Zod schemas for Settings validation
export const SettingsValidationSchema = z.object({
  key: z.string().min(1, 'Key is required').toLowerCase().trim(),
  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({}).passthrough(), // For JSON
    z.array(z.unknown()), // For arrays
  ]),
  type: z.enum(['string', 'number', 'boolean', 'json', 'array']),
  category: z.string().min(1, 'Category is required').toLowerCase().trim(),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(false),
  updatedBy: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
});

export const SettingsUpdateSchema = SettingsValidationSchema.partial().omit({ key: true });

const SettingsSchema: Schema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  value: {
    type: Schema.Types.Mixed,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['string', 'number', 'boolean', 'json', 'array'],
  },
  category: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes for better performance
SettingsSchema.index({ key: 1 });
SettingsSchema.index({ category: 1 });
SettingsSchema.index({ isPublic: 1 });

// Update the updatedAt field before saving
SettingsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);