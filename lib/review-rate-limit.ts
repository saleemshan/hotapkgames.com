/** In-memory rate limit for review POST (per deploy instance; sufficient for light abuse). */

type Bucket = { count: number; reset: number };

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_IP = 8;

const buckets = new Map<string, Bucket>();

function keyForIp(ip: string): string {
  return ip.trim() || "unknown";
}

export function reviewRateLimitOk(ip: string): boolean {
  const k = keyForIp(ip);
  const now = Date.now();
  let b = buckets.get(k);
  if (!b || now > b.reset) {
    b = { count: 0, reset: now + WINDOW_MS };
    buckets.set(k, b);
  }
  if (b.count >= MAX_PER_IP) return false;
  b.count += 1;
  return true;
}
