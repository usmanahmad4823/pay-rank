import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const TRANSPARENT_GIF_BUFFER = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

async function recordVisit(path: string, request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';

    // 1. Record PageView in database
    await prisma.pageView.create({
      data: {
        path: path || '/',
        ip: ip.split(',')[0].trim(),
      },
    });

    // 2. Increment SiteStats totalVisitors counter in database
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

    return stats.totalVisitors;
  } catch (error: any) {
    console.error('Error recording visit:', error);
    return 1;
  }
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

    const totalVisitors = await recordVisit(path, request);

    return NextResponse.json(
      { success: true, totalVisitors },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error: any) {
    console.error('Error in POST track-visit:', error);
    return NextResponse.json({ error: 'Failed to record visit' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const path = url.searchParams.get('path') || '/';

    const totalVisitors = await recordVisit(path, request);

    // If request format expects image (beacon)
    if (url.searchParams.get('img') === '1' || url.searchParams.get('beacon') === '1') {
      return new NextResponse(TRANSPARENT_GIF_BUFFER, {
        headers: {
          'Content-Type': 'image/gif',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    }

    return NextResponse.json(
      { success: true, totalVisitors },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error: any) {
    console.error('Error in GET track-visit:', error);
    return NextResponse.json({ error: 'Failed to record visit' }, { status: 500 });
  }
}
