import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function recordVisit(path: string, request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';

  // 1. Record PageView
  await prisma.pageView.create({
    data: {
      path,
      ip: ip.split(',')[0].trim(),
    },
  }).catch((e) => console.error('PageView record error:', e));

  // 2. Increment SiteStats totalVisitors counter
  const stats = await prisma.siteStats.upsert({
    where: { id: 'global' },
    update: {
      totalVisitors: { increment: 1 },
    },
    create: {
      id: 'global',
      totalVisitors: 1,
    },
  });

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const todayVisitors = await prisma.pageView.count({
    where: {
      createdAt: { gte: startOfToday },
    },
  });

  return {
    totalVisitors: stats.totalVisitors,
    todayVisitors,
  };
}

export async function POST(request: NextRequest) {
  try {
    let path = '/';
    try {
      const body = await request.json();
      if (body && body.path) path = body.path;
    } catch {
      // Body parse optional
    }

    const data = await recordVisit(path, request);

    return NextResponse.json(
      {
        success: true,
        totalVisitors: data.totalVisitors,
        todayVisitors: data.todayVisitors,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error: any) {
    console.error('Error tracking visitor pageview:', error);
    return NextResponse.json({ error: 'Failed to record visit' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const track = url.searchParams.get('track');

    if (track === '1' || track === 'true') {
      const data = await recordVisit('/', request);
      return NextResponse.json(
        {
          success: true,
          totalVisitors: data.totalVisitors,
          todayVisitors: data.todayVisitors,
        },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        }
      );
    }

    const stats = await prisma.siteStats.findUnique({
      where: { id: 'global' },
    });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayVisitors = await prisma.pageView.count({
      where: {
        createdAt: { gte: startOfToday },
      },
    });

    const pageViewsCount = await prisma.pageView.count();
    const totalCount = Math.max(1, stats?.totalVisitors || 0, pageViewsCount);

    return NextResponse.json(
      {
        success: true,
        totalVisitors: totalCount,
        todayVisitors,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching visitor stats:', error);
    return NextResponse.json({ error: 'Failed to fetch visitor stats' }, { status: 500 });
  }
}
