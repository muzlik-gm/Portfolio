import { NextRequest, NextResponse } from "next/server";
import { dbConnect, User } from "@/lib/models";
import { hashPassword } from "@/lib/auth";
import { UserValidationSchema } from "@/lib/models/User";
import { validateData, sanitizeString } from "@/lib/validation";
import { safeDbOperation } from "@/lib/database";
import { ConflictError, createErrorResponse } from "@/lib/errors";

interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'editor' | 'viewer';
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData: RegisterRequest = validateData(UserValidationSchema, body);

    // Connect to database
    await dbConnect();

    // Check if user already exists (case-insensitive)
    const existingUser = await safeDbOperation(
      () => User.findOne({ email: validatedData.email.toLowerCase() }),
      'Failed to check existing user'
    );

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Set default role and permissions
    const userRole = validatedData.role || 'viewer';
    const defaultPermissions = userRole === 'admin'
      ? ['read', 'write', 'delete', 'publish', 'manage_users']
      : userRole === 'editor'
      ? ['read', 'write', 'publish']
      : ['read'];

    // Create new user with database operation safety
    const newUser = await safeDbOperation(async () => {
      const user = new User({
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName ? sanitizeString(validatedData.firstName) : undefined,
        lastName: validatedData.lastName ? sanitizeString(validatedData.lastName) : undefined,
        role: userRole,
        permissions: defaultPermissions,
      });

      return await user.save();
    }, 'Failed to create user');

    // Return user data without password
    const { password: _, ...userResponse } = newUser.toObject();

    return NextResponse.json({
      success: true,
      data: {
        message: "User registered successfully",
        user: userResponse
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);

    // Handle different error types with consistent response format
    const errorResponse = createErrorResponse(error as Error, '/api/auth/register');

    return NextResponse.json(errorResponse, {
      status: (error as any).statusCode || 500
    });
  }
}