import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe, isMockPaymentEnabled } from '@/lib/stripe';

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
    if (isNaN(parsedAddCents) || parsedAddCents < 100) {
      return NextResponse.json({ error: 'Minimum top-up amount is $1.00 (100 cents).' }, { status: 400 });
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
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (isMockPaymentEnabled() || !stripe) {
      const mockCheckoutUrl = `${appUrl}/checkout/success?session_id=mock_topup_${payment.id}&restaurant_id=${restaurant.id}&payment_id=${payment.id}&token=${restaurant.ownerEditToken}&topup=true`;

      return NextResponse.json({
        stripeCheckoutUrl: mockCheckoutUrl,
        paymentId: payment.id,
        isMock: true,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Rank Top-Up: ${restaurant.name}`,
              description: `Additional $${(parsedAddCents / 100).toFixed(2)} top-up for ${restaurant.name} in ${restaurant.city} (Non-Refundable)`,
              images: restaurant.logoUrl.startsWith('http') ? [restaurant.logoUrl] : undefined,
            },
            unit_amount: parsedAddCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&restaurant_id=${restaurant.id}&token=${restaurant.ownerEditToken}&topup=true`,
      cancel_url: `${appUrl}/?canceled=true`,
      metadata: {
        type: 'rank_topup',
        restaurantId: restaurant.id,
        paymentId: payment.id,
        amountCents: parsedAddCents.toString(),
      },
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({
      stripeCheckoutUrl: session.url,
      paymentId: payment.id,
      isMock: false,
    });
  } catch (error) {
    console.error('Error processing top-up:', error);
    return NextResponse.json({ error: 'Failed to process top-up payment.' }, { status: 500 });
  }
}
