import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20' as any,
      typescript: true,
    })
  : null;

export const isMockPaymentEnabled = (): boolean => {
  if (process.env.MOCK_PAYMENTS === 'false' && process.env.STRIPE_SECRET_KEY) {
    return false;
  }
  return !process.env.STRIPE_SECRET_KEY || process.env.MOCK_PAYMENTS === 'true';
};
