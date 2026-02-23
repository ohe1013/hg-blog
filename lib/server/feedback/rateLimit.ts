const buckets = new Map<string, number[]>();

function pruneExpired(timestamps: number[], now: number, windowMs: number) {
  return timestamps.filter((ts) => now - ts < windowMs);
}

export function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const existing = buckets.get(key) ?? [];
  const kept = pruneExpired(existing, now, windowMs);
  kept.push(now);

  buckets.set(key, kept);
  return kept.length <= limit;
}
