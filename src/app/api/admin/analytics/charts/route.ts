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
    const type = searchParams.get('type') || 'timeline'; // timeline, top_pages, engagement

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    let groupBy: string;

    switch (period) {
      case 'daily':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        groupBy = '%Y-%m-%d-%H'; // Group by hour
        break;
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupBy = '%Y-%m-%d'; // Group by day
        break;
      case 'monthly':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        groupBy = '%Y-%m-%d'; // Group by day
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupBy = '%Y-%m-%d';
    }

    const baseQuery = {
      timestamp: { $gte: startDate },
      eventType: 'page_view'
    };

    let data: any[] = [];

    switch (type) {
      case 'timeline':
        // Get page views over time
        const timelineData = await Analytics.aggregate([
          { $match: baseQuery },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: groupBy,
                  date: '$timestamp'
                }
              },
              pageViews: { $sum: 1 },
              uniqueVisitors: { $addToSet: '$sessionId' }
            }
          },
          {
            $project: {
              date: '$_id',
              pageViews: 1,
              uniqueVisitors: { $size: '$uniqueVisitors' }
            }
          },
          { $sort: { date: 1 } }
        ]);

        data = timelineData.map(item => ({
          date: item.date,
          pageViews: item.pageViews,
          uniqueVisitors: item.uniqueVisitors
        }));
        break;

      case 'top_pages':
        // Get most visited pages
        const topPagesData = await Analytics.aggregate([
          { $match: baseQuery },
          {
            $match: {
              $and: [
                { url: { $ne: null } },
                { url: { $ne: '' } }
              ]
            }
          },
          {
            $group: {
              _id: '$url',
              pageViews: { $sum: 1 },
              uniqueVisitors: { $addToSet: '$sessionId' },
              avgDuration: { $avg: '$duration' }
            }
          },
          {
            $project: {
              url: '$_id',
              pageViews: 1,
              uniqueVisitors: { $size: '$uniqueVisitors' },
              avgDuration: { $round: ['$avgDuration', 1] }
            }
          },
          { $sort: { pageViews: -1 } },
          { $limit: 10 }
        ]);

        data = topPagesData;
        break;

      case 'engagement':
        // Get engagement metrics
        const engagementData = await Analytics.aggregate([
          { $match: baseQuery },
          {
            $group: {
              _id: null,
              totalPageViews: { $sum: 1 },
              totalDuration: { $sum: '$duration' },
              bounceRate: {
                $avg: {
                  $cond: [
                    { $and: [{ $ne: ['$duration', null] }, { $lt: ['$duration', 10] }] },
                    1,
                    0
                  ]
                }
              }
            }
          }
        ]);

        if (engagementData.length > 0) {
          const result = engagementData[0];
          data = [{
            totalPageViews: result.totalPageViews,
            avgDuration: result.totalDuration / result.totalPageViews || 0,
            bounceRate: Math.round(result.bounceRate * 100)
          }];
        } else {
          data = [{
            totalPageViews: 0,
            avgDuration: 0,
            bounceRate: 0
          }];
        }
        break;

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }

    return NextResponse.json({
      data,
      type,
      period
    });

  } catch (error) {
    console.error('Analytics charts API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}