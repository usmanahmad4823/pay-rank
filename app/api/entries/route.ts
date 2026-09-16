import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: { status: 'VERIFIED' },
      orderBy: { totalPaidCents: 'desc' },
    });
    return NextResponse.json({ success: true, entries: restaurants });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }
}
