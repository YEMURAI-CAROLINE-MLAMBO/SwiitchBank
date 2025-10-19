class RateLimiter {
  constructor() {
    this.requests = new Map();
  }

  check(identifier, limit = 100, windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;

    const clientData = this.requests.get(identifier) || [];
    const recentRequests = clientData.filter(time => time > windowStart);

    if (recentRequests.length >= limit) {
      throw new Error('Rate limit exceeded');
    }

    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);

    return {
      allowed: true,
      remaining: limit - recentRequests.length
    };
  }
}
