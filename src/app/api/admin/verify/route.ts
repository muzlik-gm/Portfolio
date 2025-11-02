import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, getTokenFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    const user = verifyAdminToken(token);
    
    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Token valid",
      user: {
        username: user.username,
        role: user.role
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