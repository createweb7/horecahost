type RateLimitBucket = { count: number; expiresAt: number };

const globalForRateLimit = globalThis as typeof globalThis & {
  enquiryRateLimitBuckets?: Map<string, RateLimitBucket>;
};

const buckets = globalForRateLimit.enquiryRateLimitBuckets ??= new Map();

export function isRateLimited(
  key: string,
  limit = 8,
  windowMs = 10 * 60 * 1000,
): boolean {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.expiresAt <= now) {
    buckets.set(key, { count: 1, expiresAt: now + windowMs });
    return false;
  }

  current.count += 1;
  if (current.count > limit) return true;

  // Bound memory use if callers distribute requests across many addresses.
  if (buckets.size > 5000) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.expiresAt <= now) buckets.delete(bucketKey);
    }
  }

  return false;
}

export function getClientAddress(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  return headers.get("x-real-ip")?.trim() || forwardedFor?.split(",")[0]?.trim() || "";
}
