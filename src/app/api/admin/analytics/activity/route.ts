import { NextRequest, NextResponse } from 'next/server';
import { dbConnect, Analytics } from '@/lib/models';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const adminUser = await verifyAdminToken(token);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'weekly';
    const limit = parseInt(searchParams.get('limit') || '20');

    // Calculate date range
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'daily':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get recent activities
    const activities = await Analytics.find({
      timestamp: { $gte: startDate },
      eventType: { $in: ['page_view', 'content_view', 'download', 'share', 'like', 'comment', 'search', 'contact_form'] }
    })
    .sort({ timestamp: -1 })
    .limit(limit)
    .select('eventType eventData url timestamp userAgent deviceType country city')
    .lean();

    // Format activities for frontend
    const formattedActivities = activities.map(activity => {
      let icon = '';
      let message = '';
      let details = '';

      switch (activity.eventType) {
        case 'page_view':
          icon = '👁️';
          message = `Page visited: ${activity.url || 'Unknown page'}`;
          details = `${activity.city || 'Unknown'}, ${activity.country || 'Unknown'}`;
          break;
        case 'content_view':
          icon = '📄';
          message = `Content viewed: ${activity.url || 'Unknown content'}`;
          details = `${activity.city || 'Unknown'}, ${activity.country || 'Unknown'}`;
          break;
        case 'download':
          icon = '📥';
          message = `Download requested: ${activity.url || 'Unknown file'}`;
          break;
        case 'share':
          icon = '🔗';
          message = `Content shared: ${activity.url || 'Unknown content'}`;
          break;
        case 'like':
          icon = '❤️';
          message = `Content liked: ${activity.url || 'Unknown content'}`;
          break;
        case 'comment':
          icon = '💬';
          message = `Comment added: ${activity.url || 'Unknown content'}`;
          break;
        case 'search':
          icon = '🔍';
          message = `Search performed: ${activity.eventData?.query || 'Unknown query'}`;
          break;
        case 'contact_form':
          icon = '📧';
          message = 'Contact form submitted';
          break;
        default:
          icon = '📊';
          message = 'Unknown activity';
      }

      // Calculate time ago
      const timeDiff = Date.now() - new Date(activity.timestamp).getTime();
      let timeAgo = '';
      if (timeDiff < 60 * 1000) {
        timeAgo = 'Just now';
      } else if (timeDiff < 60 * 60 * 1000) {
        timeAgo = `${Math.floor(timeDiff / (60 * 1000))} minutes ago`;
      } else if (timeDiff < 24 * 60 * 60 * 1000) {
        timeAgo = `${Math.floor(timeDiff / (60 * 60 * 1000))} hours ago`;
      } else {
        timeAgo = `${Math.floor(timeDiff / (24 * 60 * 60 * 1000))} days ago`;
      }

      return {
        id: activity._id,
        icon,
        message,
        details,
        timeAgo,
        timestamp: activity.timestamp,
        device: activity.deviceType || 'Unknown',
        location: `${activity.city || 'Unknown'}, ${activity.country || 'Unknown'}`,
        type: activity.eventType
      };
    });

    return NextResponse.json({
      activities: formattedActivities,
      period,
      total: activities.length
    });

  } catch (error) {
    console.error('Analytics activity API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}