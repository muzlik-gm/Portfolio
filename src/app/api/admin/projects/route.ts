import { NextRequest, NextResponse } from "next/server";
import { dbConnect, Content } from "@/lib/models";
import { verifyToken, getTokenFromRequest, hasPermission } from "@/lib/auth";
import { getCachedData, invalidateCache } from "@/lib/cache";

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    const query: any = { type: 'project' };

    // Add status filter if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    // Add category filter if provided
    if (category && category !== 'all') {
      query.categories = { $in: [category] };
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

    // Cache key for projects list
    const cacheKey = `projects:list:${page}:${limit}:${search}:${status || 'all'}:${category || 'all'}:${sortBy}:${sortOrder}`;

    const [projects, total] = await getCachedData(
      cacheKey,
      async () => {
        // Get projects with pagination
        const projectsData = await Content.find(query)
          .populate('author', 'firstName lastName email')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .select('-versions'); // Exclude versions from list view

        // Get total count for pagination
        const totalCount = await Content.countDocuments(query);

        return [projectsData, totalCount];
      },
      { ttl: 300 } // 5 minutes TTL for project listings
    );

    // Transform data to match expected format
    const transformedProjects = projects.map(project => {
      // Parse project-specific data from content field
      let projectData: any = {};
      try {
        projectData = JSON.parse(project.content);
      } catch (e) {
        // If not JSON, treat as description
        projectData = { longDescription: project.content };
      }

      return {
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
        updatedAt: project.updatedAt
      };
    });

    return NextResponse.json({
      message: "Projects retrieved successfully",
      projects: transformedProjects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Get projects error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
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

    const user = verifyToken(token);

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
      status = 'draft',
      seoTitle,
      seoDescription
    } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { message: "Title and description are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Check if slug already exists
    const existingProject = await Content.findOne({
      slug,
      type: 'project'
    });

    if (existingProject) {
      return NextResponse.json(
        { message: "A project with this slug already exists" },
        { status: 409 }
      );
    }

    // Store project-specific data as JSON in content field
    const projectData = {
      longDescription: longDescription || '',
      liveUrl: liveUrl || '',
      githubUrl: githubUrl || '',
      featured: featured || false,
      year: year || new Date().getFullYear().toString()
    };

    const newProject = new Content({
      title,
      slug,
      content: JSON.stringify(projectData),
      excerpt: description,
      author: user.id,
      status,
      type: 'project',
      tags: technologies || [],
      categories: [category || 'other'],
      featuredImage: imageUrl,
      seoTitle,
      seoDescription,
      versions: [{
        version: 1,
        content: JSON.stringify(projectData),
        title,
        excerpt: description,
        updatedBy: user.id,
        updatedAt: new Date(),
        changes: 'Initial version'
      }]
    });

    await newProject.save();

    // Populate author data
    await newProject.populate('author', 'firstName lastName email');

    const transformedProject = {
      id: newProject._id.toString(),
      title: newProject.title,
      slug: newProject.slug,
      description: newProject.excerpt,
      longDescription: projectData.longDescription,
      technologies: newProject.tags,
      liveUrl: projectData.liveUrl,
      githubUrl: projectData.githubUrl,
      imageUrl: newProject.featuredImage,
      featured: projectData.featured,
      category: newProject.categories?.[0] || 'other',
      year: projectData.year,
      status: newProject.status,
      seoTitle: newProject.seoTitle,
      seoDescription: newProject.seoDescription,
      publishedAt: newProject.publishedAt,
      createdAt: newProject.createdAt,
      updatedAt: newProject.updatedAt
    };

    // Invalidate projects cache after creation
    await invalidateCache('projects:list:*');

    return NextResponse.json({
      message: "Project created successfully",
      project: transformedProject
    }, { status: 201 });

  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}