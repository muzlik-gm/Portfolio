import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'responded' | 'archived';
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
  respondedAt?: Date;
  notes?: string;
}

const MessageSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'responded', 'archived'],
    default: 'unread'
  },
  ipAddress: {
    type: String,
    required: false
  },
  userAgent: {
    type: String,
    required: false
  },
  respondedAt: {
    type: Date,
    required: false
  },
  notes: {
    type: String,
    required: false,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Index for efficient queries
MessageSchema.index({ status: 1, createdAt: -1 });
MessageSchema.index({ email: 1 });

// Prevent duplicate indexes
try {
  MessageSchema.index({ createdAt: -1 });
} catch (error) {
  // Index already exists, continue
}

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);