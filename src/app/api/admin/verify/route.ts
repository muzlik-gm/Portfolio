import { NextRequest, NextResponse } from "next/server";
import { verifyToken, verifyAdminToken, getTokenFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    console.log('[VERIFY API] Verifying token request received');
    const token = getTokenFromRequest(request);

    if (!token) {
      console.log('[VERIFY API] No token provided in request');
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    console.log('[VERIFY API] Token found, proceeding with verification');

    // First try to verify as new AuthUser token
    console.log('[VERIFY API] Attempting to verify as AuthUser token');
    let user = verifyToken(token);

    // If that fails, try legacy admin token for backward compatibility
    if (!user) {
      console.log('[VERIFY API] AuthUser token failed, trying legacy admin token');
      const adminUser = verifyAdminToken(token);
      if (adminUser) {
        console.log('[VERIFY API] Legacy admin token verified');
        user = {
          id: adminUser.username, // Use username as ID for legacy compatibility
          email: adminUser.username,
          role: adminUser.role,
          permissions: adminUser.role === 'admin' ? ['read', 'write', 'delete', 'publish', 'manage_users'] : ['read'],
        };
      } else {
        console.log('[VERIFY API] Legacy admin token also failed');
      }
    } else {
      console.log('[VERIFY API] AuthUser token verified successfully');
    }

    if (!user) {
      console.log('[VERIFY API] All token verification methods failed');
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    console.log('[VERIFY API] Token verification successful, returning user data');
    return NextResponse.json({
      message: "Token valid",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    });

  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}