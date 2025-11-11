import { NextRequest, NextResponse } from 'next/server';
import { dbConnect, User, Content, Analytics, Settings, Message } from '@/lib/models';
import { verifyAdminToken, getTokenFromRequest, getAuthCookie } from '@/lib/auth';
import { getCachedData, cache } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    console.log('[DASHBOARD API] Dashboard data request received');
    console.log('[DASHBOARD API] Request headers:', Object.fromEntries(request.headers.entries()));

    // Verify admin authentication
    let token = getTokenFromRequest(request);

    // If no token in header, try to get from cookie
    if (!token) {
      token = getAuthCookie(request);
    }

    if (!token) {
      console.log('[DASHBOARD API] No token provided in request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminUser = await verifyAdminToken(token);
    if (!adminUser) {
      console.log('[DASHBOARD API] Admin token verification failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('[DASHBOARD API] Admin token verified for user:', adminUser);
    console.log('[DASHBOARD API] Admin user object:', JSON.stringify(adminUser, null, 2));

    console.log('[DASHBOARD API] Connecting to database');
    await dbConnect();
    console.log('[DASHBOARD API] Database connected successfully');

    console.log('[DASHBOARD API] Starting dashboard data aggregation with caching');

    // Check Redis connection status for graceful fallback
    const cacheStats = await cache.getStats();
    const redisUnavailable = !cacheStats.connected;
    console.log(`[DASHBOARD API] Redis availability: ${!redisUnavailable}`);

    // Cache key for dashboard data
    const cacheKey = `dashboard:admin`;

    // Get total users count with caching (10 minutes TTL) - critical data, skip cache if Redis fails
    const totalUsers = await getCachedData(
      `${cacheKey}:totalUsers`,
      () => User.countDocuments({ isActive: true }),
      { ttl: 600, skipCache: redisUnavailable }
    );

    // Get message statistics with caching (5 minutes TTL)
    const messageStats = await getCachedData(
      `${cacheKey}:messageStats`,
      () => Message.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            unread: {
              $sum: { $cond: [{ $eq: ['$status', 'unread'] }, 1, 0] }
            },
            read: {
              $sum: { $cond: [{ $eq: ['$status', 'read'] }, 1, 0] }
            },
            responded: {
              $sum: { $cond: [{ $eq: ['$status', 'responded'] }, 1, 0] }
            },
            archived: {
              $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] }
            }
          }
        }
      ]),
      { ttl: 300, skipCache: redisUnavailable }
    );

    // Get content statistics by type with caching (5 minutes TTL) - critical data, skip cache if Redis fails
    const totalContent = await getCachedData(
      `${cacheKey}:totalContent`,
      () => Content.countDocuments(),
      { ttl: 300, skipCache: redisUnavailable }
    );

    const blogStats = await getCachedData(
      `${cacheKey}:blogStats`,
      () => Content.aggregate([
        { $match: { type: 'blog' } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            published: {
              $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
            },
            draft: {
              $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
            }
          }
        }
      ]),
      { ttl: 300, skipCache: redisUnavailable }
    );

    const projectStats = await getCachedData(
      `${cacheKey}:projectStats`,
      () => Content.aggregate([
        { $match: { type: 'project' } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            live: {
              $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
            },
            development: {
              $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
            }
          }
        }
      ]),
      { ttl: 300, skipCache: redisUnavailable }
    );

    // Get recent activities from Analytics and Content with caching (2 minutes TTL) - critical data, skip cache if Redis fails
    const recentActivities = await getCachedData(
      `${cacheKey}:recentActivities`,
      () => Promise.all([
        // Recent content updates
        Content.find()
          .sort({ updatedAt: -1 })
          .limit(5)
          .populate('author', 'firstName lastName')
          .select('title status type updatedAt publishedAt')
          .lean(),
        // Recent analytics events (content views, etc.)
        Analytics.find({
          eventType: { $in: ['content_view', 'page_view'] },
          timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
        })
          .sort({ timestamp: -1 })
          .limit(3)
          .select('eventType eventData url timestamp')
          .lean()
      ]),
      { ttl: 120, skipCache: redisUnavailable }
    );

    // Get system status from settings with caching (15 minutes TTL) - less critical, can use cache normally
    const systemSettings = await getCachedData(
      `${cacheKey}:systemSettings`,
      () => Settings.find({
        category: 'system',
        isPublic: false
      }).select('key value description').lean(),
      { ttl: 900, skipCache: redisUnavailable }
    );

    // Format recent activities
    const formattedActivities: Array<{
      icon: string;
      message: string;
      timeAgo: string;
      type: string;
    }> = [];

    // Add content activities
    recentActivities[0].forEach(content => {
      let icon = '📝';
      let message = '';
      let timeAgo = '';

      if (content.status === 'published') {
        if (content.type === 'blog') {
          message = `Blog post "${content.title}" published`;
          icon = '✅';
        } else if (content.type === 'project') {
          message = `Project "${content.title}" went live`;
          icon = '🚀';
        }
      } else if (content.status === 'draft') {
        if (content.type === 'blog') {
          message = `Blog post draft "${content.title}" created/updated`;
          icon = '📝';
        } else if (content.type === 'project') {
          message = `Project "${content.title}" status updated to development`;
          icon = '🔄';
        }
      }

      const timeDiff = Date.now() - new Date(content.updatedAt).getTime();
      if (timeDiff < 60 * 60 * 1000) {
        timeAgo = `${Math.floor(timeDiff / (60 * 1000))} minutes ago`;
      } else if (timeDiff < 24 * 60 * 60 * 1000) {
        timeAgo = `${Math.floor(timeDiff / (60 * 60 * 1000))} hours ago`;
      } else {
        timeAgo = `${Math.floor(timeDiff / (24 * 60 * 60 * 1000))} days ago`;
      }

      formattedActivities.push({
        icon,
        message,
        timeAgo,
        type: 'content'
      });
    });

    // Add analytics activities (simplified)
    recentActivities[1].forEach(analytic => {
      let message = '';
      let icon = '👁️';

      if (analytic.eventType === 'content_view') {
        message = `Content viewed: ${analytic.url || 'Unknown page'}`;
      } else if (analytic.eventType === 'page_view') {
        message = `Page visited: ${analytic.url || 'Unknown page'}`;
      }

      const timeDiff = Date.now() - new Date(analytic.timestamp).getTime();
      let timeAgo = '';
      if (timeDiff < 60 * 60 * 1000) {
        timeAgo = `${Math.floor(timeDiff / (60 * 1000))} minutes ago`;
      } else if (timeDiff < 24 * 60 * 60 * 1000) {
        timeAgo = `${Math.floor(timeDiff / (60 * 60 * 1000))} hours ago`;
      } else {
        timeAgo = `${Math.floor(timeDiff / (24 * 60 * 60 * 1000))} days ago`;
      }

      formattedActivities.push({
        icon,
        message,
        timeAgo,
        type: 'analytics'
      });
    });

    // Sort activities by time (most recent first) and limit to 5
    formattedActivities.sort((a, b) => {
      const aTime = a.timeAgo.includes('minutes') ? parseInt(a.timeAgo) * 60 * 1000 :
                   a.timeAgo.includes('hours') ? parseInt(a.timeAgo) * 60 * 60 * 1000 :
                   parseInt(a.timeAgo) * 24 * 60 * 60 * 1000;
      const bTime = b.timeAgo.includes('minutes') ? parseInt(b.timeAgo) * 60 * 1000 :
                   b.timeAgo.includes('hours') ? parseInt(b.timeAgo) * 60 * 60 * 1000 :
                   parseInt(b.timeAgo) * 24 * 60 * 60 * 1000;
      return aTime - bTime;
    });

    const recentActivitiesLimited = formattedActivities.slice(0, 5);

    // Prepare response data
    const responseData = {
      totalUsers,
      messageStats: {
        totalMessages: messageStats[0]?.total || 0,
        unreadMessages: messageStats[0]?.unread || 0,
        readMessages: messageStats[0]?.read || 0,
        respondedMessages: messageStats[0]?.responded || 0,
        archivedMessages: messageStats[0]?.archived || 0
      },
      contentStats: {
        totalPosts: blogStats[0]?.total || 0,
        publishedPosts: blogStats[0]?.published || 0,
        draftPosts: blogStats[0]?.draft || 0,
        totalProjects: projectStats[0]?.total || 0,
        liveProjects: projectStats[0]?.live || 0,
        devProjects: projectStats[0]?.development || 0
      },
      recentActivities: recentActivitiesLimited,
      systemStatus: systemSettings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, any>)
    };

    console.log('[DASHBOARD API] Prepared response data successfully');
    console.log(`[DASHBOARD API] Dashboard API completed ${redisUnavailable ? 'without' : 'with'} Redis caching`);
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: POST for future dashboard configuration
export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}