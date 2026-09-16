import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isMockPaymentEnabled } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id') || '';
    const restaurantId = searchParams.get('restaurant_id') || '';
    const paymentId = searchParams.get('payment_id') || '';
    const token = searchParams.get('token') || '';

    let restaurant = null;

    if (restaurantId) {
      restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
      });
    } else if (token) {
      restaurant = await prisma.restaurant.findUnique({
        where: { ownerEditToken: token },
      });
    }

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant record not found.' }, { status: 404 });
    }

    // Handles mock checkout auto-verification in dev/testing mode
    if (isMockPaymentEnabled() || sessionId.startsWith('mock_')) {
      // Find pending payment for this restaurant
      const pendingPayment = paymentId
        ? await prisma.payment.findUnique({ where: { id: paymentId } })
        : await prisma.payment.findFirst({
            where: { restaurantId: restaurant.id, status: 'PENDING' },
            orderBy: { createdAt: 'desc' },
          });

      if (pendingPayment && pendingPayment.status === 'PENDING') {
        await prisma.$transaction([
          prisma.payment.update({
            where: { id: pendingPayment.id },
            data: { status: 'SUCCEEDED' },
          }),
          prisma.restaurant.update({
            where: { id: restaurant.id },
            data: {
              status: 'VERIFIED',
              totalPaidCents: { increment: pendingPayment.amountCents },
            },
          }),
        ]);

        // Refetch updated restaurant
        restaurant = await prisma.restaurant.findUnique({
          where: { id: restaurant.id },
        });
      }
    }

    if (!restaurant || restaurant.status !== 'VERIFIED') {
      return NextResponse.json({
        verified: false,
        status: restaurant?.status || 'PENDING_PAYMENT',
        message: 'Payment verification pending. Please wait a moment...',
      });
    }

    // Calculate current city rank & national rank
    const higherPaidInCity = await prisma.restaurant.count({
      where: {
        status: 'VERIFIED',
        normalizedCity: restaurant.normalizedCity,
        totalPaidCents: { gt: restaurant.totalPaidCents },
      },
    });

    const higherPaidNationally = await prisma.restaurant.count({
      where: {
        status: 'VERIFIED',
        totalPaidCents: { gt: restaurant.totalPaidCents },
      },
    });

    return NextResponse.json({
      verified: true,
      restaurantId: restaurant.id,
      name: restaurant.name,
      city: restaurant.city,
      normalizedCity: restaurant.normalizedCity,
      logoUrl: restaurant.logoUrl,
      totalPaidCents: restaurant.totalPaidCents,
      ownerEditToken: restaurant.ownerEditToken,
      rankInCity: higherPaidInCity + 1,
      rankNational: higherPaidNationally + 1,
    });
  } catch (error) {
    console.error('Error in checkout status:', error);
    return NextResponse.json({ error: 'Failed to check verification status.' }, { status: 500 });
  }
}
