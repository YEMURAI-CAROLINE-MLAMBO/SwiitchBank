import { createClient } from 'redis';

class CacheService {
  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
      socket: {
        connectTimeout: 60000,
        lazyConnect: true
      }
    });
    this.connected = false;
  }

  async connect() {
    if (!this.connected) {
      await this.client.connect();
      this.connected = true;
    }
  }

  async get(key) {
    try {
      await this.connect();
      const cached = await this.client.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null; // Fail silently, proceed without cache
    }
  }

  async set(key, value, ttl = 300) {
    try {
      await this.connect();
      await this.client.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  // Cache patterns for common queries
  async cacheUserTransactions(userId, dateRange, transactions) {
    const key = `user:${userId}:transactions:${dateRange}`;
    await this.set(key, transactions, 600); // 10 minutes for transaction data
  }

  async cacheSophiaAnalysis(userId, analysisType, data) {
    const key = `user:${userId}:sophia:${analysisType}`;
    await this.set(key, data, 1800); // 30 minutes for AI analysis
  }

  // Batch operations for performance
  async mget(keys) {
    try {
      await this.connect();
      const results = await this.client.mGet(keys);
      return results.map(result => result ? JSON.parse(result) : null);
    } catch (error) {
      return keys.map(() => null);
    }
  }
}

export default new CacheService();
