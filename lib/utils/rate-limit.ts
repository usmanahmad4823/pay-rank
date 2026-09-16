import { NextResponse } from 'next/server';

interface RateLimitStore {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * Basic in-memory rate limiter for serverless environment.
 * Caps requests per windowMs.
 */
export function checkRateLimit(
  ip: string,
  limit: number = 10,
  windowMs: number = 60 * 1000
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now();
  
  if (!store[ip] || store[ip].resetTime < now) {
    store[ip] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return { success: true, remaining: limit - 1, reset: store[ip].resetTime };
  }

  if (store[ip].count >= limit) {
    return { success: false, remaining: 0, reset: store[ip].resetTime };
  }

  store[ip].count += 1;
  return { success: true, remaining: limit - store[ip].count, reset: store[ip].resetTime };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
