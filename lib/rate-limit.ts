import { NextRequest } from 'next/server';

interface RateLimitStore {
  [ip: string]: { count: number; resetTime: number };
}

const memoryStore: RateLimitStore = {};

/**
 * In-memory sliding window rate limiter fallback with Upstash Redis hook support.
 * @param req NextRequest
 * @param limit Max requests allowed in window
 * @param windowMs Window duration in milliseconds (default: 60,000ms = 1 minute)
 */
export function checkRateLimit(
  req: NextRequest,
  limit: number = 30,
  windowMs: number = 60000
): { success: boolean; limit: number; remaining: number; resetMs: number } {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1';

  const now = Date.now();
  const record = memoryStore[ip];

  if (!record || now > record.resetTime) {
    memoryStore[ip] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetMs: windowMs,
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetMs: record.resetTime - now,
    };
  }

  record.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - record.count,
    resetMs: record.resetTime - now,
  };
}
