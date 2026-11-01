import crypto from "crypto";

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

// In-memory 2-hour LRU request cache
const requestCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

// In-memory IP usage counters (resets daily)
const dailyCounter = new Map<string, { count: number; resetAt: number }>();
// In-memory IP sliding window rate limiter (requests per minute)
const rateLimitMap = new Map<string, { requests: number; windowStart: number }>();

const MAX_CALLS_PER_DAY = 100;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 20;

export function hashPromptKey(prefix: string, payload: unknown): string {
  const json = JSON.stringify(payload);
  return crypto.createHash("sha256").update(`${prefix}:${json}`).digest("hex");
}

export function getCachedResponse<T>(cacheKey: string): T | null {
  const entry = requestCache.get(cacheKey);
  if (!entry) return null;

  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    requestCache.delete(cacheKey);
    return null;
  }

  return entry.data as T;
}

export function setCachedResponse(cacheKey: string, data: unknown): void {
  // Prune cache if exceeds 500 items
  if (requestCache.size > 500) {
    const oldestKey = requestCache.keys().next().value;
    if (oldestKey) requestCache.delete(oldestKey);
  }
  requestCache.set(cacheKey, { data, timestamp: Date.now() });
}

/**
 * Checks and increments rate limit per client IP
 */
export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { requests: 1, windowStart: now });
    return { allowed: true };
  }

  if (record.requests >= MAX_REQUESTS_PER_MINUTE) {
    const retryAfter = Math.ceil((record.windowStart + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfterSeconds: Math.max(1, retryAfter) };
  }

  record.requests += 1;
  return { allowed: true };
}

/**
 * Checks and tracks daily free-tier quota per client IP
 */
export function checkDailyQuota(ip: string): { withinQuota: boolean; currentCount: number } {
  const now = Date.now();
  const record = dailyCounter.get(ip);

  if (!record || now > record.resetAt) {
    // Next midnight reset
    const nextReset = new Date();
    nextReset.setHours(24, 0, 0, 0);
    dailyCounter.set(ip, { count: 1, resetAt: nextReset.getTime() });
    return { withinQuota: true, currentCount: 1 };
  }

  if (record.count >= MAX_CALLS_PER_DAY) {
    return { withinQuota: false, currentCount: record.count };
  }

  record.count += 1;
  return { withinQuota: true, currentCount: record.count };
}
