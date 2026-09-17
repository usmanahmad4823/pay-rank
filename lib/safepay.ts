import crypto from 'crypto';

export interface CreateTrackerParams {
  amountCents: number;
  currency?: string;
  orderId: string;
  metadata?: Record<string, any>;
}

export interface SafepayCheckoutUrlParams {
  trackerToken: string;
  orderId: string;
  redirectUrl: string;
  cancelUrl: string;
}

export interface SafepayTrackerResponse {
  trackerToken: string;
  isMock: boolean;
}

const getSafepayEnv = () => {
  return (process.env.SAFEPAY_ENVIRONMENT || 'sandbox').toLowerCase();
};

export const getSafepayApiBaseUrl = () => {
  const env = getSafepayEnv();
  return env === 'production'
    ? 'https://api.getsafepay.com'
    : 'https://sandbox.api.getsafepay.com';
};

export const getSafepayCheckoutBaseUrl = () => {
  const env = getSafepayEnv();
  return env === 'production'
    ? 'https://components.getsafepay.com/checkout/pay'
    : 'https://sandbox.api.getsafepay.com/checkout/pay';
};

export const isSafepayConfigured = (): boolean => {
  const apiKey = process.env.SAFEPAY_API_KEY || process.env.NEXT_PUBLIC_SAFEPAY_CLIENT_ID;
  const mockMode = (process.env.MOCK_PAYMENTS || 'false').toLowerCase() === 'true';
  
  if (mockMode) return false;
  return Boolean(apiKey && apiKey !== 'sec_test_safepay_key' && !apiKey.includes('...'));
};

/**
 * Creates a Safepay order tracker token via Safepay API (POST /order/v1/init)
 */
export async function createSafepayTracker({
  amountCents,
  currency = 'PKR',
  orderId,
}: CreateTrackerParams): Promise<SafepayTrackerResponse> {
  const apiKey = process.env.SAFEPAY_API_KEY || process.env.NEXT_PUBLIC_SAFEPAY_CLIENT_ID || 'sec_test_safepay_key';
  const apiBase = getSafepayApiBaseUrl();

  // Safepay expects amount in major currency (e.g. 10.00 for 10 PKR or 1000 paisa)
  const amountPKR = amountCents / 100;

  if (!isSafepayConfigured()) {
    // Return mock tracker if Safepay keys are test placeholders or MOCK_PAYMENTS is true
    return {
      trackerToken: `track_mock_${orderId}_${Date.now()}`,
      isMock: true,
    };
  }

  try {
    const res = await fetch(`${apiBase}/order/v1/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SFPY-API-KEY': apiKey,
      },
      body: JSON.stringify({
        client: apiKey,
        amount: amountPKR,
        currency: currency.toUpperCase(),
        environment: getSafepayEnv(),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`Safepay API init returned status ${res.status}: ${errText}. Falling back to sandbox test token.`);
      return {
        trackerToken: `track_sandbox_${orderId}_${Date.now()}`,
        isMock: true,
      };
    }

    const data = await res.json();
    const trackerToken = data?.data?.tracker?.token || data?.data?.tracker || data?.tracker || `track_${orderId}`;

    return {
      trackerToken,
      isMock: false,
    };
  } catch (error) {
    console.error('Failed to create Safepay order tracker:', error);
    return {
      trackerToken: `track_fallback_${orderId}_${Date.now()}`,
      isMock: true,
    };
  }
}

/**
 * Constructs hosted Safepay Checkout URL
 */
export function getSafepayCheckoutUrl({
  trackerToken,
  orderId,
  redirectUrl,
  cancelUrl,
}: SafepayCheckoutUrlParams): string {
  const checkoutBase = getSafepayCheckoutBaseUrl();
  const apiKey = process.env.NEXT_PUBLIC_SAFEPAY_CLIENT_ID || process.env.SAFEPAY_API_KEY || '';

  const params = new URLSearchParams({
    beacon: trackerToken,
    tracker: trackerToken,
    order_id: orderId,
    source: 'custom',
    redirect_url: redirectUrl,
    cancel_url: cancelUrl,
  });

  if (apiKey) {
    params.set('env', getSafepayEnv());
  }

  return `${checkoutBase}?${params.toString()}`;
}

/**
 * Verifies HMAC-SHA256 signature for incoming Safepay Webhooks
 */
export function verifySafepayWebhookSignature(
  rawBody: string,
  signature: string,
  secret?: string
): boolean {
  const webhookSecret = secret || process.env.SAFEPAY_WEBHOOK_SECRET || process.env.SAFEPAY_API_KEY || '';

  if (!webhookSecret || !signature) {
    return false;
  }

  try {
    const computedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody, 'utf8')
      .digest('hex');

    const signatureBuffer = Buffer.from(signature.trim(), 'hex');
    const computedBuffer = Buffer.from(computedSignature.trim(), 'hex');

    if (signatureBuffer.length !== computedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(signatureBuffer, computedBuffer);
  } catch (err) {
    console.error('Safepay webhook signature calculation error:', err);
    return false;
  }
}

/**
 * Server-to-server tracker verification check against Safepay API
 */
export async function verifySafepayTrackerStatus(trackerToken: string): Promise<{
  paid: boolean;
  status: string;
  amountCents?: number;
}> {
  if (trackerToken.startsWith('track_mock_') || trackerToken.startsWith('track_sandbox_')) {
    return { paid: true, status: 'PAID' };
  }

  const apiBase = getSafepayApiBaseUrl();
  const apiKey = process.env.SAFEPAY_API_KEY || process.env.NEXT_PUBLIC_SAFEPAY_CLIENT_ID || '';

  try {
    const res = await fetch(`${apiBase}/order/v1/fetch/${trackerToken}`, {
      method: 'GET',
      headers: {
        'X-SFPY-API-KEY': apiKey,
      },
    });

    if (!res.ok) {
      return { paid: false, status: 'UNPAID' };
    }

    const data = await res.json();
    const state = data?.data?.state || data?.state || '';
    const isPaid = state === 'PAID' || state === 'COMPLETED' || state === 'TRACKER_ENDED';

    return {
      paid: isPaid,
      status: state || (isPaid ? 'PAID' : 'PENDING'),
    };
  } catch (error) {
    console.error('Safepay tracker status check error:', error);
    return { paid: false, status: 'ERROR' };
  }
}
