import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe, isMockPaymentEnabled } from '@/lib/stripe';
import { createSafepayTracker, getSafepayCheckoutUrl } from '@/lib/safepay';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const restaurantId = params.id;
    const body = await request.json();
    const { ownerEditToken, addCents } = body;

    if (!ownerEditToken || typeof ownerEditToken !== 'string') {
      return NextResponse.json({ error: 'Owner edit token is required for top-up authorization.' }, { status: 401 });
    }

    const parsedAddCents = parseInt(addCents, 10);
    if (isNaN(parsedAddCents) || parsedAddCents < 4) {
      return NextResponse.json({ error: 'Minimum top-up amount is 10 PKR ($0.04).' }, { status: 400 });
    }

    // Verify restaurant and owner token
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found.' }, { status: 404 });
    }

    if (restaurant.ownerEditToken !== ownerEditToken.trim()) {
      return NextResponse.json({ error: 'Invalid owner edit token. Action unauthorized.' }, { status: 403 });
    }

    // Create top-up payment record
    const payment = await prisma.payment.create({
      data: {
        restaurantId: restaurant.id,
        amountCents: parsedAddCents,
        status: 'PENDING',
        paymentMethod: 'safepay',
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Safepay Checkout Session Creation
    const redirectUrl = `${appUrl}/checkout/success?restaurant_id=${restaurant.id}&payment_id=${payment.id}&token=${restaurant.ownerEditToken}&topup=true`;
    const cancelUrl = `${appUrl}/?canceled=true`;

    const { trackerToken, isMock } = await createSafepayTracker({
      amountCents: parsedAddCents,
      currency: 'PKR',
      orderId: payment.id,
      metadata: {
        type: 'rank_topup',
        restaurantId: restaurant.id,
        paymentId: payment.id,
      },
    });

    const safepayCheckoutUrl = (isMock || isMockPaymentEnabled())
      ? `${appUrl}/checkout/success?session_id=mock_topup_${payment.id}&restaurant_id=${restaurant.id}&payment_id=${payment.id}&token=${restaurant.ownerEditToken}&topup=true`
      : getSafepayCheckoutUrl({
          trackerToken,
          orderId: payment.id,
          redirectUrl,
          cancelUrl,
        });

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        safepayTracker: trackerToken,
        paymentMethod: 'safepay',
      },
    });

    return NextResponse.json({
      safepayCheckoutUrl,
      stripeCheckoutUrl: safepayCheckoutUrl, // backwards-compatible alias
      paymentId: payment.id,
      isMock,
    });
  } catch (error) {
    console.error('Error processing top-up:', error);
    return NextResponse.json({ error: 'Failed to process top-up payment.' }, { status: 500 });
  }
}
