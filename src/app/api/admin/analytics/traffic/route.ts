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
    const type = searchParams.get('type') || 'geography'; // geography, devices, browsers

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
      timestamp: { $gte: startDate },
      eventType: 'page_view'
    };

    let aggregationPipeline: any[] = [];
    let groupByField = '';
    let sortBy = '';

    switch (type) {
      case 'geography':
        groupByField = 'country';
        sortBy = 'count';
        aggregationPipeline = [
          { $match: baseQuery },
          {
            $match: {
              $and: [
                { country: { $ne: null } },
                { country: { $ne: '' } }
              ]
            }
          },
          {
            $group: {
              _id: '$country',
              count: { $sum: 1 },
              uniqueVisitors: { $addToSet: '$sessionId' }
            }
          },
          {
            $project: {
              name: '$_id',
              count: 1,
              uniqueVisitors: { $size: '$uniqueVisitors' },
              percentage: 0 // Will be calculated after aggregation
            }
          },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ];
        break;

      case 'devices':
        groupByField = 'deviceType';
        sortBy = 'count';
        aggregationPipeline = [
          { $match: baseQuery },
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
              uniqueVisitors: { $addToSet: '$sessionId' }
            }
          },
          {
            $project: {
              name: '$_id',
              count: 1,
              uniqueVisitors: { $size: '$uniqueVisitors' },
              percentage: 0
            }
          },
          { $sort: { count: -1 } }
        ];
        break;

      case 'browsers':
        groupByField = 'browser';
        sortBy = 'count';
        aggregationPipeline = [
          { $match: baseQuery },
          {
            $match: {
              $and: [
                { browser: { $exists: true } },
                { browser: { $ne: null } },
                { browser: { $ne: '' } }
              ]
            }
          },
          {
            $group: {
              _id: '$browser',
              count: { $sum: 1 },
              uniqueVisitors: { $addToSet: '$sessionId' }
            }
          },
          {
            $project: {
              name: '$_id',
              count: 1,
              uniqueVisitors: { $size: '$uniqueVisitors' },
              percentage: 0
            }
          },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ];
        break;

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }

    const results = await Analytics.aggregate(aggregationPipeline);

    // Calculate total for percentages
    const total = results.reduce((sum, item) => sum + item.count, 0);

    // Format results with percentages
    const formattedResults = results.map(item => ({
      name: item.name,
      count: item.count,
      uniqueVisitors: item.uniqueVisitors,
      percentage: total > 0 ? Math.round((item.count / total) * 100) : 0
    }));

    return NextResponse.json({
      data: formattedResults,
      type,
      period,
      total
    });

  } catch (error) {
    console.error('Analytics traffic API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}