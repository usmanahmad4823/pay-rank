import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  const bodyText = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: any;

  if (webhookSecret && stripe) {
    try {
      event = stripe.webhooks.constructEvent(bodyText, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Stripe Webhook Signature Verification Failed: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }
  } else {
    // If webhook secret is not set, parse body as JSON for dev/testing
    try {
      event = JSON.parse(bodyText);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
  }

  try {
    if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
      const session = event.data.object;
      const metadata = session.metadata || {};
      const sessionId = session.id;
      const paymentId = metadata.paymentId;
      const restaurantId = metadata.restaurantId;
      const amountCents = parseInt(metadata.amountCents || '0', 10);

      let payment = null;

      if (paymentId) {
        payment = await prisma.payment.findUnique({ where: { id: paymentId } });
      } else if (sessionId) {
        payment = await prisma.payment.findUnique({ where: { stripeSessionId: sessionId } });
      }

      if (payment && payment.status !== 'SUCCEEDED') {
        const payAmount = amountCents > 0 ? amountCents : payment.amountCents;

        // Transactionally update payment and restaurant total
        await prisma.$transaction([
          prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'SUCCEEDED',
              stripePaymentIntentId: session.payment_intent || null,
            },
          }),
          prisma.restaurant.update({
            where: { id: payment.restaurantId },
            data: {
              status: 'VERIFIED',
              totalPaidCents: {
                increment: payAmount,
              },
            },
          }),
        ]);

        console.log(`Payment ${payment.id} succeeded. Updated restaurant ${payment.restaurantId} +${payAmount} cents.`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook event:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
