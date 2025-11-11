import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'viewer';
  permissions: string[];
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

// Zod schema for User validation
export const UserValidationSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['admin', 'editor', 'viewer']).default('viewer'),
  permissions: z.array(z.enum(['read', 'write', 'delete', 'publish', 'manage_users'])).default([]),
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  isActive: z.boolean().default(true),
});

export const UserUpdateSchema = UserValidationSchema.partial().omit({ email: true });

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'editor', 'viewer'],
    default: 'viewer',
  },
  permissions: [{
    type: String,
    enum: ['read', 'write', 'delete', 'publish', 'manage_users'],
  }],
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

// Update the updatedAt field before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);