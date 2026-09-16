import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe, isMockPaymentEnabled } from '@/lib/stripe';
import { normalizeString, formatCityName } from '@/lib/city-utils';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, city, cuisine, description, logoUrl, bidCents, allowDuplicate } = body;

    // 1. Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Restaurant name is required.' }, { status: 400 });
    }

    if (!city || typeof city !== 'string' || city.trim().length === 0) {
      return NextResponse.json({ error: 'City is required.' }, { status: 400 });
    }

    if (!logoUrl || typeof logoUrl !== 'string' || logoUrl.trim().length === 0) {
      return NextResponse.json({ error: 'Logo image is required.' }, { status: 400 });
    }

    const parsedBidCents = parseInt(bidCents, 10);
    if (isNaN(parsedBidCents) || parsedBidCents < 100) {
      return NextResponse.json({ error: 'Minimum entry bid is $1.00 (100 cents).' }, { status: 400 });
    }

    const normalizedName = normalizeString(name);
    const normalizedCity = normalizeString(city);
    const formattedCity = formatCityName(city);

    // 2. Duplicate detection (same name + same city)
    if (!allowDuplicate) {
      const existing = await prisma.restaurant.findFirst({
        where: {
          normalizedName,
          normalizedCity,
          status: 'VERIFIED',
        },
      });

      if (existing) {
        return NextResponse.json({
          isDuplicate: true,
          message: `"${name}" in ${formattedCity} is already listed! You can top-up the existing listing to raise its rank.`,
          existingListing: {
            id: existing.id,
            name: existing.name,
            city: existing.city,
            totalPaidCents: existing.totalPaidCents,
            logoUrl: existing.logoUrl,
          },
        }, { status: 409 });
      }
    }

    // 3. Create Pending Restaurant & Payment
    const ownerEditToken = `tok_${randomUUID().replace(/-/g, '')}`;

    const restaurant = await prisma.restaurant.create({
      data: {
        name: name.trim(),
        normalizedName,
        city: formattedCity,
        normalizedCity,
        cuisine: cuisine ? cuisine.trim() : null,
        description: description ? description.trim() : null,
        logoUrl: logoUrl.trim(),
        totalPaidCents: 0,
        ownerEditToken,
        status: 'PENDING_PAYMENT',
      },
    });

    const payment = await prisma.payment.create({
      data: {
        restaurantId: restaurant.id,
        amountCents: parsedBidCents,
        status: 'PENDING',
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // 4. Stripe Checkout Session or Mock Session
    if (isMockPaymentEnabled() || !stripe) {
      const mockCheckoutUrl = `${appUrl}/checkout/success?session_id=mock_session_${payment.id}&restaurant_id=${restaurant.id}&payment_id=${payment.id}&token=${ownerEditToken}`;
      
      return NextResponse.json({
        restaurantId: restaurant.id,
        ownerEditToken,
        stripeCheckoutUrl: mockCheckoutUrl,
        paymentId: payment.id,
        isMock: true,
      });
    }

    // Real Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Pay-to-Rank Listing: ${restaurant.name}`,
              description: `Initial rank bid for ${restaurant.name} in ${restaurant.city} (Non-Refundable)`,
              images: restaurant.logoUrl.startsWith('http') ? [restaurant.logoUrl] : undefined,
            },
            unit_amount: parsedBidCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&restaurant_id=${restaurant.id}&token=${ownerEditToken}`,
      cancel_url: `${appUrl}/?canceled=true`,
      metadata: {
        type: 'initial_registration',
        restaurantId: restaurant.id,
        paymentId: payment.id,
        amountCents: parsedBidCents.toString(),
      },
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({
      restaurantId: restaurant.id,
      ownerEditToken,
      stripeCheckoutUrl: session.url,
      paymentId: payment.id,
      isMock: false,
    });
  } catch (error) {
    console.error('Error registering restaurant:', error);
    return NextResponse.json({ error: 'Failed to process registration.' }, { status: 500 });
  }
}
