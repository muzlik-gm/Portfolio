import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // In a stateless JWT system, logout is handled client-side by removing the token
    // For enhanced security, we could implement token blacklisting in the future

    return NextResponse.json({
      message: "Logout successful"
    });

  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}