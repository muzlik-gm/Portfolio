import { NextRequest, NextResponse } from "next/server";
import { dbConnect, User } from "@/lib/models";
import { verifyPassword, generateToken } from "@/lib/auth";
import { emailSchema } from "@/lib/validation";
import { validateData } from "@/lib/validation";
import { safeDbOperation } from "@/lib/database";
import { AuthenticationError, createErrorResponse } from "@/lib/errors";
import { z } from "zod";

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
    try {
      console.log('[LOGIN API] Login attempt received');
      // Parse and validate request body
      const body = await request.json();
      console.log('[LOGIN API] Request body parsed');
      const validatedData: LoginRequest = validateData(
        z.object({
          email: emailSchema,
          password: z.string().min(1, 'Password is required'), // Basic validation, full check during verify
        }),
        body
      );
      console.log('[LOGIN API] Data validated for email:', validatedData.email);

      // Connect to database
      await dbConnect();
      console.log('[LOGIN API] Database connected');

      // Find user by email with safe database operation
      const user = await safeDbOperation(
        () => User.findOne({ email: validatedData.email }),
        'Failed to find user'
      );
      console.log('[LOGIN API] User lookup result:', user ? 'found' : 'not found');

      if (!user || !user.isActive) {
        console.log('[LOGIN API] User not found or inactive');
        throw new AuthenticationError('Invalid email or password');
      }

      console.log('[LOGIN API] User found, verifying password');
      // Verify password
      const isPasswordValid = await verifyPassword(validatedData.password, user.password);
      console.log('[LOGIN API] Password verification result:', isPasswordValid);

      if (!isPasswordValid) {
        console.log('[LOGIN API] Password verification failed');
        throw new AuthenticationError('Invalid email or password');
      }

      console.log('[LOGIN API] Password verified, updating last login');

     // Update last login with safe database operation
     await safeDbOperation(async () => {
       user.lastLogin = new Date();
       return await user.save();
     }, 'Failed to update last login');
     console.log('[LOGIN API] Last login updated');

     // Convert Mongoose document to plain object to avoid DataCloneError
     console.log('[LOGIN API] Converting user document to plain object');
     const userObject = user.toObject ? user.toObject() : user;
     console.log('[LOGIN API] User object type after conversion:', typeof userObject, 'has _id:', !!userObject._id);

     // Generate JWT token
     console.log('[LOGIN API] Generating JWT token');
     const token = await generateToken({
       id: userObject._id.toString(),
       email: userObject.email,
       role: String(userObject.role), // Ensure role is a plain string
       permissions: Array.isArray(userObject.permissions) ? userObject.permissions : [], // Ensure permissions is a plain array
       firstName: userObject.firstName,
       lastName: userObject.lastName,
     });
     console.log('[LOGIN API] Token generated successfully');

     console.log('[LOGIN API] Login successful, setting cookie and returning response');
     const response = NextResponse.json({
       success: true,
       data: {
         message: "Login successful",
         user: {
           id: userObject._id,
           email: userObject.email,
           role: userObject.role,
           permissions: userObject.permissions,
           firstName: userObject.firstName,
           lastName: userObject.lastName,
         }
       }
     });

     // Set the token as an httpOnly cookie
     response.cookies.set('adminToken', token, {
       httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
       sameSite: 'strict',
       maxAge: 60 * 60 * 24, // 24 hours
       path: '/'
     });

     return response;

   } catch (error) {
     console.error("Login error:", error);

     // Handle different error types with consistent response format
     const errorResponse = createErrorResponse(error as Error, '/api/admin/login');

     return NextResponse.json(errorResponse, {
       status: (error as any).statusCode || 500
     });
   }
 }