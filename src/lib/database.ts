import mongoose from 'mongoose';
import { DatabaseError } from './errors';

// Transaction wrapper for database operations
export async function withTransaction<T>(
  operations: (session: mongoose.ClientSession) => Promise<T>
): Promise<T> {
  const session = await mongoose.startSession();

  try {
    let result: T;
    await session.withTransaction(async () => {
      result = await operations(session);
    });
    return result!;
  } catch (error) {
    throw new DatabaseError(
      'Transaction failed',
      error instanceof Error ? error : new Error(String(error))
    );
  } finally {
    await session.endSession();
  }
}

// Safe database operation wrapper
export async function safeDbOperation<T>(
  operation: () => Promise<T>,
  errorMessage: string = 'Database operation failed'
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      // Handle Mongoose validation errors
      const errors: Record<string, string[]> = {};
      for (const field in error.errors) {
        errors[field] = [error.errors[field].message];
      }
      throw new DatabaseError('Validation failed', error);
    } else if (error instanceof mongoose.Error.CastError) {
      throw new DatabaseError('Invalid data format', error);
    } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
      throw new DatabaseError('Document not found', error);
    } else if ((error as any).code === 11000) { // MongoDB duplicate key error
      throw new DatabaseError('Duplicate entry', error instanceof Error ? error : new Error(String(error)));
    }

    throw new DatabaseError(
      errorMessage,
      error instanceof Error ? error : new Error(String(error))
    );
  }
}

// Connection health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    if (mongoose.connection.readyState !== 1) return false;
    await mongoose.connection.db?.admin().ping();
    return true;
  } catch {
    return false;
  }
}

// Graceful connection close
export async function closeDatabaseConnection(): Promise<void> {
  try {
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
}

// Retry wrapper for transient database errors
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on validation or logical errors
      if (
        error instanceof mongoose.Error.ValidationError ||
        error instanceof mongoose.Error.CastError ||
        error instanceof mongoose.Error.DocumentNotFoundError
      ) {
        throw error;
      }

      if (attempt === maxRetries) {
        throw new DatabaseError(
          `Operation failed after ${maxRetries + 1} attempts`,
          lastError
        );
      }

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
    }
  }

  throw lastError!;
}