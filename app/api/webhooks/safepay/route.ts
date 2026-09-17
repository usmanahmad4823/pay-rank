import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySafepayWebhookSignature } from '@/lib/safepay';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature =
      request.headers.get('x-sfpy-signature') ||
      request.headers.get('x-safepay-signature') ||
      request.headers.get('safepay-signature') ||
      '';

    const webhookSecret = process.env.SAFEPAY_WEBHOOK_SECRET;

    // 1. Signature verification (if webhook secret is configured)
    if (webhookSecret && webhookSecret !== 'whsec_test_safepay_secret') {
      const isValid = verifySafepayWebhookSignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        console.error('Safepay Webhook Signature Verification Failed.');
        return NextResponse.json({ error: 'Invalid Safepay webhook signature.' }, { status: 400 });
      }
    }

    // 2. Parse Event Payload
    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
    }

    const eventType = payload.event || payload.type || payload.data?.event || 'payment.succeeded';
    const data = payload.data || payload;

    // Extract Safepay tracker token, paymentId, orderId
    const tracker = data.tracker || data.beacon || data.token || data.metadata?.tracker;
    const paymentId = data.payment_id || data.metadata?.paymentId || data.order_id;
    const reference = data.reference || data.sig || data.tracker || data.id || `ref_${Date.now()}`;
    const amountCents = data.amount_cents || (data.amount ? Math.round(data.amount * 100) : 0);

    // Filter relevant payment events
    const isSuccessEvent =
      eventType.includes('completed') ||
      eventType.includes('succeeded') ||
      eventType.includes('created') ||
      data.status === 'PAID' ||
      data.status === 'COMPLETED' ||
      data.state === 'PAID';

    if (!isSuccessEvent) {
      return NextResponse.json({ received: true, ignored: true, reason: 'Non-success event type' });
    }

    // 3. Find matching payment record
    let payment = null;

    if (paymentId) {
      payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    }

    if (!payment && tracker) {
      payment = await prisma.payment.findFirst({ where: { safepayTracker: tracker } });
    }

    if (!payment && reference) {
      payment = await prisma.payment.findFirst({ where: { safepayReference: reference } });
    }

    if (!payment) {
      console.warn('Safepay webhook received but matching payment record was not found:', { paymentId, tracker, reference });
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
    }

    // 4. Idempotency Check: Avoid double-counting duplicate webhooks
    if (payment.status === 'SUCCEEDED') {
      console.log(`Safepay webhook: Payment ${payment.id} already processed. Skipping duplicate processing.`);
      return NextResponse.json({ received: true, alreadyProcessed: true });
    }

    const payAmount = amountCents > 0 ? amountCents : payment.amountCents;

    // 5. Database Transaction: Update Payment & Restaurant atomically
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'SUCCEEDED',
          safepayTracker: tracker || payment.safepayTracker || `track_${payment.id}`,
          safepayReference: reference || payment.safepayReference || `ref_${payment.id}`,
          safepaySignature: signature || null,
          paymentMethod: 'safepay',
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

    console.log(`Safepay Payment ${payment.id} verified & succeeded. Restaurant ${payment.restaurantId} cumulative rank total increased +${payAmount} cents.`);

    return NextResponse.json({ received: true, status: 'SUCCEEDED' });
  } catch (error) {
    console.error('Safepay Webhook Error:', error);
    return NextResponse.json({ error: 'Internal server error processing Safepay webhook.' }, { status: 500 });
  }
}
