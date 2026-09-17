import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe, isMockPaymentEnabled } from '@/lib/stripe';
import { createSafepayTracker, getSafepayCheckoutUrl } from '@/lib/safepay';
import { normalizeString, formatCityName, resolveLocationDetails } from '@/lib/city-utils';
import { checkRateLimit } from '@/lib/rate-limit';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimit(request, 10, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many registration requests. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, city, province: rawProvince, cuisine, description, logoUrl, bidCents, allowDuplicate } = body;

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
    if (isNaN(parsedBidCents) || parsedBidCents < 4) {
      return NextResponse.json({ error: 'Minimum entry bid is 10 PKR ($0.04).' }, { status: 400 });
    }

    const normalizedName = normalizeString(name);
    const location = resolveLocationDetails(city, rawProvince);

    // 2. Duplicate detection (same name + same city)
    if (!allowDuplicate) {
      const existing = await prisma.restaurant.findFirst({
        where: {
          normalizedName,
          normalizedCity: location.normalizedCity,
          status: 'VERIFIED',
        },
      });

      if (existing) {
        return NextResponse.json({
          isDuplicate: true,
          message: `"${name}" in ${location.displayCity} is already listed! You can top-up the existing listing to raise its rank.`,
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
        city: location.displayCity,
        normalizedCity: location.normalizedCity,
        province: location.province,
        normalizedProvince: location.normalizedProvince,
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
        paymentMethod: 'safepay',
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // 4. Safepay Payment Checkout Session
    const redirectUrl = `${appUrl}/checkout/success?restaurant_id=${restaurant.id}&payment_id=${payment.id}&token=${ownerEditToken}`;
    const cancelUrl = `${appUrl}/?canceled=true`;

    const { trackerToken, isMock } = await createSafepayTracker({
      amountCents: parsedBidCents,
      currency: 'PKR',
      orderId: payment.id,
      metadata: {
        type: 'initial_registration',
        restaurantId: restaurant.id,
        paymentId: payment.id,
      },
    });

    const safepayCheckoutUrl = (isMock || isMockPaymentEnabled())
      ? `${appUrl}/checkout/success?session_id=mock_session_${payment.id}&restaurant_id=${restaurant.id}&payment_id=${payment.id}&token=${ownerEditToken}`
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
      restaurantId: restaurant.id,
      ownerEditToken,
      safepayCheckoutUrl,
      stripeCheckoutUrl: safepayCheckoutUrl, // backwards-compatible alias
      paymentId: payment.id,
      isMock,
    });
  } catch (error) {
    console.error('Error registering restaurant:', error);
    return NextResponse.json({ error: 'Failed to process registration.' }, { status: 500 });
  }
}
