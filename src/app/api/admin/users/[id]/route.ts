import { NextRequest, NextResponse } from "next/server";
import { dbConnect, User } from "@/lib/models";
import { verifyToken, getTokenFromRequest, hasPermission } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    const requester = await verifyToken(token);

    if (!requester || !hasPermission(requester, 'manage_users')) {
      return NextResponse.json(
        { message: "Insufficient permissions" },
        { status: 403 }
      );
    }

    await dbConnect();

    const resolvedParams = await params;
    const user = await User.findById(resolvedParams.id).select('-password');

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "User retrieved successfully",
      user: user.toObject()
    });

  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    const requester = await verifyToken(token);

    if (!requester || !hasPermission(requester, 'manage_users')) {
      return NextResponse.json(
        { message: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { firstName, lastName, role, permissions, isActive } = await request.json();

    await dbConnect();

    const resolvedParams = await params;
    const user = await User.findById(resolvedParams.id);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Update fields
    if (firstName !== undefined) user.firstName = firstName?.trim();
    if (lastName !== undefined) user.lastName = lastName?.trim();
    if (role !== undefined) user.role = role;
    if (permissions !== undefined) user.permissions = permissions;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    const { password: _, ...userResponse } = user.toObject();

    return NextResponse.json({
      message: "User updated successfully",
      user: userResponse
    });

  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    const requester = await verifyToken(token);

    if (!requester || !hasPermission(requester, 'manage_users')) {
      return NextResponse.json(
        { message: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const resolvedParams = await params;

    // Prevent self-deletion
    if (requester.id === resolvedParams.id) {
      return NextResponse.json(
        { message: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findByIdAndDelete(resolvedParams.id);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "User deleted successfully"
    });

  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}