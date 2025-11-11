import { NextRequest, NextResponse } from "next/server";
import { dbConnect, Content } from "@/lib/models";
import { verifyToken, getTokenFromRequest, hasPermission } from "@/lib/auth";
import { ContentValidationSchema, ContentUpdateSchema } from "@/lib/models/Content";
import { validateData, sanitizeString, searchSchema } from "@/lib/validation";
import { safeDbOperation } from "@/lib/database";
import { AuthorizationError, AuthenticationError, ConflictError, createErrorResponse } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    const query: any = { type: 'blog' };

    // Add status filter if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    // Add search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get posts with pagination
    const posts = await Content.find(query)
      .populate('author', 'firstName lastName email')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-versions'); // Exclude versions from list view

    // Get total count for pagination
    const total = await Content.countDocuments(query);

    // Transform data to match expected format
    const transformedPosts = posts.map(post => ({
      id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      status: post.status,
      type: post.type,
      tags: post.tags,
      categories: post.categories,
      featuredImage: post.featuredImage,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      versionCount: post.versions?.length || 0
    }));

    return NextResponse.json({
      message: "Blog posts retrieved successfully",
      posts: transformedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Get blog posts error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate and authorize
    const token = getTokenFromRequest(request);
    if (!token) {
      throw new AuthenticationError();
    }

    const user = await verifyToken(token);
    if (!user || !hasPermission(user, 'write')) {
      throw new AuthorizationError();
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = validateData(ContentValidationSchema, body);

    await dbConnect();

    // Check if slug already exists
    const existingPost = await safeDbOperation(
      () => Content.findOne({ slug: validatedData.slug, type: 'blog' }),
      'Failed to check existing post'
    );

    if (existingPost) {
      throw new ConflictError('A blog post with this slug already exists');
    }

    // Create new post with safe database operation
    const newPost = await safeDbOperation(async () => {
      const post = new Content({
        ...validatedData,
        author: user.id,
        type: 'blog',
        versions: [{
          version: 1,
          content: validatedData.content,
          title: validatedData.title,
          excerpt: validatedData.excerpt,
          updatedBy: user.id,
          updatedAt: new Date(),
          changes: 'Initial version'
        }]
      });

      await post.save();
      await post.populate('author', 'firstName lastName email');
      return post;
    }, 'Failed to create blog post');

    const transformedPost = {
      id: newPost._id.toString(),
      title: newPost.title,
      slug: newPost.slug,
      excerpt: newPost.excerpt,
      content: newPost.content,
      author: newPost.author,
      status: newPost.status,
      type: newPost.type,
      tags: newPost.tags,
      categories: newPost.categories,
      featuredImage: newPost.featuredImage,
      seoTitle: newPost.seoTitle,
      seoDescription: newPost.seoDescription,
      publishedAt: newPost.publishedAt,
      createdAt: newPost.createdAt,
      updatedAt: newPost.updatedAt,
      versionCount: newPost.versions?.length || 0
    };

    return NextResponse.json({
      success: true,
      data: {
        message: "Blog post created successfully",
        post: transformedPost
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Create blog post error:", error);

    const errorResponse = createErrorResponse(error as Error, '/api/admin/blog');
    return NextResponse.json(errorResponse, {
      status: (error as any).statusCode || 500
    });
  }
}