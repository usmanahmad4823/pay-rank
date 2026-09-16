import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId } = body;

    if (!paymentId) {
      return NextResponse.json({ error: 'paymentId is required' }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'SUCCEEDED',
        },
      }),
      prisma.restaurant.update({
        where: { id: payment.restaurantId },
        data: {
          status: 'VERIFIED',
          totalPaidCents: {
            increment: payment.amountCents,
          },
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in mock pay:', error);
    return NextResponse.json({ error: 'Failed to process mock pay' }, { status: 500 });
  }
}
