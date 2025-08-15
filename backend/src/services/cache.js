class MemoryCache {
  constructor() {
    this.store = new Map();
    this.expirations = new Map();
    this.intervals = new Map();
  }

  set(key, value, ttl = 0) {
    this.store.set(key, value);

    if (ttl > 0) {
      const timer = setTimeout(() => {
        this.del(key);
      }, ttl);
      this.intervals.set(key, timer);
    }

    return true;
  }

  get(key) {
    return this.store.get(key);
  }

  del(key) {
    if (this.intervals.has(key)) {
      clearTimeout(this.intervals.get(key));
      this.intervals.delete(key);
    }
    return this.store.delete(key);
  }

  hset(hash, field, value) {
    if (!this.store.has(hash)) {
      this.store.set(hash, new Map());
    }
    this.store.get(hash).set(field, value);
    return 1;
  }

  hget(hash, field) {
    return this.store.get(hash)?.get(field);
  }

  expire(key, seconds) {
    if (!this.store.has(key)) return 0;

    if (this.intervals.has(key)) {
      clearTimeout(this.intervals.get(key));
    }

    const timer = setTimeout(() => {
      this.del(key);
    }, seconds * 1000);

    this.intervals.set(key, timer);
    return 1;
  }
}

module.exports = new MemoryCache();
