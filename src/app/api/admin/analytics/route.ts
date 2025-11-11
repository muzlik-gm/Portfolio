import { NextRequest, NextResponse } from 'next/server';
import { dbConnect, Analytics } from '@/lib/models';
import { verifyAdminToken } from '@/lib/auth';
import { getCachedData } from '@/lib/cache';

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

    // Get period from query params (daily, weekly, monthly)
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'monthly';

    // Calculate date ranges
    const now = new Date();
    let currentStart: Date;
    let previousStart: Date;
    let previousEnd: Date;

    switch (period) {
      case 'daily':
        currentStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        previousEnd = new Date(currentStart.getTime() - 1);
        previousStart = new Date(previousEnd.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        currentStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        previousEnd = new Date(currentStart.getTime() - 1);
        previousStart = new Date(previousEnd.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
      default:
        currentStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        previousEnd = new Date(currentStart.getTime() - 1);
        previousStart = new Date(previousEnd.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    // Cache key for analytics metrics
    const cacheKey = `analytics:${period}`;

    // Helper function to calculate metrics with caching
    const getMetrics = async (start: Date, end: Date, cacheSuffix: string) => {
      const query = { eventType: 'page_view', timestamp: { $gte: start, $lte: end } };

      return await getCachedData(
        `${cacheKey}:${cacheSuffix}`,
        async () => {
          // Page Views
          const pageViews = await Analytics.countDocuments(query);

          // Unique Visitors
          const uniqueVisitorsResult = await Analytics.distinct('sessionId', query);
          const uniqueVisitors = uniqueVisitorsResult.length;

          // Blog Views
          const blogViews = await Analytics.countDocuments({
            ...query,
            url: { $regex: '^/blog', $options: 'i' }
          });

          // Project Views
          const projectViews = await Analytics.countDocuments({
            ...query,
            url: { $regex: '^/projects', $options: 'i' }
          });

          return { pageViews, uniqueVisitors, blogViews, projectViews };
        },
        { ttl: 300 } // 5 minutes TTL for analytics data
      );
    };

    // Get current and previous metrics with caching
    const [currentMetrics, previousMetrics] = await Promise.all([
      getMetrics(currentStart, now, 'current'),
      getMetrics(previousStart, previousEnd, 'previous')
    ]);

    // Calculate changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? '+100%' : '0%';
      const change = ((current - previous) / previous) * 100;
      const sign = change >= 0 ? '+' : '';
      return `${sign}${change.toFixed(1)}%`;
    };

    const metrics = [
      {
        label: 'Page Views',
        value: currentMetrics.pageViews.toLocaleString(),
        change: calculateChange(currentMetrics.pageViews, previousMetrics.pageViews),
        color: currentMetrics.pageViews >= previousMetrics.pageViews ? 'text-green-600' : 'text-red-600'
      },
      {
        label: 'Unique Visitors',
        value: currentMetrics.uniqueVisitors.toLocaleString(),
        change: calculateChange(currentMetrics.uniqueVisitors, previousMetrics.uniqueVisitors),
        color: currentMetrics.uniqueVisitors >= previousMetrics.uniqueVisitors ? 'text-green-600' : 'text-red-600'
      },
      {
        label: 'Blog Views',
        value: currentMetrics.blogViews.toLocaleString(),
        change: calculateChange(currentMetrics.blogViews, previousMetrics.blogViews),
        color: currentMetrics.blogViews >= previousMetrics.blogViews ? 'text-green-600' : 'text-red-600'
      },
      {
        label: 'Project Views',
        value: currentMetrics.projectViews.toLocaleString(),
        change: calculateChange(currentMetrics.projectViews, previousMetrics.projectViews),
        color: currentMetrics.projectViews >= previousMetrics.projectViews ? 'text-green-600' : 'text-red-600'
      }
    ];

    return NextResponse.json({ metrics, period });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}