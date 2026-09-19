import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    let path = '/';
    try {
      const body = await request.json();
      if (body && body.path) path = body.path;
    } catch {
      // Body parse optional
    }

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';

    // 1. Record PageView
    await prisma.pageView.create({
      data: {
        path,
        ip: ip.split(',')[0].trim(),
      },
    });

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

    // 3. Count visitors today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayVisitors = await prisma.pageView.count({
      where: {
        createdAt: { gte: startOfToday },
      },
    });

    return NextResponse.json({
      success: true,
      totalVisitors: stats.totalVisitors,
      todayVisitors,
    });
  } catch (error: any) {
    console.error('Error tracking visitor pageview:', error);
    return NextResponse.json({ error: 'Failed to record visit' }, { status: 500 });
  }
}

export async function GET() {
  try {
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

    const totalCount = stats?.totalVisitors || await prisma.pageView.count();

    return NextResponse.json({
      success: true,
      totalVisitors: totalCount,
      todayVisitors,
    });
  } catch (error: any) {
    console.error('Error fetching visitor stats:', error);
    return NextResponse.json({ error: 'Failed to fetch visitor stats' }, { status: 500 });
  }
}
