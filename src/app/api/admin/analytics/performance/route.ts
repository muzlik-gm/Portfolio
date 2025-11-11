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

    const baseQuery = {
      timestamp: { $gte: startDate }
    };

    // Get performance metrics
    const performanceData = await Analytics.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: null,
          totalEvents: { $sum: 1 },
          avgDuration: { $avg: '$duration' },
          pageViews: {
            $sum: {
              $cond: [{ $eq: ['$eventType', 'page_view'] }, 1, 0]
            }
          },
          contentViews: {
            $sum: {
              $cond: [{ $eq: ['$eventType', 'content_view'] }, 1, 0]
            }
          },
          downloads: {
            $sum: {
              $cond: [{ $eq: ['$eventType', 'download'] }, 1, 0]
            }
          },
          shares: {
            $sum: {
              $cond: [{ $eq: ['$eventType', 'share'] }, 1, 0]
            }
          },
          contacts: {
            $sum: {
              $cond: [{ $eq: ['$eventType', 'contact_form'] }, 1, 0]
            }
          },
          searches: {
            $sum: {
              $cond: [{ $eq: ['$eventType', 'search'] }, 1, 0]
            }
          }
        }
      }
    ]);

    const result = performanceData[0] || {
      totalEvents: 0,
      avgDuration: 0,
      pageViews: 0,
      contentViews: 0,
      downloads: 0,
      shares: 0,
      contacts: 0,
      searches: 0
    };

    // Get device and browser performance
    const devicePerformance = await Analytics.aggregate([
      { $match: { ...baseQuery, eventType: 'page_view' } },
      {
        $match: {
          $and: [
            { deviceType: { $exists: true } },
            { deviceType: { $ne: null } },
            { deviceType: { $ne: '' } }
          ]
        }
      },
      {
        $group: {
          _id: '$deviceType',
          count: { $sum: 1 },
          avgDuration: { $avg: '$duration' }
        }
      },
      {
        $project: {
          device: '$_id',
          count: 1,
          avgDuration: { $round: ['$avgDuration', 1] },
          percentage: 0 // Will be calculated
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Calculate percentages for device performance
    const totalDeviceViews = devicePerformance.reduce((sum, device) => sum + device.count, 0);
    const devicePerformanceWithPercentages = devicePerformance.map(device => ({
      ...device,
      percentage: totalDeviceViews > 0 ? Math.round((device.count / totalDeviceViews) * 100) : 0
    }));

    // Get top performing content
    const topContent = await Analytics.aggregate([
      {
        $match: {
          ...baseQuery,
          eventType: 'content_view',
          $and: [
            { url: { $ne: null } },
            { url: { $ne: '' } }
          ]
        }
      },
      {
        $group: {
          _id: '$url',
          views: { $sum: 1 },
          avgDuration: { $avg: '$duration' }
        }
      },
      {
        $project: {
          url: '$_id',
          views: 1,
          avgDuration: { $round: ['$avgDuration', 1] }
        }
      },
      { $sort: { views: -1 } },
      { $limit: 5 }
    ]);

    const responseData = {
      overview: {
        totalEvents: result.totalEvents,
        avgSessionDuration: Math.round(result.avgDuration || 0),
        pageViews: result.pageViews,
        contentViews: result.contentViews,
        downloads: result.downloads,
        shares: result.shares,
        contacts: result.contacts,
        searches: result.searches
      },
      devicePerformance: devicePerformanceWithPercentages,
      topContent,
      period
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Analytics performance API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}