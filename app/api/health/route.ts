import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const startTime = Date.now();

  try {
    // 1. Verify Database Connection
    const count = await prisma.restaurant.count();
    const responseTimeMs = Date.now() - startTime;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        restaurantCount: count,
        responseTimeMs,
      },
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message || 'Database connection failure',
      },
      { status: 503 }
    );
  }
}
