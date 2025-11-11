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
    const project = await Content.findOne({
      _id: resolvedParams.id,
      type: 'project'
    })
    .populate('author', 'firstName lastName email')
    .populate('versions.updatedBy', 'firstName lastName email');

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Parse project-specific data from content field
    let projectData: any = {};
    try {
      projectData = JSON.parse(project.content);
    } catch (e) {
      // If not JSON, treat as description
      projectData = { longDescription: project.content };
    }

    const transformedProject = {
      id: project._id.toString(),
      title: project.title,
      slug: project.slug,
      description: project.excerpt,
      longDescription: projectData.longDescription || '',
      technologies: project.tags || [],
      liveUrl: projectData.liveUrl || '',
      githubUrl: projectData.githubUrl || '',
      imageUrl: project.featuredImage,
      featured: projectData.featured || false,
      category: project.categories?.[0] || 'other',
      year: projectData.year || new Date(project.createdAt).getFullYear().toString(),
      status: project.status,
      seoTitle: project.seoTitle,
      seoDescription: project.seoDescription,
      publishedAt: project.publishedAt,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      versions: project.versions?.map((version: any) => ({
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
      message: "Project retrieved successfully",
      project: transformedProject
    });

  } catch (error) {
    console.error("Get project error:", error);
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

    const user = await verifyToken(token);

    if (!user || !hasPermission(user, 'write')) {
      return NextResponse.json(
        { message: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const {
      title,
      description,
      longDescription,
      technologies,
      liveUrl,
      githubUrl,
      imageUrl,
      featured,
      category,
      year,
      status,
      seoTitle,
      seoDescription,
      changes
    } = await request.json();

    await dbConnect();

    const resolvedParams = await params;
    const existingProject = await Content.findOne({
      _id: resolvedParams.id,
      type: 'project'
    });

    if (!existingProject) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Generate new slug if title changed
    let slug = existingProject.slug;
    if (title && title !== existingProject.title) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      // Check slug uniqueness
      const slugExists = await Content.findOne({
        slug,
        type: 'project',
        _id: { $ne: resolvedParams.id }
      });

      if (slugExists) {
        return NextResponse.json(
          { message: "A project with this slug already exists" },
          { status: 409 }
        );
      }
    }

    // Parse existing project data
    let projectData: any = {};
    try {
      projectData = JSON.parse(existingProject.content);
    } catch (e) {
      projectData = { longDescription: existingProject.content };
    }

    // Update project data
    const updatedProjectData = {
      longDescription: longDescription !== undefined ? longDescription : projectData.longDescription,
      liveUrl: liveUrl !== undefined ? liveUrl : projectData.liveUrl,
      githubUrl: githubUrl !== undefined ? githubUrl : projectData.githubUrl,
      featured: featured !== undefined ? featured : projectData.featured,
      year: year !== undefined ? year : projectData.year
    };

    // Create new version if content has changed
    const hasContentChanged = JSON.stringify(updatedProjectData) !== existingProject.content ||
                             title !== existingProject.title ||
                             description !== existingProject.excerpt;

    let newVersion = existingProject.versions?.length || 0;

    if (hasContentChanged) {
      newVersion += 1;
      existingProject.versions.push({
        version: newVersion,
        content: JSON.stringify(updatedProjectData),
        title: title || existingProject.title,
        excerpt: description || existingProject.excerpt,
        updatedBy: user.id,
        updatedAt: new Date(),
        changes: changes || 'Updated content'
      });
    }

    // Update the project
    const updateData: any = {
      updatedAt: new Date()
    };

    if (title !== undefined) updateData.title = title;
    if (slug !== existingProject.slug) updateData.slug = slug;
    if (JSON.stringify(updatedProjectData) !== existingProject.content) updateData.content = JSON.stringify(updatedProjectData);
    if (description !== undefined) updateData.excerpt = description;
    if (technologies !== undefined) updateData.tags = technologies;
    if (category !== undefined) updateData.categories = [category];
    if (imageUrl !== undefined) updateData.featuredImage = imageUrl;
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription;
    if (status !== undefined) updateData.status = status;

    // Set publishedAt when status changes to published
    if (status === 'published' && existingProject.status !== 'published') {
      updateData.publishedAt = new Date();
    }

    const updatedProject = await Content.findByIdAndUpdate(
      resolvedParams.id,
      updateData,
      { new: true }
    )
    .populate('author', 'firstName lastName email')
    .populate('versions.updatedBy', 'firstName lastName email');

    const transformedProject = {
      id: updatedProject._id.toString(),
      title: updatedProject.title,
      slug: updatedProject.slug,
      description: updatedProject.excerpt,
      longDescription: updatedProjectData.longDescription,
      technologies: updatedProject.tags,
      liveUrl: updatedProjectData.liveUrl,
      githubUrl: updatedProjectData.githubUrl,
      imageUrl: updatedProject.featuredImage,
      featured: updatedProjectData.featured,
      category: updatedProject.categories?.[0] || 'other',
      year: updatedProjectData.year,
      status: updatedProject.status,
      seoTitle: updatedProject.seoTitle,
      seoDescription: updatedProject.seoDescription,
      publishedAt: updatedProject.publishedAt,
      createdAt: updatedProject.createdAt,
      updatedAt: updatedProject.updatedAt,
      versions: updatedProject.versions?.map((version: any) => ({
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
      message: "Project updated successfully",
      project: transformedProject
    });

  } catch (error) {
    console.error("Update project error:", error);
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

    const user = await verifyToken(token);

    if (!user || !hasPermission(user, 'delete')) {
      return NextResponse.json(
        { message: "Insufficient permissions" },
        { status: 403 }
      );
    }

    await dbConnect();

    const resolvedParams = await params;
    const project = await Content.findOneAndDelete({
      _id: resolvedParams.id,
      type: 'project'
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Project deleted successfully"
    });

  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}