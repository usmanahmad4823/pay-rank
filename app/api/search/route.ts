import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  try {
    const results = await prisma.restaurant.findMany({
      where: {
        status: 'VERIFIED',
        OR: [
          { name: { contains: q } },
          { city: { contains: q } },
          { cuisine: { contains: q } },
        ],
      },
      take: 20,
    });
    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
