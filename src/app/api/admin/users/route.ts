import { NextRequest, NextResponse } from "next/server";
import { dbConnect, User } from "@/lib/models";
import { verifyToken, getTokenFromRequest, hasPermission } from "@/lib/auth";
import { safeDbOperation } from "@/lib/database";
import { AuthorizationError, AuthenticationError, createErrorResponse } from "@/lib/errors";
import { paginationSchema, validateData } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    // Authenticate and authorize
    const token = getTokenFromRequest(request);
    if (!token) {
      throw new AuthenticationError();
    }

    const user = await verifyToken(token);
    if (!user || !hasPermission(user, 'manage_users')) {
      throw new AuthorizationError();
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const paginationData = validateData(paginationSchema, {
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      sortBy: searchParams.get('sortBy'),
      sortOrder: searchParams.get('sortOrder'),
    });

    await dbConnect();

    // Build query with pagination
    const sortOptions: any = {};
    if (paginationData.sortBy) {
      sortOptions[paginationData.sortBy] = paginationData.sortOrder === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1; // default sort
    }

    const query = User.find({})
      .select('-password')
      .sort(sortOptions)
      .skip((paginationData.page - 1) * paginationData.limit)
      .limit(paginationData.limit);

    // Execute query safely
    const [users, total] = await Promise.all([
      safeDbOperation(() => query.exec(), 'Failed to retrieve users'),
      safeDbOperation(() => User.countDocuments({}), 'Failed to count users'),
    ]);

    const totalPages = Math.ceil(total / paginationData.limit);

    // Convert Mongoose documents to plain objects to avoid DataCloneError
    console.log('[USERS API] Converting user documents to plain objects');
    const plainUsers = users.map(u => u.toObject ? u.toObject() : u);
    console.log('[USERS API] Successfully converted', plainUsers.length, 'users to plain objects');

    return NextResponse.json({
      success: true,
      data: {
        users: plainUsers,
        pagination: {
          page: paginationData.page,
          limit: paginationData.limit,
          total,
          totalPages,
        }
      }
    });

  } catch (error) {
    console.error("Get users error:", error);

    const errorResponse = createErrorResponse(error as Error, '/api/admin/users');
    return NextResponse.json(errorResponse, {
      status: (error as any).statusCode || 500
    });
  }
}

export async function POST(request: NextRequest) {
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

    const { email, password, firstName, lastName, role, permissions } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Import hashPassword here to avoid circular imports
    const { hashPassword } = await import("@/lib/auth");
    const hashedPassword = await hashPassword(password);

    // Set default permissions based on role
    const userPermissions = permissions || (
      role === 'admin' ? ['read', 'write', 'delete', 'publish', 'manage_users'] :
      role === 'editor' ? ['read', 'write', 'publish'] :
      ['read']
    );

    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      role: role || 'viewer',
      permissions: userPermissions,
    });

    await newUser.save();

    const { password: _, ...userResponse } = newUser.toObject();

    return NextResponse.json({
      message: "User created successfully",
      user: userResponse
    }, { status: 201 });

  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}