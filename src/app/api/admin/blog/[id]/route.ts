import { NextRequest, NextResponse } from "next/server";
import { dbConnect, Content } from "@/lib/models";
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

    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    await dbConnect();

    const resolvedParams = await params;
    const post = await Content.findOne({
      _id: resolvedParams.id,
      type: 'blog'
    })
    .populate('author', 'firstName lastName email')
    .populate('versions.updatedBy', 'firstName lastName email');

    if (!post) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    const transformedPost = {
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
      versions: post.versions?.map((version: any) => ({
        version: version.version,
        content: version.content,
        title: version.title,
        excerpt: version.excerpt,
        updatedBy: version.updatedBy,
        updatedAt: version.updatedAt,
        changes: version.changes
      })) || []
    };

    return NextResponse.json({
      message: "Blog post retrieved successfully",
      post: transformedPost
    });

  } catch (error) {
    console.error("Get blog post error:", error);
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

    const user = verifyToken(token);

    if (!user || !hasPermission(user, 'write')) {
      return NextResponse.json(
        { message: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const {
      title,
      slug,
      content,
      excerpt,
      tags,
      categories,
      featuredImage,
      seoTitle,
      seoDescription,
      status,
      changes
    } = await request.json();

    await dbConnect();

    const existingPost = await Content.findOne({
      _id: resolvedParams.id,
      type: 'blog'
    });

    if (!existingPost) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    // Check slug uniqueness if slug is being changed
    if (slug && slug !== existingPost.slug) {
      const slugExists = await Content.findOne({
        slug,
        type: 'blog',
        _id: { $ne: resolvedParams.id }
      });

      if (slugExists) {
        return NextResponse.json(
          { message: "A blog post with this slug already exists" },
          { status: 409 }
        );
      }
    }

    // Create new version if content has changed
    const hasContentChanged = content !== existingPost.content ||
                             title !== existingPost.title ||
                             excerpt !== existingPost.excerpt;

    let newVersion = existingPost.versions?.length || 0;

    if (hasContentChanged) {
      newVersion += 1;
      existingPost.versions.push({
        version: newVersion,
        content: content || existingPost.content,
        title: title || existingPost.title,
        excerpt: excerpt || existingPost.excerpt,
        updatedBy: user.id,
        updatedAt: new Date(),
        changes: changes || 'Updated content'
      });
    }

    // Update the post
    const updateData: any = {
      updatedAt: new Date()
    };

    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (content !== undefined) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (tags !== undefined) updateData.tags = tags;
    if (categories !== undefined) updateData.categories = categories;
    if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription;
    if (status !== undefined) updateData.status = status;

    // Set publishedAt when status changes to published
    if (status === 'published' && existingPost.status !== 'published') {
      updateData.publishedAt = new Date();
    }

    const updatedPost = await Content.findByIdAndUpdate(
      resolvedParams.id,
      updateData,
      { new: true }
    )
    .populate('author', 'firstName lastName email')
    .populate('versions.updatedBy', 'firstName lastName email');

    const transformedPost = {
      id: updatedPost._id.toString(),
      title: updatedPost.title,
      slug: updatedPost.slug,
      excerpt: updatedPost.excerpt,
      content: updatedPost.content,
      author: updatedPost.author,
      status: updatedPost.status,
      type: updatedPost.type,
      tags: updatedPost.tags,
      categories: updatedPost.categories,
      featuredImage: updatedPost.featuredImage,
      seoTitle: updatedPost.seoTitle,
      seoDescription: updatedPost.seoDescription,
      publishedAt: updatedPost.publishedAt,
      createdAt: updatedPost.createdAt,
      updatedAt: updatedPost.updatedAt,
      versions: updatedPost.versions?.map((version: any) => ({
        version: version.version,
        content: version.content,
        title: version.title,
        excerpt: version.excerpt,
        updatedBy: version.updatedBy,
        updatedAt: version.updatedAt,
        changes: version.changes
      })) || []
    };

    return NextResponse.json({
      message: "Blog post updated successfully",
      post: transformedPost
    });

  } catch (error) {
    console.error("Update blog post error:", error);
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

    const user = verifyToken(token);

    if (!user || !hasPermission(user, 'delete')) {
      return NextResponse.json(
        { message: "Insufficient permissions" },
        { status: 403 }
      );
    }

    await dbConnect();

    const resolvedParams = await params;
    const post = await Content.findOneAndDelete({
      _id: resolvedParams.id,
      type: 'blog'
    });

    if (!post) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Blog post deleted successfully"
    });

  } catch (error) {
    console.error("Delete blog post error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}